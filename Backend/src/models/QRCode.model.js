const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const qrCodeSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  qrData: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["generated", "check-in", "check-out", "used"],
    default: "generated"
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  parkingLot: {
    type: ObjectId,
    ref: "ParkingLot"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const QRCode = mongoose.model("QRCode", qrCodeSchema);
module.exports = QRCode;
