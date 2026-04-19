import { useState } from "react";
import logo from "@/assets/raven-logo.png";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#funcoes", label: "Funcoes" },
  { href: "#exemplos", label: "Exemplos" },
  { href: "#ia", label: "IA" },
  { href: "#staff", label: "Staff" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl border-glow bg-[oklch(0.12_0.03_250/70%)] px-5 py-3 backdrop-blur-xl mx-3 md:mx-auto">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={logo} alt="Raven" className="h-9 w-9" width={36} height={36} />
          <span className="font-display text-xl font-semibold tracking-tight">
            Raven
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-[var(--raven-cyan)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#cta"
            className="hidden rounded-xl border border-cyan-300/40 bg-cyan-300 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-all hover:bg-cyan-200 hover:shadow-[0_0_28px_rgba(34,211,238,0.4)] md:inline-flex"
          >
            Adicionar ao Discord
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg border-glow p-2 md:hidden"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mx-3 mt-2 rounded-2xl border-glow bg-[oklch(0.12_0.03_250/95%)] p-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-[var(--raven-cyan)]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#cta"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl border border-cyan-300/40 bg-cyan-300 px-4 py-2 text-center text-sm font-semibold text-black shadow-[0_0_24px_rgba(34,211,238,0.25)]"
            >
              Adicionar ao Discord
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
