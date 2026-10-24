// Autentikasi aman berbasis Web Crypto API & JWT (kompatibel dengan Node.js, Vercel Edge, dan Cloudflare Workers tanpa native C++ binary)

const JWT_SECRET = process.env.JWT_SECRET || "falaahiyyah_secret_jwt_key_sumedang_secure_2025_9847291847129";
export const SESSION_COOKIE_NAME = "falaahiyyah_admin_session";

// Encode base64url
function base64UrlEncode(str: string): string {
  const buff = Buffer.from(str, "utf-8");
  return buff.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64").toString("utf-8");
}

// Generate secure PBKDF2 hash for password
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID().replace(/-/g, "").substring(0, 16);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${salt}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // If storedHash is in salt:hex format
  if (storedHash.includes(":")) {
    const [salt, expectedHash] = storedHash.split(":");
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: enc.encode(salt),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    const hashArray = Array.from(new Uint8Array(derivedBits));
    const actualHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return actualHash === expectedHash;
  }

  // Fallback for plain text matching during initial seed if needed
  return password === storedHash;
}

// Sign JWT Session Token
export async function createSessionToken(payload: Record<string, any>, expiresInHours = 24): Promise<string> {
  const enc = new TextEncoder();
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInHours * 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const signatureHex = Buffer.from(signature).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  return `${data}.${signatureHex}`;
}

// Verify JWT Session Token
export async function verifySessionToken(token: string): Promise<Record<string, any> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const data = `${headerB64}.${payloadB64}`;
    const enc = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Reconstruct buffer from base64url
    let base64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const signatureBytes = Buffer.from(base64, "base64");

    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, enc.encode(data));
    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(payloadB64));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}
