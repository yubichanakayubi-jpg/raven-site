import { Moon, Eye, Zap, Shield } from "lucide-react";

const items = [
  { icon: Moon, title: "Identidade própria", desc: "Não é um bot genérico — é Raven. Tom, presença e personalidade únicos." },
  { icon: Eye, title: "Sempre observando", desc: "Atento ao ritmo do servidor. Aparece quando precisa, silencia quando deve." },
  { icon: Zap, title: "Resposta instantânea", desc: "Latência baixa, conversação fluida. Como se houvesse alguém do outro lado." },
  { icon: Shield, title: "Confiável para staff", desc: "Lembretes, organização e suporte que reduzem a carga da moderação." },
];

export function Differentials() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--raven-cyan)]">
              Diferenciais
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
              Por que <span className="text-gradient">Raven</span>?
            </h2>
          </div>
          <p className="text-muted-foreground md:text-right">
            Existem centenas de bots. Apenas um observa em silêncio,
            responde com inteligência e dá vida ao seu servidor sem ruído.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border/50 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="group relative bg-[oklch(0.14_0.03_250)] p-8 transition-colors hover:bg-[oklch(0.18_0.04_250)]"
            >
              <it.icon className="h-6 w-6 text-[var(--raven-cyan)] transition-transform group-hover:scale-110" />
              <h3 className="mt-6 font-display text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
