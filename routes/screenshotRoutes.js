const express = require('express');
const multer = require('multer');
const Screenshot = require('../models/Screenshot');
const router = express.Router();
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST /api/upload
router.post('/upload', upload.single('screenshot'), async (req, res) => {
  try {
    const screenshot = new Screenshot({ filename: req.file.filename });
    await screenshot.save();
    res.status(200).send('Screenshot uploaded');
  } catch (err) {
    res.status(500).send('Upload failed');
  }
});

// GET /api/screenshots
router.get('/screenshots', async (req, res) => {
  const screenshots = await Screenshot.find().sort({ uploadedAt: -1 });
  res.json(screenshots);
});

module.exports = router;
