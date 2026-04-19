export function Particles() {
  const dots = Array.from({ length: 30 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = 4 + Math.random() * 6;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-[var(--raven-cyan)]"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              opacity: 0.4,
              boxShadow: "0 0 8px var(--raven-cyan)",
              animation: `float ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
