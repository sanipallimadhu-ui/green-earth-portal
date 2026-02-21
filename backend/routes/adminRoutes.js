const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email, password });

    if (!admin) {
      return res.json({ message: "Invalid credentials" });
    }

    res.json({ admin });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE DEFAULT ADMIN (Temporary)
router.get("/create-admin", async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: "admin@gmail.com" });

    if (existing) {
      return res.send("Admin already exists");
    }

    const admin = new Admin({
      email: "admin@gmail.com",
      password: "admin123"
    });

    await admin.save();
    res.send("Admin created successfully");
  } catch (error) {
    res.status(500).send("Error creating admin");
  }
});

module.exports = router;