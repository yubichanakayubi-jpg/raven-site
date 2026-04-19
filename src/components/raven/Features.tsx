import { MessageSquare, Brain, Tags, Sparkles, CalendarClock, Feather } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Respostas Inteligentes",
    desc: "Gatilhos personalizados que reagem ao ritmo do chat. Cada palavra pode invocar uma resposta única.",
  },
  {
    icon: Brain,
    title: "IA com Personalidade",
    desc: "Conversas naturais com tom próprio. Raven responde, provoca e pensa — não apenas executa.",
  },
  {
    icon: Tags,
    title: "Gestão de Tags",
    desc: "Lembretes elegantes para a staff. Nada importante passa despercebido pelos olhos da noite.",
  },
  {
    icon: CalendarClock,
    title: "Pergunta do Dia",
    desc: "Todos os dias um novo enigma para acender o chat. Engajamento que acontece sozinho.",
  },
  {
    icon: Feather,
    title: "Aparições Raras",
    desc: "Surge sem aviso. Frases, sussurros, presenças. Quem está online sente — quem não está, perde.",
  },
  {
    icon: Sparkles,
    title: "Movimento da Comunidade",
    desc: "Comandos refinados para staff e membros. Organização que parece magia, não burocracia.",
  },
];

export function Features() {
  return (
    <section id="funcoes" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--raven-cyan)]">
            Funções principais
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Tudo que sua comunidade precisa.
            <br />
            <span className="text-gradient">Nada que não precisa.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card-glass p-7 shadow-[var(--shadow-card)] transition-all duration-500 hover:border-[var(--raven-cyan)]/40 hover:-translate-y-1 hover:shadow-[var(--glow-cyan)]"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[var(--raven-cyan)]/0 blur-3xl transition-all duration-500 group-hover:bg-[var(--raven-cyan)]/20" />
              <div className="relative">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(0.82_0.16_200/12%)] ring-1 ring-[var(--raven-cyan)]/30">
                  <f.icon className="h-5 w-5 text-[var(--raven-cyan)]" />
                </div>
                <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
