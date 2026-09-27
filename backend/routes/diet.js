const express = require("express");
const router = express.Router();
const DietLog = require("../models/DietLog");

// POST — Log a food entry
router.post("/", async (req, res) => {
  try {
    const { foodName, glycemicIndex, calories, mealType } = req.body;

    // Auto calculate category based on GI
    let category = "Safe";
    if (glycemicIndex > 70) category = "Avoid";
    else if (glycemicIndex > 55) category = "Moderate";

    const log = new DietLog({
      foodName,
      glycemicIndex,
      calories,
      category,
      mealType,
    });

    await log.save();
    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Get all diet logs
router.get("/", async (req, res) => {
  try {
    const logs = await DietLog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Get today's diet logs only
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logs = await DietLog.find({
      createdAt: { $gte: today },
    });

    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — Remove a food entry
router.delete("/:id", async (req, res) => {
  try {
    await DietLog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
