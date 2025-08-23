// BE/routes/modules.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// ✅ Get all modules
router.get("/", async (_req, res, next) => {
  try {
    const modules = await prisma.module.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(modules);
  } catch (err) {
    next(err);
  }
});

// ✅ Get a specific module by slug or title (case-insensitive)
router.get("/:identifier", async (req, res, next) => {
  try {
    const identifier = req.params.identifier.toLowerCase();

    const mod = await prisma.module.findFirst({
      where: {
        OR: [
          { slug: identifier },
          { title: { equals: identifier, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        lessons: {
          select: { id: true, title: true, order: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!mod) return res.status(404).json({ error: "Module not found" });

    res.json(mod);
  } catch (err) {
    next(err);
  }
});

export default router;
