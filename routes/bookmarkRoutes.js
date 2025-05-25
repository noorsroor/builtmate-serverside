// const express = require("express");
// const {
//     addProfessionalToBookmarks,
//     removeProfessionalFromBookmarks,
//     addProjectToBookmarks,
//     removeProjectFromBookmarks,
//     getBookmarks
// } = require("../controllers/bookmarkController");
// const { verifyToken } = require("../middleware/authMiddleware");

// const router = express.Router();

// // Routes for bookmarking professionals
// router.post("/add-professional", verifyToken, addProfessionalToBookmarks);
// router.post("/remove-professional", verifyToken, removeProfessionalFromBookmarks);

// // Routes for bookmarking projects
// router.post("/add-project", verifyToken, addProjectToBookmarks);
// router.post("/remove-project", verifyToken, removeProjectFromBookmarks);

// // Get all bookmarks for a user
// router.get("/", verifyToken, getBookmarks);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { toggleBookmark, getUserBookmarks } = require('../controllers/bookmarkController');

router.post('/toggle', toggleBookmark);
router.get("/:userId", getUserBookmarks);

module.exports = router;
