export default function errorHandler(err, _req, res, _next) {
  console.error("[ERROR]", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
}
