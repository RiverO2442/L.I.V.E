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
  lessonId: Joi.string().required(),
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

// POST /api/quiz/:idOrSlug/quiz/submit
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

    // --- 1. Fetch only the questions for this lesson
    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId: mod.id, lessonId: value.lessonId },
      select: { id: true, correctIndex: true, feedback: true },
    });
    if (!questions.length) {
      return res.status(400).json({ error: "No questions for this lesson" });
    }

    // --- 2. Grade answers
    let correctCount = 0;
    const results = value.answers.map((a) => {
      const q = questions.find((q) => q.id === a.questionId);
      if (!q) return { ...a, correct: false, feedback: "Invalid question" };

      const correct = q.correctIndex === a.selectedIndex;
      if (correct) correctCount++;

      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correct,
        feedback: q.feedback,
      };
    });

    const total = questions.length;
    const accuracy = Math.round((correctCount / total) * 100);

    // --- 3. Save attempt tied to lesson
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        moduleId: mod.id,
        score: correctCount,
        total,
        accuracy,
        answers: value.answers,
      },
    });

    // --- 4. Update LESSON progress (completed once submitted)
    const lessonProgress = await prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: { userId: req.user.id, lessonId: value.lessonId },
      },
      update: {
        completed: true,
        accuracy,
        attempts: { increment: 1 },
        lastAccess: new Date(),
      },
      create: {
        userId: req.user.id,
        lessonId: value.lessonId,
        completed: true,
        accuracy,
        attempts: 1,
        lastAccess: new Date(),
      },
    });

    // --- 5. Update MODULE progress (average of lesson accuracies)
    const allLessonProgresses = await prisma.userLessonProgress.findMany({
      where: { userId: req.user.id, lesson: { moduleId: mod.id } },
    });

    const completedLessons = allLessonProgresses.filter((lp) => lp.completed);
    const avgAccuracy =
      completedLessons.length > 0
        ? Math.round(
            completedLessons.reduce((sum, lp) => sum + (lp.accuracy || 0), 0) /
              completedLessons.length
          )
        : 0;

    const totalLessons = await prisma.lesson.count({
      where: { moduleId: mod.id },
    });
    const progressPercent =
      totalLessons > 0
        ? Math.round((completedLessons.length / totalLessons) * 100)
        : 0;

    const moduleProgress = await prisma.userProgress.upsert({
      where: { userId_moduleId: { userId: req.user.id, moduleId: mod.id } },
      update: {
        progress: progressPercent,
        quizAccuracy: avgAccuracy,
        lastAccessed: new Date(),
      },
      create: {
        userId: req.user.id,
        moduleId: mod.id,
        progress: progressPercent,
        quizAccuracy: avgAccuracy,
        timeSpentMin: 0,
      },
    });

    res.json({
      result: { correct: correctCount, total, accuracy },
      results,
      attempt,
      lessonProgress,
      moduleProgress,
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
