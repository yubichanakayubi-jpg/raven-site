import logo from "@/assets/raven-logo.png";

type Msg = { user: string; avatar?: string; color?: string; bot?: boolean; text: string; time: string };

const conversations: { title: string; msgs: Msg[] }[] = [
  {
    title: "IA conversando",
    msgs: [
      { user: "lua_", color: "oklch(0.78 0.14 320)", text: "raven, tá acordado?", time: "23:47" },
      {
        user: "Raven",
        bot: true,
        text: "Sempre. A noite é o meu turno. O que perturba seu sono hoje?",
        time: "23:47",
      },
    ],
  },
  {
    title: "Aparição rara",
    msgs: [
      {
        user: "Raven",
        bot: true,
        text: "*um corvo pousa silenciosamente no canto do chat e observa*",
        time: "02:13",
      },
      { user: "kaii", color: "oklch(0.8 0.14 200)", text: "ELE APARECEU KKKK", time: "02:14" },
    ],
  },
  {
    title: "Lembrete para staff",
    msgs: [
      {
        user: "Raven",
        bot: true,
        text: "@staff · 3 tickets aguardam atenção há mais de 1h. Os olhos da noite estão atentos.",
        time: "01:02",
      },
    ],
  },
];

export function ChatExamples() {
  return (
    <section id="exemplos" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--raven-cyan)]">
            Em ação
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Veja Raven <span className="text-gradient">no chat</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Exemplos reais de como ele se comporta no seu servidor.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {conversations.map((c) => (
            <div
              key={c.title}
              className="overflow-hidden rounded-2xl border border-border bg-[oklch(0.16_0.03_250)] shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <span className="text-xs font-medium text-muted-foreground">#{c.title.toLowerCase().replace(/ /g, "-")}</span>
                <span className="text-xs text-[var(--raven-cyan)]">{c.title}</span>
              </div>
              <div className="space-y-4 p-5">
                {c.msgs.map((m, i) => (
                  <div key={i} className="flex gap-3">
                    {m.bot ? (
                      <img src={logo} alt="" className="h-9 w-9 shrink-0 rounded-full bg-[oklch(0.18_0.04_250)] ring-1 ring-[var(--raven-cyan)]/40" />
                    ) : (
                      <div
                        className="h-9 w-9 shrink-0 rounded-full"
                        style={{ background: m.color }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-sm font-semibold ${m.bot ? "text-[var(--raven-cyan)]" : ""}`}
                          style={!m.bot ? { color: m.color } : {}}
                        >
                          {m.user}
                        </span>
                        {m.bot && (
                          <span className="rounded bg-[var(--raven-cyan)]/15 px-1.5 py-0.5 text-[10px] font-bold text-[var(--raven-cyan)]">
                            BOT
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">{m.time}</span>
                      </div>
                      <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
