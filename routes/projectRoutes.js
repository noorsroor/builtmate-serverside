const express = require('express');
const router = express.Router();
const parser = require('../middleware/upload'); // Multer + Cloudinary config
const { createProject, getAllProjects, getProjectById, getHomeProjects,getSuccessProjects } = require('../controllers/projectController');

// POST a new project
router.post('/projects', parser.array('images', 15), createProject); // Max 5 images

//get all projects 
router.get("/projects", getAllProjects); // GET /api/projects

//get project details by id 
router.get("/projects/:id", getProjectById);

router.get("/home-projects", getHomeProjects);

router.get("/success-projects", getSuccessProjects);

module.exports = router;
