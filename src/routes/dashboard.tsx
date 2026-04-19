import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import logo from "@/assets/raven-logo.png";
import { getDiscordSessionFromRequest } from "@/lib/auth";

const DISCORD_OWNER_ID = "1273671698255839315";

type TagPendente = {
  registro_id: string;
  user_id: string;
  nome: string;
  data_envio: string;
  message_id?: string | null;
  avisou_7_dias?: boolean;
  avisou_10_dias?: boolean;
  status?: string;
};

type Viewer = {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
} | null;

const getViewer = createServerFn({ method: "GET" }).handler(async () => {
  getRequestHeader("cookie");
  return getDiscordSessionFromRequest();
});

const getTagsPendentes = createServerFn({ method: "GET" }).handler(async () => {
  const viewer = getDiscordSessionFromRequest();

  if (!viewer) {
    return [];
  }

  try {
    const resultado = await env.DB.prepare(
      `
        SELECT
          user_id,
          nome,
          data_envio,
          avisou_7_dias,
          avisou_10_dias,
          status
        FROM tags_pendentes
        WHERE status = 'pendente'
        ORDER BY data_envio ASC
      `,
    ).all<{
      user_id: string;
      nome: string;
      data_envio: string;
      avisou_7_dias: number;
      avisou_10_dias: number;
      status: string;
    }>();

    return (resultado.results ?? []).map((registro) => ({
      registro_id: String(registro.user_id),
      user_id: String(registro.user_id),
      nome: registro.nome,
      data_envio: registro.data_envio,
      message_id: null,
      avisou_7_dias: Boolean(registro.avisou_7_dias),
      avisou_10_dias: Boolean(registro.avisou_10_dias),
      status: registro.status,
    }));
  } catch (error) {
    console.error("Erro ao buscar tags no D1:", error);
    return [];
  }
});

const concluirTagPendente = createServerFn({ method: "POST" })
  .inputValidator((data: { registroId: string }) => data)
  .handler(async ({ data }) => {
    const viewer = getDiscordSessionFromRequest();

    if (!viewer) {
      return { ok: false };
    }

    try {
      await env.DB.prepare(
        `
          DELETE FROM tags_pendentes
          WHERE user_id = ?
        `,
      )
        .bind(data.registroId)
        .run();

      return { ok: true };
    } catch (error) {
      console.error("Erro ao concluir tag no D1:", error);
      return { ok: false };
    }
  });

const adicionarTagPendente = createServerFn({ method: "POST" })
  .inputValidator((data: { userId: string; nome: string; dataEnvio?: string }) => data)
  .handler(async ({ data }) => {
    const viewer = getDiscordSessionFromRequest();

    if (!viewer || viewer.id !== DISCORD_OWNER_ID) {
      return { ok: false };
    }

    const dataEnvio = data.dataEnvio?.trim()
      ? new Date(`${data.dataEnvio.trim()}T03:00:00.000Z`).toISOString()
      : new Date().toISOString();

    try {
      await env.DB.prepare(
        `
          INSERT OR REPLACE INTO tags_pendentes (
            user_id,
            nome,
            data_envio,
            avisou_7_dias,
            avisou_10_dias,
            status
          ) VALUES (?, ?, ?, 0, 0, 'pendente')
        `,
      )
        .bind(data.userId.trim(), data.nome.trim(), dataEnvio)
        .run();

      return { ok: true };
    } catch (error) {
      console.error("Erro ao adicionar tag no D1:", error);
      return { ok: false };
    }
  });

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>) => ({
    auth_error:
      typeof search.auth_error === "string" ? search.auth_error : undefined,
  }),
  loader: async () => {
    const viewer = (await getViewer()) as Viewer;
    const acessoPermitido = viewer?.id === DISCORD_OWNER_ID;
    const pendentes = acessoPermitido ? await getTagsPendentes() : [];

    return {
      viewer,
      acessoPermitido,
      pendentes,
    };
  },
  component: DashboardPage,
});

function diasPassados(dataIso: string) {
  const data = new Date(dataIso);

  if (Number.isNaN(data.getTime())) {
    return 0;
  }

  const agora = new Date();
  const diferenca = agora.getTime() - data.getTime();
  return Math.max(Math.floor(diferenca / (1000 * 60 * 60 * 24)), 0);
}

function formatarDataBr(dataIso: string) {
  const data = new Date(dataIso);

  if (Number.isNaN(data.getTime())) {
    return "data invalida";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

function DashboardPage() {
  const { viewer, acessoPermitido, pendentes } = Route.useLoaderData();
  const { auth_error } = Route.useSearch();
  const router = useRouter();
  const concluirTag = useServerFn(concluirTagPendente);
  const adicionarTag = useServerFn(adicionarTagPendente);

  async function handleConcluir(registroId: string) {
    const resultado = await concluirTag({ data: { registroId } });

    if (resultado?.ok) {
      await router.invalidate();
    }
  }

  async function handleAdicionar(formData: FormData) {
    const userId = String(formData.get("userId") || "");
    const nome = String(formData.get("nome") || "");
    const dataEnvio = String(formData.get("dataEnvio") || "");

    if (!userId.trim() || !nome.trim()) {
      return;
    }

    const resultado = await adicionarTag({
      data: {
        userId,
        nome,
        dataEnvio,
      },
    });

    if (resultado?.ok) {
      await router.invalidate();
    }
  }

  return (
    <main className="min-h-screen bg-[var(--raven-black)] text-foreground">
      <header className="sticky top-0 z-40 w-full">
        <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl border-glow bg-[oklch(0.12_0.03_250/70%)] px-5 py-3 backdrop-blur-xl mx-3 md:mx-auto">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Raven" className="h-9 w-9" width={36} height={36} />
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">Raven</p>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="rounded-xl border border-[var(--raven-cyan)]/30 px-4 py-2 text-sm font-medium text-[var(--raven-cyan)] transition-all hover:bg-[var(--raven-cyan)] hover:text-[var(--raven-black)]"
            >
              Inicio
            </a>

            {viewer ? (
              <a
                href="/auth/logout"
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-white/30 hover:text-white"
              >
                Sair
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-12 pt-24">
        <div className="rounded-3xl border-glow bg-[oklch(0.12_0.03_250/60%)] p-8 backdrop-blur-xl">
          <span className="mb-4 inline-flex rounded-full border border-[var(--raven-cyan)]/30 bg-[oklch(0.16_0.04_250/80%)] px-4 py-1 text-xs font-medium text-[var(--raven-cyan)]">
            Painel de controle
          </span>

          <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Dashboard <span className="text-[var(--raven-cyan)]">Raven</span>
          </h1>

          {viewer && acessoPermitido ? (
            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Logado como {viewer.global_name || viewer.username}.
            </p>
          ) : viewer && !acessoPermitido ? (
            <div className="mt-6 max-w-3xl rounded-2xl border border-red-400/30 bg-red-500/10 p-6">
              <p className="text-lg font-semibold text-white">
                Esta conta do Discord nao tem permissao para acessar esta dashboard.
              </p>
              <p className="mt-2 text-sm text-red-200/80">
                Faca login com a conta autorizada para continuar.
              </p>
            </div>
          ) : (
            <div className="mt-6 max-w-3xl rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-6">
              {auth_error ? (
                <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {auth_error}
                </div>
              ) : null}

              <p className="text-lg font-semibold text-white">
                Voce precisa entrar com Discord para acessar esta dashboard.
              </p>
              <p className="mt-2 text-sm text-cyan-100/80">
                Sem login, a lista de tags fica bloqueada.
              </p>

              <div className="mt-6">
                <a
                  href="/auth/discord"
                  className="inline-flex min-w-[220px] items-center justify-center rounded-xl bg-cyan-400 px-6 py-4 text-base font-bold text-black transition-all hover:bg-cyan-300"
                >
                  Entrar com Discord
                </a>
              </div>
            </div>
          )}
        </div>

        {viewer && acessoPermitido ? (
          <div className="mt-8 rounded-3xl border-glow bg-[oklch(0.12_0.03_250/60%)] p-8 backdrop-blur-xl">
            <div>
              <p className="text-sm text-[var(--raven-cyan)]">Adicionar</p>
              <h2 className="mt-1 font-display text-2xl font-semibold">
                Novo pendente
              </h2>
            </div>

            <form
              className="mt-6 grid gap-4 md:grid-cols-3"
              onSubmit={async (event) => {
                event.preventDefault();
                await handleAdicionar(new FormData(event.currentTarget));
                event.currentTarget.reset();
              }}
            >
              <input
                name="userId"
                placeholder="ID do membro"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-muted-foreground"
              />
              <input
                name="nome"
                placeholder="Nome do membro"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-muted-foreground"
              />
              <input
                name="dataEnvio"
                placeholder="Data (AAAA-MM-DD)"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-muted-foreground"
              />

              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="inline-flex rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-cyan-200"
                >
                  Adicionar pendente
                </button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="mt-8 rounded-3xl border-glow bg-[oklch(0.12_0.03_250/60%)] p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--raven-cyan)]">Tags</p>
              <h2 className="mt-1 font-display text-2xl font-semibold">
                Pendentes de tags
              </h2>
            </div>

            <div className="rounded-2xl border border-[var(--raven-cyan)]/20 bg-[oklch(0.16_0.04_250/80%)] px-4 py-2 text-sm text-muted-foreground">
              {pendentes.length} pendentes
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
            {!viewer ? (
              <p className="text-sm text-muted-foreground">
                Faca login com Discord para visualizar e editar a lista.
              </p>
            ) : !acessoPermitido ? (
              <p className="text-sm text-muted-foreground">
                Esta conta nao pode visualizar a lista.
              </p>
            ) : pendentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nao ha pendentes no momento.
              </p>
            ) : (
              <div className="space-y-4">
                {pendentes.map((registro: TagPendente) => (
                  <div
                    key={registro.registro_id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{registro.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          Enviado em {formatarDataBr(registro.data_envio)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="inline-flex w-fit rounded-full border border-[var(--raven-cyan)]/20 bg-[oklch(0.16_0.04_250/80%)] px-3 py-1 text-sm text-[var(--raven-cyan)]">
                          {diasPassados(registro.data_envio)} dias
                        </div>

                        <button
                          onClick={() => handleConcluir(registro.registro_id)}
                          className="rounded-xl border border-[var(--raven-cyan)]/30 px-4 py-2 text-sm font-medium text-[var(--raven-cyan)] transition-all hover:bg-[var(--raven-cyan)] hover:text-[var(--raven-black)]"
                        >
                          Concluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
