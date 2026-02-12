const express = require("express");
const {
  generateQRCode,
  getUserQRCodes,
  checkInWithQR,
  checkOutWithQR,
  getLatestQRCode
} = require("../controller/qr.controller");
const { isauthenticated } = require("../middleware/auth");

const router = express.Router();

// Generate and save QR code
router.post("/generate", isauthenticated, generateQRCode);

// Get user's QR code history
router.get("/history", isauthenticated, getUserQRCodes);

// Get user's latest active QR code
router.get("/latest", isauthenticated, getLatestQRCode);

// Check-in with QR code (used by guard)
router.post("/check-in", isauthenticated, checkInWithQR);

// Check-out with QR code (used by guard)
router.post("/check-out", isauthenticated, checkOutWithQR);

module.exports = router;
