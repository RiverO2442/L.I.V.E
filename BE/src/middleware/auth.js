import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const ACCESS_TTL = process.env.JWT_EXPIRES_IN || "15m"; // short
const REFRESH_TTL_SEC = parseInt(
  process.env.REFRESH_TTL_SEC || `${60 * 60 * 24 * 7}`
); // 7 days

export function signAccess(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_TTL });
}

export function verifyAccess(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const d = verifyAccess(token);
    req.user = { id: d.sub, email: d.email, name: d.name };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ---- Refresh token helpers ----
export function sha256(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function issueRefreshToken(user) {
  const raw = crypto.randomBytes(48).toString("hex"); // opaque token
  const tokenHash = sha256(raw);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });
  return { raw, expiresAt };
}

export async function rotateRefreshToken(oldRaw) {
  const tokenHash = sha256(oldRaw);
  const found = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!found || found.revokedAt || found.expiresAt < new Date()) return null;
  // revoke old
  await prisma.refreshToken.update({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  });
  // issue new
  const raw = crypto.randomBytes(48).toString("hex");
  const newHash = sha256(raw);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);
  await prisma.refreshToken.create({
    data: { userId: found.userId, tokenHash: newHash, expiresAt },
  });
  return { userId: found.userId, raw, expiresAt };
}

export function setRefreshCookie(res, raw, expiresAt) {
  // httpOnly cookie (recommended). Use Secure in prod.
  res.cookie("refresh_token", raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/api/auth",
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie("refresh_token", { path: "/api/auth" });
}
