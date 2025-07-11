// BE/routes/modules.js
const express = require("express");
const router = express.Router();
const modules = require("../data/modules");

// GET all modules
router.get("/", (req, res) => {
  res.json(modules);
});

// GET a specific module
router.get("/:id", (req, res) => {
  const module = modules.find((m) => m.id === req.params.id);
  if (module) {
    res.json(module);
  } else {
    res.status(404).json({ error: "Module not found" });
  }
});

module.exports = router;
