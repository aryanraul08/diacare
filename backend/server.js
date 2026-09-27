const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Routes
const sugarRoutes = require("./routes/sugar.js");
const medicineRoutes = require("./routes/medicine");
const dietRoutes = require("./routes/diet");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected!"))
  .catch((err) => console.log("❌ DB Error:", err));

// Use Routes
app.use("/sugar", sugarRoutes);
app.use("/medicine", medicineRoutes);
app.use("/diet", dietRoutes);

app.get("/", (req, res) => {
  res.json({ message: "DiaCare Backend running!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});
