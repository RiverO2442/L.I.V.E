// BE/routes/modules.js
const express = require("express");
const router = express.Router();
const modules = require("../data/modules");
const { updateProgress, getProgress } = require("../data/progress");
const { validateProgress, validateQuiz } = require("../middleware/validate");

// GET all modules with progress
router.get("/", (req, res) => {
  const withProgress = modules.map((m) => ({
    ...m,
    progress: getProgress(m.id),
  }));
  res.json(withProgress);
});

// GET a specific module with progress
router.get("/:id", (req, res) => {
  const module = modules.find((m) => m.id === req.params.id);
  if (module) {
    module.progress = getProgress(module.id);
    res.json(module);
  } else {
    res.status(404).json({ error: "Module not found" });
  }
});

// POST progress update for a module
router.post("/:id/progress", validateProgress, (req, res) => {
  const { value } = req.body;
  const module = modules.find((m) => m.id === req.params.id);
  if (!module) {
    return res.status(404).json({ error: "Module not found" });
  }
  updateProgress(req.params.id, value);
  res.json({ moduleId: req.params.id, progress: getProgress(req.params.id) });
});

// POST quiz answers and return score
router.post("/:id/quiz", validateQuiz, (req, res) => {
  const module = modules.find((m) => m.id === req.params.id);
  const { answers } = req.body;

  if (!module || !module.quiz || module.quiz.length === 0) {
    return res.status(404).json({ error: "Quiz not found for this module" });
  }

  let correct = 0;
  module.quiz.forEach((q, i) => {
    if (answers[i] === q.answer) correct++;
  });

  const score = (correct / module.quiz.length) * 100;
  updateProgress(module.id, 20); // Optional: simulate gamified reward

  res.json({
    score,
    correct,
    total: module.quiz.length,
    progress: getProgress(module.id),
  });
});

module.exports = router;
