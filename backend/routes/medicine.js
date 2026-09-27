const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");

// POST — Add new medicine
router.post("/", async (req, res) => {
  try {
    const { name, dosage, time } = req.body;
    const medicine = new Medicine({ name, dosage, time });
    await medicine.save();
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Get all medicines
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json({ success: true, data: medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH — Mark medicine as taken/untaken
router.patch("/:id/taken", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    medicine.taken = !medicine.taken;
    await medicine.save();
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH — Toggle reminder on/off
router.patch("/:id/reminder", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    medicine.reminderOn = !medicine.reminderOn;
    await medicine.save();
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — Remove medicine
router.delete("/:id", async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
