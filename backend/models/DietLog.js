const mongoose = require("mongoose");

const DietLogSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  glycemicIndex: {
    type: Number, // GI value of the food
  },
  calories: {
    type: Number,
  },
  category: {
    type: String, // 'Safe', 'Moderate', 'Avoid'
  },
  mealType: {
    type: String, // 'Breakfast', 'Lunch', 'Dinner', 'Snack'
    default: "Snack",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DietLog", DietLogSchema);
