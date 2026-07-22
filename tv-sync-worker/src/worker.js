const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const CORS_HEADERS = {
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type,authorization",
  "access-control-max-age": "86400"
};

const ALLOWED_ORIGINS = new Set([
  "https://atreiahub.com",
  "https://www.atreiahub.com"
]);

const LOCALHOST_HOSTS = new Set(["localhost", "127.0.0.1"]);

const RATE_LIMIT_RULES = {
  "/tv-sync/v1/register": { limit: 5, windowSec: 900, blockSec: 3600 },
  "/tv-sync/v1/login": { limit: 10, windowSec: 600, blockSec: 900 },
  "/tv-sync/v1/recover": { limit: 5, windowSec: 1800, blockSec: 3600 }
};

const SNAPSHOT_HISTORY_MAX = 30;

let rateLimitSchemaReady = false;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin");

    if (request.method === "OPTIONS") {
      if (origin && !isAllowedOrigin(origin)) {
        return withCors(json({ error: "Origin not allowed" }, 403), origin);
      }
      return withCors(new Response(null, { status: 204 }), origin);
    }

    const url = new URL(request.url);
    if (!url.pathname.startsWith("/tv-sync/")) {
      return withCors(json({ error: "Not found" }, 404), origin);
    }

    try {
      if (origin && !isAllowedOrigin(origin)) {
        return withCors(json({ error: "Origin not allowed" }, 403), origin);
      }

      if (!env.DB) return withCors(json({ error: "D1 binding DB is missing" }, 500), origin);

      if (request.method === "GET" && url.pathname === "/tv-sync/v1/health") {
        return withCors(json({ ok: true }), origin);
      }

      if (request.method !== "POST") {
        return withCors(json({ error: "Method not allowed" }, 405), origin);
      }

      const body = await readJson(request);
      const rateLimitResponse = await enforceRateLimit(env, request, url.pathname, body);
      if (rateLimitResponse) return withCors(rateLimitResponse, origin);

      if (url.pathname === "/tv-sync/v1/register") return withCors(await registerUser(env, body), origin);
      if (url.pathname === "/tv-sync/v1/login") return withCors(await loginUser(env, body), origin);
      if (url.pathname === "/tv-sync/v1/logout") return withCors(await logoutUser(env, body), origin);
      if (url.pathname === "/tv-sync/v1/recover") return withCors(await recoverPassword(env, body), origin);
      if (url.pathname === "/tv-sync/v1/account/email") return withCors(await updateEmail(env, body), origin);
      if (url.pathname === "/tv-sync/v1/account/password") return withCors(await changePassword(env, body), origin);
      if (url.pathname === "/tv-sync/v1/account/delete") return withCors(await deleteAccount(env, body), origin);
      if (url.pathname === "/tv-sync/v1/pull") return withCors(await pullSnapshot(env, body), origin);
      if (url.pathname === "/tv-sync/v1/push") return withCors(await pushSnapshot(env, body), origin);
      if (url.pathname === "/tv-sync/v1/restore-last") return withCors(await restoreLastSnapshot(env, body), origin);
      if (url.pathname === "/tv-sync/v1/history-depth") return withCors(await getHistoryDepth(env, body), origin);

      return withCors(json({ error: "Not found" }, 404), origin);
    } catch (error) {
      return withCors(json({ error: error && error.message ? error.message : "Server error" }, 500), origin);
    }
  }
};

function isAllowedOrigin(origin) {
  const normalized = String(origin || "").trim().toLowerCase();
  if (!normalized) return false;
  if (ALLOWED_ORIGINS.has(normalized)) return true;
  try {
    const url = new URL(normalized);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return LOCALHOST_HOSTS.has(String(url.hostname || "").toLowerCase());
  } catch {
    return false;
  }
}

function withCors(resp, origin) {
  const headers = new Headers(resp.headers || {});
  Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));
  if (origin && isAllowedOrigin(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "Origin");
  }
  return new Response(resp.body, { status: resp.status, headers });
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

async function readJson(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return {};
  const body = await request.json().catch(() => ({}));
  return body && typeof body === "object" ? body : {};
}

function getClientIp(request) {
  const cfIp = String(request.headers.get("cf-connecting-ip") || "").trim();
  if (cfIp) return cfIp;
  const forwarded = String(request.headers.get("x-forwarded-for") || "").trim();
  if (!forwarded) return "unknown";
  const first = forwarded.split(",")[0];
  return String(first || "unknown").trim() || "unknown";
}

async function ensureRateLimitTable(env) {
  if (rateLimitSchemaReady) return;
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS rate_limits (scope_key TEXT PRIMARY KEY, window_start INTEGER NOT NULL, attempt_count INTEGER NOT NULL, blocked_until INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL)"
  ).run();
  rateLimitSchemaReady = true;
}

function rateLimitScope(pathname, body) {
  const username = normalizeUsername(body && body.username ? body.username : "");
  const email = String(body && body.email ? body.email : "").trim().toLowerCase();
  if (pathname === "/tv-sync/v1/login") return "login|" + (username || "-");
  if (pathname === "/tv-sync/v1/recover") return "recover|" + (username || "-") + "|" + (email || "-");
  if (pathname === "/tv-sync/v1/register") return "register|" + (username || "-") + "|" + (email || "-");
  return "";
}

async function enforceRateLimit(env, request, pathname, body) {
  const rule = RATE_LIMIT_RULES[pathname];
  if (!rule) return null;

  await ensureRateLimitTable(env);

  const ip = getClientIp(request);
  const scope = rateLimitScope(pathname, body);
  const key = pathname + "|ip=" + ip + "|scope=" + scope;
  const ts = nowTs();

  const row = await env.DB.prepare(
    "SELECT window_start, attempt_count, blocked_until FROM rate_limits WHERE scope_key = ?1"
  ).bind(key).first();

  if (!row) {
    await env.DB.prepare(
      "INSERT INTO rate_limits (scope_key, window_start, attempt_count, blocked_until, updated_at) VALUES (?1, ?2, 1, 0, ?2)"
    ).bind(key, ts).run();
    return null;
  }

  const blockedUntil = Number(row.blocked_until || 0);
  if (blockedUntil > ts) {
    const retryAfter = blockedUntil - ts;
    return json({ error: "Too many attempts. Try again later.", retryAfterSec: retryAfter }, 429);
  }

  const windowStart = Number(row.window_start || 0);
  const count = Number(row.attempt_count || 0);
  if (ts - windowStart >= rule.windowSec) {
    await env.DB.prepare(
      "UPDATE rate_limits SET window_start = ?2, attempt_count = 1, blocked_until = 0, updated_at = ?2 WHERE scope_key = ?1"
    ).bind(key, ts).run();
    return null;
  }

  const nextCount = count + 1;
  if (nextCount > rule.limit) {
    const nextBlockedUntil = ts + rule.blockSec;
    await env.DB.prepare(
      "UPDATE rate_limits SET attempt_count = ?2, blocked_until = ?3, updated_at = ?4 WHERE scope_key = ?1"
    ).bind(key, nextCount, nextBlockedUntil, ts).run();
    return json({ error: "Too many attempts. Try again later.", retryAfterSec: rule.blockSec }, 429);
  }

  await env.DB.prepare(
    "UPDATE rate_limits SET attempt_count = ?2, updated_at = ?3 WHERE scope_key = ?1"
  ).bind(key, nextCount, ts).run();

  return null;
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "");
}

function validEmail(value) {
  const email = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

function randomToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < arr.length; i++) out += arr[i].toString(16).padStart(2, "0");
  return out;
}

function encodeBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decodeBase64(text) {
  const bin = atob(text);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function generateSalt() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return encodeBase64(arr);
}

async function pbkdf2Hash(password, saltB64) {
  const data = new TextEncoder().encode(String(password || ""));
  const saltBytes = decodeBase64(saltB64);
  const key = await crypto.subtle.importKey("raw", data, "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  return encodeBase64(new Uint8Array(bits));
}

async function loadSession(env, token) {
  const t = String(token || "").trim();
  if (!t) return null;
  const ts = nowTs();
  const row = await env.DB.prepare(
    "SELECT s.token, s.user_id, s.expires_at, u.username, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?1"
  ).bind(t).first();
  if (!row) return null;
  if (Number(row.expires_at || 0) < ts) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?1").bind(t).run();
    return null;
  }
  return {
    token: row.token,
    userId: Number(row.user_id),
    username: String(row.username),
    email: String(row.email)
  };
}

async function issueSession(env, userId) {
  const token = randomToken(32);
  const ttlDays = Math.max(1, Number(env.SESSION_TTL_DAYS || 30));
  const expiresAt = nowTs() + (ttlDays * 86400);
  await env.DB.prepare(
    "INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?1, ?2, ?3, ?4)"
  ).bind(token, userId, expiresAt, nowTs()).run();
  return { token, expiresAt };
}

function safeSnapshot(input) {
  if (!input || typeof input !== "object") return null;
  try {
    const raw = JSON.stringify(input);
    if (!raw || raw.length > 8_000_000) return null;
    return raw;
  } catch {
    return null;
  }
}

function redactForClient(snapshotText, username) {
  try {
    const snap = JSON.parse(snapshotText || "{}");
    if (!snap || typeof snap !== "object") return null;
    snap.t = "push";
    snap.user = username;
    if (Object.prototype.hasOwnProperty.call(snap, "account")) delete snap.account;
    return snap;
  } catch {
    return null;
  }
}

async function registerUser(env, body) {
  const username = normalizeUsername(body.username);
  const password = String(body.password || "");
  const email = String(body.email || "").trim();

  if (!username || username.length < 3) return json({ error: "Username must be at least 3 characters." }, 400);
  if (!password || password.length < 6) return json({ error: "Password must be at least 6 characters." }, 400);
  if (!validEmail(email)) return json({ error: "Valid email is required." }, 400);

  const exists = await env.DB.prepare("SELECT id FROM users WHERE username = ?1").bind(username).first();
  if (exists) return json({ error: "Username already exists." }, 409);

  const salt = generateSalt();
  const hash = await pbkdf2Hash(password, salt);
  const now = nowTs();
  const inserted = await env.DB.prepare(
    "INSERT INTO users (username, email, salt, password_hash, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)"
  ).bind(username, email, salt, hash, now, now).run();

  const userId = Number(inserted.meta?.last_row_id || 0);
  const session = await issueSession(env, userId);
  return json({ ok: true, username, email, token: session.token });
}

async function loginUser(env, body) {
  const username = normalizeUsername(body.username);
  const password = String(body.password || "");
  if (!username || !password) return json({ error: "Username and password are required." }, 400);

  const user = await env.DB.prepare(
    "SELECT id, username, email, salt, password_hash FROM users WHERE username = ?1"
  ).bind(username).first();
  if (!user) return json({ error: "Invalid username or password." }, 401);

  const hash = await pbkdf2Hash(password, String(user.salt));
  if (hash !== String(user.password_hash)) return json({ error: "Invalid username or password." }, 401);

  const session = await issueSession(env, Number(user.id));
  return json({ ok: true, username: String(user.username), email: String(user.email), token: session.token });
}

async function logoutUser(env, body) {
  const token = String(body.token || "").trim();
  if (!token) return json({ ok: true });
  await env.DB.prepare("DELETE FROM sessions WHERE token = ?1").bind(token).run();
  return json({ ok: true });
}

async function recoverPassword(env, body) {
  const username = normalizeUsername(body.username);
  const email = String(body.email || "").trim().toLowerCase();
  const newPassword = String(body.newPassword || "");

  if (!username || !email || !newPassword) return json({ error: "Username, email, and new password are required." }, 400);
  if (newPassword.length < 6) return json({ error: "Password must be at least 6 characters." }, 400);

  const user = await env.DB.prepare("SELECT id, email FROM users WHERE username = ?1").bind(username).first();
  if (!user) return json({ error: "No matching account found." }, 404);
  if (String(user.email || "").trim().toLowerCase() !== email) return json({ error: "Email does not match this username." }, 403);

  const salt = generateSalt();
  const hash = await pbkdf2Hash(newPassword, salt);
  await env.DB.prepare(
    "UPDATE users SET salt = ?1, password_hash = ?2, updated_at = ?3 WHERE id = ?4"
  ).bind(salt, hash, nowTs(), Number(user.id)).run();

  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?1").bind(Number(user.id)).run();
  return json({ ok: true });
}

async function updateEmail(env, body) {
  const session = await loadSession(env, body.token);
  if (!session) return json({ error: "Unauthorized" }, 401);

  const email = String(body.email || "").trim();
  if (!validEmail(email)) return json({ error: "Valid email is required." }, 400);

  await env.DB.prepare("UPDATE users SET email = ?1, updated_at = ?2 WHERE id = ?3")
    .bind(email, nowTs(), session.userId)
    .run();

  return json({ ok: true, email });
}

async function changePassword(env, body) {
  const session = await loadSession(env, body.token);
  if (!session) return json({ error: "Unauthorized" }, 401);

  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  if (!currentPassword || !newPassword) return json({ error: "Current and new password are required." }, 400);
  if (newPassword.length < 6) return json({ error: "New password must be at least 6 characters." }, 400);

  const user = await env.DB.prepare("SELECT salt, password_hash FROM users WHERE id = ?1").bind(session.userId).first();
  if (!user) return json({ error: "User not found." }, 404);

  const currentHash = await pbkdf2Hash(currentPassword, String(user.salt));
  if (currentHash !== String(user.password_hash)) return json({ error: "Current password is incorrect." }, 403);

  const salt = generateSalt();
  const nextHash = await pbkdf2Hash(newPassword, salt);
  await env.DB.prepare("UPDATE users SET salt = ?1, password_hash = ?2, updated_at = ?3 WHERE id = ?4")
    .bind(salt, nextHash, nowTs(), session.userId)
    .run();

  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?1 AND token <> ?2").bind(session.userId, session.token).run();
  return json({ ok: true });
}

async function deleteAccount(env, body) {
  const session = await loadSession(env, body.token);
  if (!session) return json({ error: "Unauthorized" }, 401);

  const password = String(body.password || "");
  if (!password) return json({ error: "Password is required." }, 400);

  const user = await env.DB.prepare("SELECT salt, password_hash FROM users WHERE id = ?1").bind(session.userId).first();
  if (!user) return json({ error: "User not found." }, 404);

  const hash = await pbkdf2Hash(password, String(user.salt));
  if (hash !== String(user.password_hash)) return json({ error: "Incorrect password." }, 403);

  await env.DB.prepare("DELETE FROM users WHERE id = ?1").bind(session.userId).run();
  return json({ ok: true });
}

async function pullSnapshot(env, body) {
  const session = await loadSession(env, body.token);
  if (!session) return json({ error: "Unauthorized" }, 401);

  const known = Math.max(0, Number(body.knownVersion || 0));
  const row = await env.DB.prepare("SELECT version, snapshot FROM user_snapshots WHERE user_id = ?1")
    .bind(session.userId)
    .first();

  if (!row) return json({ ok: true, version: 0, snapshot: null, changed: false });

  const version = Number(row.version || 0);
  if (version <= known) return json({ ok: true, version, snapshot: null, changed: false });

  const snapshot = redactForClient(String(row.snapshot || "{}"), session.username);
  return json({ ok: true, version, snapshot, changed: true });
}

async function ensureSnapshotHistoryTable(env) {
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS user_snapshot_history (user_id INTEGER NOT NULL, version INTEGER NOT NULL, snapshot TEXT NOT NULL, updated_at INTEGER NOT NULL, updated_by TEXT, archived_at INTEGER NOT NULL, PRIMARY KEY (user_id, version), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)"
  ).run();
  await env.DB.prepare(
    "CREATE INDEX IF NOT EXISTS idx_user_snapshot_history_user_id_version ON user_snapshot_history(user_id, version DESC)"
  ).run();
}

async function archiveSnapshotVersion(env, userId, version, snapshotText, updatedAt, updatedBy) {
  const now = nowTs();
  await env.DB.prepare(
    "INSERT OR IGNORE INTO user_snapshot_history (user_id, version, snapshot, updated_at, updated_by, archived_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)"
  ).bind(userId, version, snapshotText, updatedAt || now, updatedBy || "", now).run();

  const cutoff = Math.max(0, Number(version || 0) - SNAPSHOT_HISTORY_MAX);
  if (cutoff > 0) {
    await env.DB.prepare(
      "DELETE FROM user_snapshot_history WHERE user_id = ?1 AND version <= ?2"
    ).bind(userId, cutoff).run();
  }
}

async function pushSnapshot(env, body) {
  const session = await loadSession(env, body.token);
  if (!session) return json({ error: "Unauthorized" }, 401);

  await ensureSnapshotHistoryTable(env);

  const baseVersion = Math.max(0, Number(body.baseVersion || 0));
  const snapshotText = safeSnapshot(body.snapshot);
  if (!snapshotText) return json({ error: "Invalid snapshot payload." }, 400);

  const existing = await env.DB.prepare("SELECT version, snapshot, updated_at, updated_by FROM user_snapshots WHERE user_id = ?1")
    .bind(session.userId)
    .first();

  const now = nowTs();
  const device = String(body.deviceId || "").slice(0, 128);

  if (!existing) {
    await env.DB.prepare(
      "INSERT INTO user_snapshots (user_id, version, snapshot, updated_at, updated_by) VALUES (?1, 1, ?2, ?3, ?4)"
    ).bind(session.userId, snapshotText, now, device).run();
    return json({ ok: true, version: 1 });
  }

  const currentVersion = Number(existing.version || 0);
  if (baseVersion !== currentVersion) {
    return json({ error: "Version conflict", conflict: true, version: currentVersion }, 409);
  }

  await archiveSnapshotVersion(
    env,
    session.userId,
    currentVersion,
    String(existing.snapshot || "{}"),
    Number(existing.updated_at || now),
    String(existing.updated_by || "")
  );

  const nextVersion = currentVersion + 1;
  await env.DB.prepare(
    "UPDATE user_snapshots SET version = ?1, snapshot = ?2, updated_at = ?3, updated_by = ?4 WHERE user_id = ?5"
  ).bind(nextVersion, snapshotText, now, device, session.userId).run();

  return json({ ok: true, version: nextVersion });
}

async function restoreLastSnapshot(env, body) {
  const session = await loadSession(env, body.token);
  if (!session) return json({ error: "Unauthorized" }, 401);

  await ensureSnapshotHistoryTable(env);

  const current = await env.DB.prepare(
    "SELECT version, snapshot, updated_at, updated_by FROM user_snapshots WHERE user_id = ?1"
  ).bind(session.userId).first();
  if (!current) return json({ error: "No cloud snapshot found for this account." }, 404);

  const previous = await env.DB.prepare(
    "SELECT version, snapshot, updated_at, updated_by FROM user_snapshot_history WHERE user_id = ?1 ORDER BY version DESC LIMIT 1"
  ).bind(session.userId).first();
  if (!previous) {
    return json({ error: "No previous cloud save is available yet." }, 409);
  }

  const now = nowTs();
  const device = String(body.deviceId || "").slice(0, 128);
  const currentVersion = Number(current.version || 0);
  const nextVersion = currentVersion + 1;

  await archiveSnapshotVersion(
    env,
    session.userId,
    currentVersion,
    String(current.snapshot || "{}"),
    Number(current.updated_at || now),
    String(current.updated_by || "")
  );

  await env.DB.prepare(
    "UPDATE user_snapshots SET version = ?1, snapshot = ?2, updated_at = ?3, updated_by = ?4 WHERE user_id = ?5"
  ).bind(nextVersion, String(previous.snapshot || "{}"), now, (device ? device + ":restore-last" : "restore-last"), session.userId).run();

  return json({
    ok: true,
    version: nextVersion,
    restoredFromVersion: Number(previous.version || 0),
    previousCurrentVersion: currentVersion
  });
}

async function getHistoryDepth(env, body) {
  const session = await loadSession(env, body.token);
  if (!session) return json({ error: "Unauthorized" }, 401);

  await ensureSnapshotHistoryTable(env);

  const row = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM user_snapshot_history WHERE user_id = ?1"
  ).bind(session.userId).first();

  const depth = Number(row && row.count ? row.count : 0);
  return json({ ok: true, historyDepth: depth });
}
