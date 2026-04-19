import { getRequestHeader } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";

const SESSION_COOKIE = "raven_session";
const STATE_COOKIE = "raven_oauth_state";

export type DiscordSession = {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
};

function parseCookies(cookieHeader?: string | null) {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) {
    return cookies;
  }

  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (!key) {
      continue;
    }

    cookies[key] = rest.join("=");
  }

  return cookies;
}

function serializeCookie(
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: "Lax" | "Strict" | "None";
    secure?: boolean;
  } = {},
) {
  const parts = [`${name}=${value}`];

  parts.push(`Path=${options.path ?? "/"}`);
  parts.push(`SameSite=${options.sameSite ?? "Lax"}`);

  if (typeof options.maxAge === "number") {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (options.httpOnly) {
    parts.push("HttpOnly");
  }

  if (options.secure ?? true) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function getDiscordSessionFromRequest() {
  const cookies = parseCookies(getRequestHeader("cookie"));
  const raw = cookies[SESSION_COOKIE];

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(raw)) as DiscordSession;
  } catch {
    return null;
  }
}

export function getOAuthStateFromRequest(request: Request) {
  const cookies = parseCookies(request.headers.get("cookie"));
  return cookies[STATE_COOKIE] ?? null;
}

export function buildDiscordRedirectUri(request: Request) {
  return new URL("/auth/discord/callback", request.url).toString();
}

export function buildDiscordAuthorizeUrl(request: Request, state: string) {
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    response_type: "code",
    redirect_uri: buildDiscordRedirectUri(request),
    scope: "identify",
    state,
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export function createOAuthStateCookie(state: string) {
  return serializeCookie(STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 600,
    path: "/",
    sameSite: "Lax",
    secure: true,
  });
}

export function clearOAuthStateCookie() {
  return serializeCookie(STATE_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "Lax",
    secure: true,
  });
}

export function createDiscordSessionCookie(session: DiscordSession) {
  return serializeCookie(SESSION_COOKIE, encodeURIComponent(JSON.stringify(session)), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "Lax",
    secure: true,
  });
}

export function clearDiscordSessionCookie() {
  return serializeCookie(SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "Lax",
    secure: true,
  });
}
