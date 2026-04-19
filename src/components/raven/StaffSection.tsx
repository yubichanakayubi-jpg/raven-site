import { Bell, ListChecks, Users } from "lucide-react";

const cards = [
  { icon: Bell, title: "Lembretes de tags", desc: "Nenhum @staff fica esquecido. Raven mantém o registro silencioso do que precisa de atenção." },
  { icon: ListChecks, title: "Organização discreta", desc: "Comandos pensados para reduzir o ruído da moderação. Trabalho sem peso." },
  { icon: Users, title: "Comunidade ativa", desc: "Pergunta do dia, aparições e gatilhos que mantêm o chat vivo — mesmo nas horas mortas." },
];

export function StaffSection() {
  return (
    <section id="staff" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--raven-cyan)]">
              Apoio para staff
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
              Os olhos da noite,
              <br />
              <span className="text-gradient">a serviço da sua equipe.</span>
            </h2>
            <p className="mt-6 text-muted-foreground">
              Raven foi pensado para aliviar a moderação e manter a comunidade
              em movimento — sem chamar atenção quando não precisa.
            </p>
          </div>

          <div className="space-y-4">
            {cards.map((c, i) => (
              <div
                key={c.title}
                className="group flex gap-5 rounded-2xl border border-border bg-card-glass p-6 transition-all hover:border-[var(--raven-cyan)]/40 hover:translate-x-1"
              >
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.82_0.16_200/10%)] ring-1 ring-[var(--raven-cyan)]/30">
                    <c.icon className="h-5 w-5 text-[var(--raven-cyan)]" />
                  </div>
                  <span className="absolute -left-1 -top-1 font-display text-xs font-bold text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
