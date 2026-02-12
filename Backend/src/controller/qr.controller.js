const QRCode = require("../models/QRCode.model");

// Generate and save QR code for user
exports.generateQRCode = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ success: false, message: "QR data is required" });
    }

    // Create new QR code record
    const qrRecord = await QRCode.create({
      user: userId,
      qrData: qrData,
      status: "generated"
    });

    res.status(201).json({ success: true, data: qrRecord });
  } catch (error) {
    next(error);
  }
};

// Get user's QR codes (history)
exports.getUserQRCodes = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const qrCodes = await QRCode.find({ user: userId })
      .populate('parkingLot', 'name pricePerHour')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: qrCodes });
  } catch (error) {
    next(error);
  }
};

// Record check-in using QR code
exports.checkInWithQR = async (req, res, next) => {
  try {
    const { qrCodeId, parkingLotId } = req.body;

    if (!qrCodeId || !parkingLotId) {
      return res.status(400).json({ 
        success: false, 
        message: "QR Code ID and Parking Lot ID are required" 
      });
    }

    const qrRecord = await QRCode.findById(qrCodeId);
    if (!qrRecord) {
      return res.status(404).json({ success: false, message: "QR Code not found" });
    }

    // Update QR record with check-in
    qrRecord.status = "check-in";
    qrRecord.checkInTime = new Date();
    qrRecord.parkingLot = parkingLotId;
    await qrRecord.save();

    res.status(200).json({ success: true, data: qrRecord });
  } catch (error) {
    next(error);
  }
};

// Record check-out using QR code
exports.checkOutWithQR = async (req, res, next) => {
  try {
    const { qrCodeId } = req.body;

    if (!qrCodeId) {
      return res.status(400).json({ 
        success: false, 
        message: "QR Code ID is required" 
      });
    }

    const qrRecord = await QRCode.findById(qrCodeId);
    if (!qrRecord) {
      return res.status(404).json({ success: false, message: "QR Code not found" });
    }

    // Update QR record with check-out
    qrRecord.status = "check-out";
    qrRecord.checkOutTime = new Date();
    qrRecord.isActive = false;
    await qrRecord.save();

    res.status(200).json({ success: true, data: qrRecord });
  } catch (error) {
    next(error);
  }
};

// Get latest active QR code for user
exports.getLatestQRCode = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const qrRecord = await QRCode.findOne({ user: userId, isActive: true })
      .sort({ createdAt: -1 });

    if (!qrRecord) {
      return res.status(404).json({ success: false, message: "No active QR code found" });
    }

    res.status(200).json({ success: true, data: qrRecord });
  } catch (error) {
    next(error);
  }
};
