import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import xss from "xss-clean";
import hpp from "hpp";
import authRouter from "./routes/auth.js";

import modulesRouter from "./routes/modules.js";
import quizRouter from "./routes/quiz.js";
import progressRouter from "./routes/progress.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import rateLimiter from "./middleware/rateLimit.js";

const app = express();
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(xss());
app.use(hpp());
app.use(morgan("dev"));
app.use(rateLimiter);
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/modules", modulesRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/progress", progressRouter);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(notFound);
app.use(errorHandler);

export default app;
