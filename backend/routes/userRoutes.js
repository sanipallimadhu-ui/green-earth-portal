const express = require("express");
const router = express.Router();

// REGISTER
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  res.json({
    message: "User registered successfully",
    user: { username, email }
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" });
  }

  res.json({
    message: "Login successful",
    user: { email }
  });
});

module.exports = router;
