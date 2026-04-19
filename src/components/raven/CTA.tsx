import { ArrowRight } from "lucide-react";
import hero from "@/assets/raven-hero.jpg";

export function CTA() {
  return (
    <section id="cta" className="relative px-6 py-32">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border-glow shadow-elevated">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.03_250/95%)] via-[oklch(0.14_0.04_250/85%)] to-[oklch(0.18_0.06_220/80%)]" />
        <div
          className="absolute -bottom-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, var(--raven-cyan) 0%, transparent 60%)", opacity: 0.4, filter: "blur(40px)" }}
        />

        <div className="relative px-8 py-20 text-center md:px-16 md:py-28">
          <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            Deixe a noite <br />
            <span className="text-gradient">entrar no seu servidor.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground md:text-lg">
            Raven está pronto. Basta chamar.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-xl bg-[var(--gradient-cyan)] px-8 py-4 text-sm font-semibold text-[var(--raven-black)] shadow-[var(--glow-cyan-strong)] transition-all hover:-translate-y-0.5"
            >
              Adicionar ao Discord
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#funcoes"
              className="inline-flex items-center gap-2 rounded-xl border-glow px-8 py-4 text-sm font-medium backdrop-blur-md transition-colors hover:bg-[oklch(0.22_0.05_250/40%)]"
            >
              Ver funções novamente
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
