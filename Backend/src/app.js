const express = require("express");
const errorHandler = require("./middleware/HandleError");
const path = require("path");
const router = require("./routes");
const cors = require("cors");

const app = express();

// --- Global Middleware ---

// Enable Cross-Origin Resource Sharing (CORS) for frontend-backend communication
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Versioned API routes (all routes start with /api/v1)
app.use("/api/v1", router);

// --- Error Handling ---

// Global error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;
