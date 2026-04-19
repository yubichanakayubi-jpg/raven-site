import logo from "@/assets/raven-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Raven" className="h-8 w-8" width={32} height={32} loading="lazy" />
          <div>
            <div className="font-display font-semibold">Raven</div>
            <div className="text-xs text-muted-foreground">A inteligência da noite.</div>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <a href="#funcoes" className="hover:text-[var(--raven-cyan)]">Funções</a>
          <a href="#ia" className="hover:text-[var(--raven-cyan)]">IA</a>
          <a href="#staff" className="hover:text-[var(--raven-cyan)]">Staff</a>
          <a href="#cta" className="hover:text-[var(--raven-cyan)]">Adicionar</a>
        </nav>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Raven · Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
