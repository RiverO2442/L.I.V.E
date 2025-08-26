import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { validateProgressUpdate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

//
// 📌 Get all module progress for the current user
//
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

//
// 📌 Update a module progress record for the current user
//
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

//
// 📌 Get lesson progress for a specific module
//
router.get("/:moduleId/lessons", requireAuth, async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    const mod = await prisma.module.findFirst({
      where: { OR: [{ id: moduleId }, { slug: moduleId }] },
      include: { lessons: { select: { id: true, title: true, order: true } } },
    });

    if (!mod) return res.status(404).json({ error: "Module not found" });

    const lessonProgress = await prisma.userLessonProgress.findMany({
      where: {
        userId: req.user.id,
        lessonId: { in: mod.lessons.map((l) => l.id) },
      },
    });

    const merged = mod.lessons.map((lesson) => {
      const progress = lessonProgress.find((lp) => lp.lessonId === lesson.id);
      return {
        ...lesson,
        completed: progress?.completed || false,
        lastAccess: progress?.lastAccess || null,
      };
    });

    res.json({
      module: { id: mod.id, slug: mod.slug, title: mod.title },
      lessons: merged,
    });
  } catch (e) {
    next(e);
  }
});

//
// 📌 Update progress for a specific lesson
//
router.post(
  "/:moduleId/lessons/:lessonId",
  requireAuth,
  async (req, res, next) => {
    try {
      const { moduleId, lessonId } = req.params;
      const { completed = true } = req.body;

      // validate lesson belongs to module
      const lesson = await prisma.lesson.findFirst({
        where: { id: lessonId, moduleId },
      });
      if (!lesson)
        return res
          .status(404)
          .json({ error: "Lesson not found in this module" });

      const state = await prisma.userLessonProgress.upsert({
        where: { userId_lessonId: { userId: req.user.id, lessonId } },
        update: { completed, lastAccess: new Date() },
        create: { userId: req.user.id, lessonId, completed },
      });

      res.json(state);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
