const Project = require('../models/ProjectModel');
const cloudinary = require('../utils/cloudinary');
const Professional = require("../models/Professional");

//🟥 Create new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, tags, professionalId } = req.body;

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    // Upload each image to Cloudinary
    const imageUrls = await Promise.all(
      req.files.map(file => cloudinary.uploader.upload(file.path).then(result => result.secure_url))
    );

    const newProject = new Project({
      professional: professionalId,
      title,
      description,
      category,
      tags: tags.split(',').map(tag => tag.trim()),
      images: imageUrls
    });

    await newProject.save();


    // 🔥 Update the professional's projects array
    await Professional.findByIdAndUpdate(
      professionalId,
      { $push: { projects: newProject._id } },
      { new: true }
    );
    
    res.status(201).json(newProject);
  } catch (err) {
    console.error("Project creation error:", err);
    res.status(500).json({ error: "Server error while creating project" });
  }
};

//🟥 Get all Projects Ideas
exports.getAllProjects = async (req, res) => {
  const { page = 1, category } = req.query; // from query string
  const limit = 12;
  const skip = (page - 1) * limit;

  try {
    const filter = { status: "approved" };
    if (category) {
      filter.category = category;
    }

    const totalProjects = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalProjects / limit);

    const projects = await Project.find(filter)
      .populate("professional", "name") // if needed
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      projects,
      total: totalProjects,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to get projects" });
  }
};

//🟥 Get project by id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'professional',
        populate: {
          path: 'userId',
          select: 'firstname lastname profilePicture'
        },
        select: 'rating userId'
      });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
};

exports.getHomeProjects = async (req, res) => {
  try {
      const projects = await Project.find({ status: "approved" })
          .select("title category images")
          .limit(12)
          .sort({ createdAt: -1 });

      res.status(200).json(projects);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch projects" });
  }
};

exports.getSuccessProjects = async (req, res) => {
  try {
    // Fetch only "Full Constructed House" projects with status "approved"
    const project = await Project.findById('681e1d1c0b838bd7dc7d0e64')
    .populate({
      path: 'professional',
      populate: {
        path: 'userId',
        select: 'firstname lastname profilePicture'
      },
      select: 'rating userId'
    });

    if (!project) {
      return res.status(404).json({ message: "No success projects found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching success projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};