// BE/routes/quiz.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { requireAuth } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

/**
 * Helper: normalize string -> slug
 */
function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Helper: find module by id, slug, or slugified title
 */
async function findModule(identifier) {
  const normalized = slugify(identifier);
  return prisma.module.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }, { slug: normalized }],
    },
  });
}

/**
 * Validation schema for quiz submission
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
  startTime: Joi.date().required(), // 👈 new: front-end must send
});

/**
 * GET /api/modules/:idOrSlug/quiz
 * Return quiz questions for a module (with feedback, but without correctIndex)
 */
router.get("/:idOrSlug/quiz", async (req, res, next) => {
  try {
    const mod = await findModule(req.params.idOrSlug);
    if (!mod) return res.status(404).json({ error: "Module not found" });

    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId: mod.id },
      orderBy: { id: "asc" },
      select: {
        id: true,
        question: true,
        options: true,
        feedback: true,
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

    const mod = await findModule(req.params.idOrSlug);
    if (!mod) return res.status(404).json({ error: "Module not found" });

    // Get all questions
    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId: mod.id },
      select: { id: true, correctIndex: true, feedback: true },
    });
    if (questions.length === 0) {
      return res.status(400).json({ error: "No questions for this module" });
    }

    // Build answer map
    const correctMap = new Map(
      questions.map((q) => [
        q.id,
        { correctIndex: q.correctIndex, feedback: q.feedback },
      ])
    );

    // Grade answers
    let correctCount = 0;
    const results = value.answers.map((a) => {
      const entry = correctMap.get(a.questionId);
      if (!entry) return { ...a, correct: false, feedback: "Invalid question" };
      const correct = entry.correctIndex === a.selectedIndex;
      if (correct) correctCount++;
      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correct,
        feedback: entry.feedback,
      };
    });

    const total = questions.length;
    const accuracy = Math.round((correctCount / total) * 100);

    // Time spent
    const startTime = new Date(value.startTime);
    const endTime = new Date();
    const durationMinutes = Math.max(
      1,
      Math.round((endTime - startTime) / 60000)
    );

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        moduleId: mod.id,
        score: correctCount,
        total,
        accuracy,
        answers: value.answers,
      },
      select: {
        id: true,
        score: true,
        total: true,
        accuracy: true,
        createdAt: true,
      },
    });

    // Count progress (attempts / total quizzes)
    const totalQuizzes = await prisma.quizQuestion.count({
      where: { moduleId: mod.id },
    });
    const attemptsDone = await prisma.quizAttempt.count({
      where: { userId: req.user.id, moduleId: mod.id },
    });
    const progressPercent = Math.min(
      100,
      Math.round((attemptsDone / totalQuizzes) * 100)
    );

    // Update progress
    const progress = await prisma.userProgress.upsert({
      where: { userId_moduleId: { userId: req.user.id, moduleId: mod.id } },
      update: {
        quizAccuracy: accuracy,
        lastAccessed: new Date(),
        timeSpentMin: { increment: durationMinutes },
        progress: progressPercent,
      },
      create: {
        userId: req.user.id,
        moduleId: mod.id,
        progress: progressPercent,
        quizAccuracy: accuracy,
        timeSpentMin: durationMinutes,
      },
    });

    res.json({
      result: { correct: correctCount, total, accuracy },
      results,
      attempt,
      progress,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/modules/:idOrSlug/quiz/attempts
 * Return attempts for a user + module
 */
router.get("/:idOrSlug/quiz/attempts", requireAuth, async (req, res, next) => {
  try {
    const mod = await findModule(req.params.idOrSlug);
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
