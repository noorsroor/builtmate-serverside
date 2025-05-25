const express = require('express');
const router = express.Router();
const parser = require('../middleware/upload');

router.post('/upload', parser.single('image'), (req, res) => {
  try {
    const file = req.file;
    res.json({
      url: file.path,
      public_id: file.filename,
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
