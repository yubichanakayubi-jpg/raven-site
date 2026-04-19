import { createFileRoute } from "@tanstack/react-router";
import { clearDiscordSessionCookie } from "@/lib/auth";

export const Route = createFileRoute("/auth/logout")({
  component: () => null,
  server: {
    handlers: {
      GET: async () => {
        const headers = new Headers();
        headers.set("Location", "/");
        headers.append("Set-Cookie", clearDiscordSessionCookie());

        return new Response(null, {
          status: 302,
          headers,
        });
      },
    },
  },
});
