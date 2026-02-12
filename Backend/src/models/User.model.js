const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    default: "User",
  },
  lastName: {
    type: String,
    required: true,
    default: "Name",
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["driver", "superadmin"],
    default: "driver",
  },
  photo: {
    type: String,
    default: "",
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;