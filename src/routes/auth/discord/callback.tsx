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
        const oauthError = url.searchParams.get("error");
        const oauthErrorDescription = url.searchParams.get("error_description");
        const storedState = getOAuthStateFromRequest(request);
        const headers = new Headers();
        headers.set("Location", "/dashboard");
        headers.append("Set-Cookie", clearOAuthStateCookie());

        if (oauthError) {
          headers.set(
            "Location",
            `/dashboard?auth_error=${encodeURIComponent(oauthErrorDescription || oauthError)}`,
          );
          return new Response(null, { status: 302, headers });
        }

        if (!code || !state || !storedState || state != storedState) {
          headers.set("Location", "/dashboard?auth_error=Falha%20na%20validacao%20do%20login");
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
          const erroTexto = await tokenResponse.text();
          headers.set(
            "Location",
            `/dashboard?auth_error=${encodeURIComponent(`Falha ao trocar o codigo: ${erroTexto}`)}`,
          );
          return new Response(null, { status: 302, headers });
        }

        const tokenData = (await tokenResponse.json()) as { access_token?: string };
        if (!tokenData.access_token) {
          headers.set("Location", "/dashboard?auth_error=Discord%20nao%20retornou%20token");
          return new Response(null, { status: 302, headers });
        }

        const userResponse = await fetch("https://discord.com/api/users/@me", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!userResponse.ok) {
          const erroTexto = await userResponse.text();
          headers.set(
            "Location",
            `/dashboard?auth_error=${encodeURIComponent(`Falha ao buscar usuario: ${erroTexto}`)}`,
          );
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
