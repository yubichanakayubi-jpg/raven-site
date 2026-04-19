import { createFileRoute } from "@tanstack/react-router";
import { buildDiscordAuthorizeUrl, createOAuthStateCookie } from "@/lib/auth";

export const Route = createFileRoute("/auth/discord")({
  component: () => null,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const state = crypto.randomUUID();
        const headers = new Headers();
        headers.set("Location", buildDiscordAuthorizeUrl(request, state));
        headers.append("Set-Cookie", createOAuthStateCookie(state));

        return new Response(null, {
          status: 302,
          headers,
        });
      },
    },
  },
});
