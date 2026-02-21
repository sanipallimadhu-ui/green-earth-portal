const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Report = require("../models/Report");

/* ------------------ ENSURE UPLOAD FOLDER EXISTS ------------------ */
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ------------------ MULTER CONFIG ------------------ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* ===================== POST REPORT ===================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newReport = new Report({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      address: req.body.address,
      image: req.file ? req.file.filename : null,
      status: "Pending"
    });

    await newReport.save();

    res.status(201).json({
      message: "Report submitted successfully",
      report: newReport
    });

  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ message: "Report submission failed" });
  }
});


/* ===================== GET ALL REPORTS ===================== */
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
});


/* ===================== UPDATE STATUS ===================== */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Status updated", report: updated });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});


/* ===================== DELETE REPORT ===================== */
router.delete("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Delete image file if exists
    if (report.image) {
      const imagePath = path.join(uploadDir, report.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json({ message: "Report deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
