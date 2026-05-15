import crypto from "crypto"

const TOKEN_SECRET = process.env.AUTH_SECRET || "codememo-dev-secret-change-me"
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7

const base64url = (value) =>
  Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")

const fromBase64url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  return Buffer.from(normalized, "base64").toString("utf8")
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password, passwordHash = "") {
  const [salt, stored] = passwordHash.split(":")
  if (!salt || !stored) return false
  const next = hashPassword(password, salt).split(":")[1]
  return crypto.timingSafeEqual(Buffer.from(stored, "hex"), Buffer.from(next, "hex"))
}

export function signToken(user) {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    exp: Date.now() + TOKEN_TTL_MS,
  }
  const body = base64url(JSON.stringify(payload))
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url")
  return `${body}.${signature}`
}

export function verifyToken(token = "") {
  const [body, signature] = token.split(".")
  if (!body || !signature) return null
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url")
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null

  const payload = JSON.parse(fromBase64url(body))
  if (!payload.exp || Date.now() > payload.exp) return null
  return payload
}
