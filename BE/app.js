const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const moduleRoutes = require("./routes/modules");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/modules", moduleRoutes);

app.get("/", (req, res) => {
  res.send("L.I.V.E Backend is running");
});

app.use(errorHandler); // Always last

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
