import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

const PORT = process.env.PORT || 3000;

// IMPORTANT: bind to 0.0.0.0 (not localhost)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ L.I.V.E API running on http://0.0.0.0:${PORT}`);
  if (process.env.NODE_ENV !== "production") {
    console.log("Environment variables loaded:");
    console.log({
      PORT: process.env.PORT,
      CORS_ORIGIN: process.env.CORS_ORIGIN,
      DB: process.env.DATABASE_URL ? "✅ set" : "❌ missing",
    });
  }
});
