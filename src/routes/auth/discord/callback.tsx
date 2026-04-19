import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import {
  buildDiscordRedirectUri,
  clearDiscordSessionCookie,
  clearOAuthStateCookie,
  createDiscordSessionCookie,
  getOAuthStateFromRequest,
} from "@/lib/auth";

export const Route = createFileRoute("/auth/discord/callback")({
  component: () => null,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const storedState = getOAuthStateFromRequest(request);
        const headers = new Headers();
        headers.set("Location", "/dashboard");
        headers.append("Set-Cookie", clearOAuthStateCookie());

        if (!code || !state || !storedState || state != storedState) {
          return new Response(null, { status: 302, headers });
        }

        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: env.DISCORD_CLIENT_ID,
            client_secret: env.DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: buildDiscordRedirectUri(request),
          }),
        });

        if (!tokenResponse.ok) {
          return new Response(null, { status: 302, headers });
        }

        const tokenData = (await tokenResponse.json()) as { access_token?: string };
        if (!tokenData.access_token) {
          return new Response(null, { status: 302, headers });
        }

        const userResponse = await fetch("https://discord.com/api/users/@me", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!userResponse.ok) {
          return new Response(null, { status: 302, headers });
        }

        const user = (await userResponse.json()) as {
          id: string;
          username: string;
          global_name?: string | null;
          avatar?: string | null;
        };

        headers.append(
          "Set-Cookie",
          createDiscordSessionCookie({
            id: user.id,
            username: user.username,
            global_name: user.global_name ?? null,
            avatar: user.avatar ?? null,
          }),
        );

        return new Response(null, {
          status: 302,
          headers,
        });
      },
    },
  },
});
