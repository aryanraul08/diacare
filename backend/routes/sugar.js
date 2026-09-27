const express = require("express");
const router = express.Router();
const SugarLog = require("../models/SugarLog");

// POST — Save a new sugar reading
router.post("/", async (req, res) => {
  try {
    const { level, note } = req.body;

    // Auto calculate status
    let status = "Normal";
    if (level > 140) status = "High";
    if (level < 70) status = "Low";

    const log = new SugarLog({ level, status, note });
    await log.save();

    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Fetch all sugar readings
router.get("/", async (req, res) => {
  try {
    const logs = await SugarLog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — Delete a reading
router.delete("/:id", async (req, res) => {
  try {
    await SugarLog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
