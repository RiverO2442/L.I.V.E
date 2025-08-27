import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import Joi from "joi";
import {
  signAccess,
  requireAuth,
  issueRefreshToken,
  rotateRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ error: "Invalid payload", details: error.details });

    const exists = await prisma.user.findUnique({
      where: { email: value.email },
    });
    if (exists)
      return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(value.password, 12);
    const user = await prisma.user.create({
      data: { name: value.name, email: value.email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const accessToken = signAccess({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    const { raw: refreshRaw, expiresAt } = await issueRefreshToken(user);
    setRefreshCookie(res, refreshRaw, expiresAt);

    res.status(201).json({
      user,
      accessToken,
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ error: "Invalid payload", details: error.details });

    const user = await prisma.user.findUnique({
      where: { email: value.email },
    });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(value.password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    const accessToken = signAccess({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    const { raw: refreshRaw, expiresAt } = await issueRefreshToken(user);
    setRefreshCookie(res, refreshRaw, expiresAt);

    res.json({
      user: publicUser,
      accessToken,
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req, res, next) => {
  try {
    // refresh token comes from httpOnly cookie
    const rt = req.cookies?.refresh_token;
    if (!rt) return res.status(401).json({ error: "Missing refresh token" });

    const rotated = await rotateRefreshToken(rt);
    if (!rotated) {
      clearRefreshCookie(res);
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    // issue new access + set new refresh cookie
    const user = await prisma.user.findUnique({
      where: { id: rotated.userId },
    });
    const accessToken = signAccess({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    setRefreshCookie(res, rotated.raw, rotated.expiresAt);

    res.json({ accessToken, expiresIn: process.env.JWT_EXPIRES_IN || "15m" });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/logout
router.post("/logout", async (req, res, next) => {
  try {
    const rt = req.cookies?.refresh_token;
    if (rt) {
      // best-effort revoke (ignore errors)
      const { sha256 } = await import("../middleware/auth.js");
      const tokenHash = sha256(rt);
      await prisma.refreshToken
        .update({
          where: { tokenHash },
          data: { revokedAt: new Date() },
        })
        .catch(() => {});
    }
    clearRefreshCookie(res);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    res.json(me);
  } catch (e) {
    next(e);
  }
});

export default router;
