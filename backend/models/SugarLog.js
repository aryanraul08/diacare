const mongoose = require("mongoose");

const SugarLogSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
  },
  status: {
    type: String, // 'Normal', 'High', 'Low'
  },
  note: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SugarLog", SugarLogSchema);
