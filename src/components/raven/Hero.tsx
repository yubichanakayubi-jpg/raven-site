import hero from "@/assets/raven-hero.jpg";
import { Particles } from "./Particles";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-night noise-overlay">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to bottom, black 30%, transparent 95%)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, var(--raven-cyan) 0%, transparent 60%)",
          animation: "glow-pulse 5s ease-in-out infinite",
          opacity: 0.25,
        }}
      />
      <Particles />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 pt-32 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border-glow bg-[oklch(0.16_0.03_250/60%)] px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-[var(--raven-cyan)]" />
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            Bot de Discord · Presença inteligente
          </span>
        </div>

        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
          A inteligência <br />
          <span className="text-gradient">da noite</span> no seu servidor
        </h1>

        <p className="mt-7 max-w-2xl text-base text-muted-foreground md:text-lg">
          Raven não é apenas mais um bot. É uma presença silenciosa que observa,
          conversa, organiza e movimenta sua comunidade — quando menos se espera.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#cta"
            className="group inline-flex items-center gap-2 rounded-xl bg-[var(--gradient-cyan)] px-7 py-3.5 text-sm font-semibold text-[var(--raven-black)] shadow-[var(--glow-cyan)] transition-all hover:shadow-[var(--glow-cyan-strong)] hover:-translate-y-0.5"
          >
            Invocar Raven
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#funcoes"
            className="inline-flex items-center gap-2 rounded-xl border-glow bg-[oklch(0.18_0.03_250/40%)] px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:bg-[oklch(0.22_0.05_250/60%)]"
          >
            Conhecer funções
          </a>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 text-left md:gap-12">
          {[
            { k: "24/7", v: "Sempre presente" },
            { k: "IA", v: "Conversação real" },
            { k: "∞", v: "Aparições raras" },
          ].map((s) => (
            <div key={s.k} className="border-l border-[var(--raven-cyan)]/30 pl-4">
              <div className="font-display text-2xl font-semibold text-cyan-glow">{s.k}</div>
              <div className="text-xs text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
