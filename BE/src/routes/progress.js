import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { validateProgressUpdate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

// Get all progress for the current user
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const records = await prisma.userProgress.findMany({
      where: { userId: req.user.id },
      include: { module: { select: { slug: true, title: true } } },
      orderBy: { lastAccessed: "desc" },
    });
    res.json(records);
  } catch (e) {
    next(e);
  }
});

// Update a module progress record for the current user
router.post(
  "/update",
  requireAuth,
  validateProgressUpdate,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { moduleId, progress, timeSpentMin = 0 } = req.body;

      const mod = await prisma.module.findFirst({
        where: { OR: [{ id: moduleId }, { slug: moduleId }] },
      });
      if (!mod) return res.status(404).json({ error: "Module not found" });

      const safeProgress = Math.max(0, Math.min(progress, 100));

      const record = await prisma.userProgress.upsert({
        where: { userId_moduleId: { userId, moduleId: mod.id } },
        update: {
          progress: safeProgress,
          timeSpentMin: { increment: timeSpentMin },
          lastAccessed: new Date(),
        },
        create: {
          userId,
          moduleId: mod.id,
          progress: safeProgress,
          timeSpentMin,
        },
      });

      res.json(record);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
