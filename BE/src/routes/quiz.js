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
    .replace(/\s+/g, "-") // spaces -> dashes
    .replace(/[^\w-]+/g, "") // remove invalid chars
    .replace(/--+/g, "-") // collapse multiple -
    .replace(/^-+/, "") // trim starting -
    .replace(/-+$/, ""); // trim ending -
}

/**
 * Helper: find module by id, slug, or title (slugified)
 */
async function findModule(identifier) {
  const normalized = slugify(identifier);
  return prisma.module.findFirst({
    where: {
      OR: [
        { id: identifier },
        { slug: identifier },
        { slug: normalized }, // title-safe slug
      ],
    },
  });
}

/**
 * Validation schema for quiz submission
 */
const submissionSchema = Joi.object().keys({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        selectedIndex: Joi.number().integer().min(0).required(),
      })
    )
    .min(1)
    .required(),
  startTime: Joi.number().integer().optional(),
});

/**
 * GET /api/quiz/:idOrSlug/quiz
 * Return quiz questions grouped by lessons
 */
router.get("/:idOrSlug/quiz", async (req, res, next) => {
  try {
    const mod = await findModule(req.params.idOrSlug);
    if (!mod) return res.status(404).json({ error: "Module not found" });

    const lessons = await prisma.lesson.findMany({
      where: { moduleId: mod.id },
      orderBy: { order: "asc" },
      include: {
        questions: {
          select: { id: true, question: true, options: true, feedback: true },
        },
      },
    });

    res.json({
      module: { id: mod.id, slug: mod.slug, title: mod.title },
      lessons,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/quiz/:idOrSlug/quiz/submit
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

    // Load all questions (with lessonId + correctIndex for grading)
    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId: mod.id },
      select: { id: true, lessonId: true, correctIndex: true, feedback: true },
    });
    if (questions.length === 0) {
      return res.status(400).json({ error: "No questions for this module" });
    }

    const correctMap = new Map(
      questions.map((q) => [
        q.id,
        {
          correctIndex: q.correctIndex,
          feedback: q.feedback,
          lessonId: q.lessonId,
        },
      ])
    );

    // Grade submission
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
    const startTimeRaw = value.startTime ? Number(value.startTime) : null;
    const startTime = startTimeRaw ? new Date(startTimeRaw) : null;
    const endTime = new Date();
    let timeSpentMin = 0;
    if (startTime) {
      timeSpentMin = Math.max(1, Math.round((endTime - startTime) / 60000));
    }

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

    // --- Lesson-level progress ---
    const lessonIds = new Map(); // lessonId -> { answered, correct }
    results.forEach((r) => {
      const entry = correctMap.get(r.questionId);
      if (!entry?.lessonId) return;
      if (!lessonIds.has(entry.lessonId)) {
        lessonIds.set(entry.lessonId, { total: 0, correct: 0 });
      }
      const agg = lessonIds.get(entry.lessonId);
      agg.total++;
      if (r.correct) agg.correct++;
    });

    for (const [lessonId, stats] of lessonIds.entries()) {
      const lessonAccuracy = Math.round((stats.correct / stats.total) * 100);
      await prisma.userLessonProgress.upsert({
        where: { userId_lessonId: { userId: req.user.id, lessonId } },
        update: { completed: true, lastAccess: endTime },
        create: {
          userId: req.user.id,
          lessonId,
          completed: true,
          lastAccess: endTime,
        },
      });
    }

    // --- Module-level progress ---
    const userAnswers = await prisma.quizAttempt.findMany({
      where: { userId: req.user.id, moduleId: mod.id },
      select: { answers: true, accuracy: true },
    });

    const answeredIds = new Set();
    let totalAccuracy = 0;
    userAnswers.forEach((att) => {
      att.answers.forEach((ans) => answeredIds.add(ans.questionId));
      totalAccuracy += att.accuracy;
    });

    const answeredCount = answeredIds.size;
    const progressPercent = Math.round((answeredCount / total) * 100);
    const avgAccuracy = Math.round(totalAccuracy / userAnswers.length);

    const progress = await prisma.userProgress.upsert({
      where: { userId_moduleId: { userId: req.user.id, moduleId: mod.id } },
      update: {
        progress: progressPercent,
        quizAccuracy: avgAccuracy,
        lastAccessed: endTime,
        timeSpentMin: { increment: timeSpentMin },
      },
      create: {
        userId: req.user.id,
        moduleId: mod.id,
        progress: progressPercent,
        quizAccuracy: avgAccuracy,
        timeSpentMin,
      },
    });

    res.json({
      result: { correct: correctCount, total, accuracy, timeSpentMin },
      results,
      attempt,
      progress,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/quiz/:slug/quiz
 * Add or update a quiz
 */
router.post("/:slug/quiz", async (req, res) => {
  try {
    const { slug } = req.params;
    const { question, feedback, options, correctIndex, lessonId } = req.body;

    if (
      !question ||
      !feedback ||
      !Array.isArray(options) ||
      options.length < 2
    ) {
      return res.status(400).json({
        error: "Question, feedback, and at least 2 options are required",
      });
    }

    const module = await prisma.module.findUnique({ where: { slug } });
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    const newQuiz = await prisma.quizQuestion.upsert({
      where: {
        moduleId_question: {
          moduleId: module.id,
          question,
        },
      },
      update: {
        feedback,
        options,
        correctIndex,
        lessonId: lessonId || null,
      },
      create: {
        question,
        feedback,
        options,
        correctIndex,
        moduleId: module.id,
        lessonId: lessonId || null,
      },
    });

    res.json(newQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add or update quiz" });
  }
});

/**
 * GET /api/quiz/:idOrSlug/quiz/attempts
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
