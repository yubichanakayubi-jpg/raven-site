import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/raven/Header";
import { Hero } from "@/components/raven/Hero";
import { Features } from "@/components/raven/Features";
import { ChatExamples } from "@/components/raven/ChatExamples";
import { Differentials } from "@/components/raven/Differentials";
import { AISection } from "@/components/raven/AISection";
import { StaffSection } from "@/components/raven/StaffSection";
import { CTA } from "@/components/raven/CTA";
import { Footer } from "@/components/raven/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Raven · A inteligência da noite no seu servidor" },
      {
        name: "description",
        content:
          "Raven é um bot de Discord premium com IA, presença no chat, organização para staff e aparições raras. Mais que um bot — uma presença.",
      },
      { property: "og:title", content: "Raven · A inteligência da noite" },
      {
        property: "og:description",
        content: "Bot de Discord com IA, personalidade e presença. Movimente sua comunidade com elegância.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="dark min-h-screen bg-[var(--raven-black)] text-foreground">
      <Header />
      <Hero />
      <Features />
      <ChatExamples />
      <Differentials />
      <AISection />
      <StaffSection />
      <CTA />
      <Footer />
    </main>
  );
}
