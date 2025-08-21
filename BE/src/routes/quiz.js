// BE/routes/quiz.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { requireAuth } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

/**
 * Helper: find module by id OR slug
 */
async function findModuleByIdOrSlug(idOrSlug) {
  return prisma.module.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
  });
}

/**
 * Validation schema for quiz submission
 * Body shape:
 * { answers: [{ questionId: string, selectedIndex: number }] }
 */
const submissionSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        selectedIndex: Joi.number().integer().min(0).required(),
      })
    )
    .min(1)
    .required(),
});

/**
 * GET /api/modules/:idOrSlug/quiz
 * Return quiz questions for a module (WITHOUT correctIndex)
 */
router.get("/:idOrSlug/quiz", async (req, res, next) => {
  try {
    const mod = await findModuleByIdOrSlug(req.params.idOrSlug);
    if (!mod) return res.status(404).json({ error: "Module not found" });

    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId: mod.id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        question: true,
        options: true, // assumed string[]
        // Do NOT expose correctIndex here
      },
    });

    res.json({
      module: { id: mod.id, slug: mod.slug, title: mod.title },
      questions,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/modules/:idOrSlug/quiz/submit
 * Grade submission, store attempt, and update progress
 * Requires auth (user from requireAuth)
 */
router.post("/:idOrSlug/quiz/submit", requireAuth, async (req, res, next) => {
  try {
    const { error, value } = submissionSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ error: "Invalid payload", details: error.details });
    }

    const mod = await findModuleByIdOrSlug(req.params.idOrSlug);
    if (!mod) return res.status(404).json({ error: "Module not found" });

    // Load all questions (with correctIndex for grading)
    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId: mod.id },
      select: { id: true, correctIndex: true },
    });

    if (questions.length === 0) {
      return res.status(400).json({ error: "No questions for this module" });
    }

    // Build correct answer map
    const correctMap = new Map(questions.map((q) => [q.id, q.correctIndex]));

    // Grade
    let correctCount = 0;
    for (const a of value.answers) {
      const expected = correctMap.get(a.questionId);
      if (typeof expected === "number" && expected === a.selectedIndex) {
        correctCount++;
      }
    }

    const total = questions.length;
    const accuracy = Math.round((correctCount / total) * 100);

    // Persist attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        moduleId: mod.id,
        score: correctCount,
        total,
        accuracy,
        answers: value.answers, // JSON column
      },
      select: {
        id: true,
        score: true,
        total: true,
        accuracy: true,
        createdAt: true,
      },
    });

    // Update or create user progress
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_moduleId: { userId: req.user.id, moduleId: mod.id },
      },
      update: {
        quizAccuracy: accuracy,
        lastAccessed: new Date(),
      },
      create: {
        userId: req.user.id,
        moduleId: mod.id,
        progress: 0, // keep or update elsewhere
        quizAccuracy: accuracy,
        timeSpentMin: 0,
      },
      select: {
        userId: true,
        moduleId: true,
        progress: true,
        quizAccuracy: true,
        timeSpentMin: true,
        lastAccessed: true,
      },
    });

    res.json({
      result: {
        correct: correctCount,
        total,
        accuracy,
      },
      attempt,
      progress,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/modules/:idOrSlug/quiz/attempts
 * Return current user's attempts for a module
 */
router.get("/:idOrSlug/quiz/attempts", requireAuth, async (req, res, next) => {
  try {
    const mod = await findModuleByIdOrSlug(req.params.idOrSlug);
    if (!mod) return res.status(404).json({ error: "Module not found" });

    const attempts = await prisma.quizAttempt.findMany({
      where: { moduleId: mod.id, userId: req.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        score: true,
        total: true,
        accuracy: true,
        createdAt: true,
      },
    });

    res.json({
      module: { id: mod.id, slug: mod.slug, title: mod.title },
      attempts,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
