// BE/routes/modules.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

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
// Includes lessons + user lesson progress if authenticated
router.get("/:identifier", requireAuth, async (req, res, next) => {
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

    // 👇 attach user lesson progress
    const lessonProgress = await prisma.userLessonProgress.findMany({
      where: {
        userId: req.user.id,
        lessonId: { in: mod.lessons.map((l) => l.id) },
      },
      select: {
        lessonId: true,
        completed: true,
        lastAccess: true,
      },
    });

    // Merge lesson progress into lessons
    const lessonsWithProgress = mod.lessons.map((lesson) => {
      const progress = lessonProgress.find((lp) => lp.lessonId === lesson.id);
      return {
        ...lesson,
        completed: progress?.completed || false,
        lastAccess: progress?.lastAccess || null,
      };
    });

    res.json({ ...mod, lessons: lessonsWithProgress });
  } catch (err) {
    next(err);
  }
});

// ✅ Mark lesson as completed or accessed
router.post(
  "/:moduleId/lessons/:lessonId/progress",
  requireAuth,
  async (req, res, next) => {
    try {
      const { moduleId, lessonId } = req.params;
      const { completed } = req.body;

      const lesson = await prisma.lesson.findFirst({
        where: { id: lessonId, moduleId: moduleId },
      });
      if (!lesson) return res.status(404).json({ error: "Lesson not found" });

      const state = await prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: { userId: req.user.id, lessonId },
        },
        update: {
          completed: completed ?? true,
          lastAccess: new Date(),
        },
        create: {
          userId: req.user.id,
          lessonId,
          completed: completed ?? true,
        },
      });

      res.json(state);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
