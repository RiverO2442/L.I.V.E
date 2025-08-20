import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { validateQuizSubmission } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

// Get quiz questions by module slug (public or protected—your choice)
router.get("/:moduleSlug", async (req, res, next) => {
  try {
    const mod = await prisma.module.findUnique({
      where: { slug: req.params.moduleSlug },
    });
    if (!mod) return res.status(404).json({ error: "Module not found" });

    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId: mod.id },
      orderBy: { question: "asc" },
    });
    res.json(questions);
  } catch (e) {
    next(e);
  }
});

// Submit quiz answers (protected)
router.post(
  "/submit",
  requireAuth,
  validateQuizSubmission,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { moduleId, answers } = req.body;

      const mod = await prisma.module.findFirst({
        where: { OR: [{ id: moduleId }, { slug: moduleId }] },
      });
      if (!mod) return res.status(404).json({ error: "Module not found" });

      const questions = await prisma.quizQuestion.findMany({
        where: { moduleId: mod.id },
      });
      const correctMap = new Map(questions.map((q) => [q.id, q.correctIndex]));

      let correctCount = 0;
      for (const a of answers) {
        const expected = correctMap.get(a.questionId);
        if (typeof expected === "number" && expected === a.selectedIndex)
          correctCount++;
      }
      const total = questions.length || 1;
      const accuracy = Math.round((correctCount / total) * 100);

      const attempt = await prisma.quizAttempt.create({
        data: {
          userId,
          moduleId: mod.id,
          score: correctCount,
          total,
          accuracy,
          answers,
        },
      });

      const progress = await prisma.userProgress.upsert({
        where: { userId_moduleId: { userId, moduleId: mod.id } },
        update: { quizAccuracy: accuracy, lastAccessed: new Date() },
        create: {
          userId,
          moduleId: mod.id,
          progress: 0,
          quizAccuracy: accuracy,
          timeSpentMin: 0,
        },
      });

      res.json({ attempt, progress });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
