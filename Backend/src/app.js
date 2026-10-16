const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { config } = require("./config/env");
const { employeeRoutes } = require("./routes/employeeRoutes");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.frontendOrigin.split(",").map((origin) => origin.trim()),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Directory API is running.",
    environment: config.nodeEnv,
  });
});

app.use("/api/employees", employeeRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = { app };
