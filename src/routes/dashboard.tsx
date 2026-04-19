import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import logo from "@/assets/raven-logo.png";
import { getDiscordSessionFromRequest } from "@/lib/auth";

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

export const Route = createFileRoute("/dashboard")({
  loader: async () => {
    const viewer = (await getViewer()) as Viewer;
    const pendentes = viewer ? await getTagsPendentes() : [];

    return {
      viewer,
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
  const { viewer, pendentes } = Route.useLoaderData();
  const router = useRouter();
  const concluirTag = useServerFn(concluirTagPendente);

  async function handleConcluir(registroId: string) {
    const resultado = await concluirTag({ data: { registroId } });

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

          {viewer ? (
            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              Logado como {viewer.global_name || viewer.username}.
            </p>
          ) : (
            <div className="mt-6 max-w-3xl rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-6">
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
