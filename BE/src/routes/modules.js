import { Router } from "express";
import modules from "../data/modules.js";

const router = Router();

router.get("/", (_req, res) => res.json(modules));

router.get("/:id", (req, res) => {
  const mod = modules.find((m) => m.id === req.params.id);
  return mod
    ? res.json(mod)
    : res.status(404).json({ error: "Module not found" });
});

export default router;
