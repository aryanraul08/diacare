const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String, // e.g. '500mg'
    required: true,
  },
  time: {
    type: String, // e.g. '8:00 AM'
    required: true,
  },
  taken: {
    type: Boolean,
    default: false,
  },
  reminderOn: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Medicine", MedicineSchema);
