import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import xss from "xss-clean";
import hpp from "hpp";
import authRouter from "./routes/auth.js";
import quizRouter from "./routes/quiz.js";
import modulesRouter from "./routes/modules.js";
import progressRouter from "./routes/progress.js";
import cookieParser from "cookie-parser";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import rateLimiter from "./middleware/rateLimit.js";

const app = express();

// -------------------
// Security & Middleware
// -------------------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(xss());
app.use(hpp());
app.use(morgan("dev"));
app.use(rateLimiter);
app.use(cookieParser());

// -------------------
// Routes
// -------------------
app.use("/api/auth", authRouter);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/modules", modulesRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/progress", progressRouter);

// -------------------
// Error handlers
// -------------------
app.use(notFound);
app.use(errorHandler);

// -------------------
// Debug: List all endpoints (for MSc testing)
// -------------------
if (process.env.NODE_ENV !== "production") {
  const listEndpoints = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Direct routes
      listEndpoints.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods),
      });
    } else if (middleware.name === "router") {
      // Router with paths
      middleware.handle.stack.forEach((handler) => {
        const basePath = middleware.regexp.source
          .replace("^\\", "")
          .replace("\\/?(?=\\/|$)", "");
        listEndpoints.push({
          path: basePath + handler.route.path,
          methods: Object.keys(handler.route.methods),
        });
      });
    }
  });
  console.log("Registered endpoints:", listEndpoints);
}

export default app;
