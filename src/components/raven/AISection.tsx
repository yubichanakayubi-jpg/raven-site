import logo from "@/assets/raven-logo.png";
import { Brain } from "lucide-react";

export function AISection() {
  return (
    <section id="ia" className="relative overflow-hidden py-32 px-6">
      <div
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, var(--raven-cyan) 0%, transparent 65%)", filter: "blur(80px)" }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border-glow bg-[oklch(0.16_0.03_250/60%)] px-4 py-1.5">
            <Brain className="h-3.5 w-3.5 text-[var(--raven-cyan)]" />
            <span className="text-xs font-medium text-muted-foreground">IA integrada</span>
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold leading-tight md:text-5xl">
            Uma mente <span className="text-gradient">que observa</span> a noite.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Raven foi moldado para conversar com tom, contexto e presença.
            Ele não responde como uma máquina — ele responde como alguém
            que entende o silêncio entre as palavras.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Conversação natural e fluida com membros",
              "Memória de contexto durante o diálogo",
              "Tom misterioso, elegante e nunca robótico",
              "Respostas que parecem pensadas, não geradas",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--raven-cyan)] shadow-[0_0_10px_var(--raven-cyan)]" />
                <span className="text-foreground/90">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-square max-w-md">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 180deg, transparent, var(--raven-cyan), transparent)",
                opacity: 0.4,
                animation: "spin 12s linear infinite",
              }}
            />
            <div className="absolute inset-6 rounded-full border-glow bg-[oklch(0.12_0.03_250)] shadow-elevated" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={logo}
                alt="Raven core"
                className="h-44 w-44 drop-shadow-[0_0_40px_var(--raven-cyan)]"
                style={{ animation: "float 6s ease-in-out infinite" }}
              />
            </div>
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[var(--raven-cyan)]"
                style={{
                  transform: `rotate(${deg}deg) translate(180px) rotate(-${deg}deg)`,
                  boxShadow: "0 0 12px var(--raven-cyan)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
