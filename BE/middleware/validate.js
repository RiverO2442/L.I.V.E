// BE/middleware/validate.js
function validateProgress(req, res, next) {
  const { value } = req.body;
  if (typeof value !== "number" || value < 0 || value > 100) {
    return res
      .status(400)
      .json({ error: "Progress value must be a number between 0 and 100." });
  }
  next();
}

function validateQuiz(req, res, next) {
  const { answers } = req.body;
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: "Answers must be an array." });
  }
  next();
}

module.exports = { validateProgress, validateQuiz };
