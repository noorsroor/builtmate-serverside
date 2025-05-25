const Bookmark =require("../models/Bookmark.js");
const Pro  =require("../models/Professional.js");
const Project =require("../models/ProjectModel.js");

// /**🟥
//  * @desc Get user bookmarks
//  * @route GET /api/bookmarks
//  * @access Private
//  */
// exports.getUserBookmarks = async (req, res) => {
//   try {
//     const bookmarks = await Bookmark.findOne({ userId: req.user.id })
//       .populate("pros", "name profileImage category") // Populate pro details
//       .populate("projects", "title image tags"); // Populate project details

//     if (!bookmarks) {
//       return res.status(200).json({ pros: [], projects: [] }); // Return empty if no bookmarks
//     }

//     res.status(200).json(bookmarks);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching bookmarks" });
//   }
// };

// /**🟥
//  * @desc Add a professional to bookmarks
//  * @route POST /api/bookmarks/pro/:proId
//  * @access Private
//  */
// exports.savePro = async (req, res) => {
//   try {
//     const { proId } = req.params;
//     const userId = req.user.id;

//     const proExists = await Pro.findById(proId);
//     if (!proExists) return res.status(404).json({ message: "Professional not found" });

//     let bookmark = await Bookmark.findOne({ userId });

//     if (!bookmark) {
//       bookmark = new Bookmark({ userId, pros: [proId] });
//     } else {
//       if (bookmark.pros.includes(proId)) return res.status(400).json({ message: "Already bookmarked" });
//       bookmark.pros.push(proId);
//     }

//     await bookmark.save();
//     res.status(200).json({ message: "Professional bookmarked successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error saving professional" });
//   }
// };

// /**🟥
//  * @desc Remove a professional from bookmarks
//  * @route DELETE /api/bookmarks/pro/:proId
//  * @access Private
//  */
// exports.removePro = async (req, res) => {
//   try {
//     const { proId } = req.params;
//     const userId = req.user.id;

//     const bookmark = await Bookmark.findOne({ userId });
//     if (!bookmark) return res.status(404).json({ message: "No bookmarks found" });

//     bookmark.pros = bookmark.pros.filter(id => id.toString() !== proId);
//     await bookmark.save();

//     res.status(200).json({ message: "Professional removed from bookmarks" });
//   } catch (error) {
//     res.status(500).json({ message: "Error removing professional" });
//   }
// };

// /**🟥
//  * @desc Add a project (idea) to bookmarks
//  * @route POST /api/bookmarks/project/:projectId
//  * @access Private
//  */
// exports.saveProject = async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const userId = req.user.id;

//     const projectExists = await Project.findById(projectId);
//     if (!projectExists) return res.status(404).json({ message: "Project not found" });

//     let bookmark = await Bookmark.findOne({ userId });

//     if (!bookmark) {
//       bookmark = new Bookmark({ userId, projects: [projectId] });
//     } else {
//       if (bookmark.projects.includes(projectId)) return res.status(400).json({ message: "Already bookmarked" });
//       bookmark.projects.push(projectId);
//     }

//     await bookmark.save();
//     res.status(200).json({ message: "Project bookmarked successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error saving project" });
//   }
// };

// /**🟥
//  * @desc Remove a project (idea) from bookmarks
//  * @route DELETE /api/bookmarks/project/:projectId
//  * @access Private
//  */
// exports.removeProject = async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const userId = req.user.id;

//     const bookmark = await Bookmark.findOne({ userId });
//     if (!bookmark) return res.status(404).json({ message: "No bookmarks found" });

//     bookmark.projects = bookmark.projects.filter(id => id.toString() !== projectId);
//     await bookmark.save();

//     res.status(200).json({ message: "Project removed from bookmarks" });
//   } catch (error) {
//     res.status(500).json({ message: "Error removing project" });
//   }
// };

// const Bookmark = require("../models/Bookmark");

// // ✅ Add a professional to bookmarks
// exports.addProfessionalToBookmarks = async (req, res) => {
//     try {
//         const { proId } = req.body;
//         const userId = req.user.id; // Extract user ID from auth middleware

//         let bookmark = await Bookmark.findOne({ user: userId });

//         if (!bookmark) {
//             bookmark = new Bookmark({ user: userId, professionals: [], projects: [] });
//         }

//         if (!bookmark.professionals.includes(proId)) {
//             bookmark.professionals.push(proId);
//             await bookmark.save();
//             return res.status(200).json({ message: "Professional bookmarked successfully" });
//         }

//         res.status(400).json({ message: "Professional already bookmarked" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to add professional to bookmarks", error: error.message });
//     }
// };

// // ✅ Remove a professional from bookmarks
// exports.removeProfessionalFromBookmarks = async (req, res) => {
//     try {
//         const { proId } = req.body;
//         const userId = req.user.id;

//         const bookmark = await Bookmark.findOne({ user: userId });

//         if (!bookmark) {
//             return res.status(404).json({ message: "No bookmarks found" });
//         }

//         bookmark.professionals = bookmark.professionals.filter(id => id.toString() !== proId);
//         await bookmark.save();

//         res.status(200).json({ message: "Professional removed from bookmarks" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to remove professional", error: error.message });
//     }
// };

// // ✅ Add a project to bookmarks
// exports.addProjectToBookmarks = async (req, res) => {
//     try {
//         const { projectId } = req.body;
//         const userId = req.user.id;

//         let bookmark = await Bookmark.findOne({ user: userId });

//         if (!bookmark) {
//             bookmark = new Bookmark({ user: userId, professionals: [], projects: [] });
//         }

//         if (!bookmark.projects.includes(projectId)) {
//             bookmark.projects.push(projectId);
//             await bookmark.save();
//             return res.status(200).json({ message: "Project bookmarked successfully" });
//         }

//         res.status(400).json({ message: "Project already bookmarked" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to add project to bookmarks", error: error.message });
//     }
// };

// // ✅ Remove a project from bookmarks
// exports.removeProjectFromBookmarks = async (req, res) => {
//     try {
//         const { projectId } = req.body;
//         const userId = req.user.id;

//         const bookmark = await Bookmark.findOne({ user: userId });

//         if (!bookmark) {
//             return res.status(404).json({ message: "No bookmarks found" });
//         }

//         bookmark.projects = bookmark.projects.filter(id => id.toString() !== projectId);
//         await bookmark.save();

//         res.status(200).json({ message: "Project removed from bookmarks" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to remove project", error: error.message });
//     }
// };

// // ✅ Get all bookmarked professionals and projects for a user
// exports.getBookmarks = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const bookmarks = await Bookmark.findOne({ user: userId })
//             .populate("professionals", "name profileImage") // Populate professional details
//             .populate("projects", "title image"); // Populate project details

//         if (!bookmarks) {
//             return res.status(404).json({ message: "No bookmarks found" });
//         }

//         res.status(200).json({ bookmarks });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to retrieve bookmarks", error: error.message });
//     }
// };

// controllers/bookmarkController.js
// const Bookmark = require("../models/Bookmark");

//🟥ADD /Remove user project/pro bookmarks
const toggleBookmark = async (req, res) => {
    const { userId, itemId, type } = req.body;
  
    if (!["professional", "project"].includes(type)) {
      return res.status(400).json({ error: "Invalid bookmark type." });
    }
  
    try {
      let bookmark = await Bookmark.findOne({ user: userId });
  
      if (!bookmark) {
        bookmark = await Bookmark.create({ user: userId });
      }
  
      const list = type === "professional" ? bookmark.professionals : bookmark.projects;
      const index = list.indexOf(itemId);
  
      if (index === -1) {
        list.push(itemId); // Add
      } else {
        list.splice(index, 1); // Remove
      }
  
      await bookmark.save();
      res.status(200).json({ message: "Bookmark toggled", bookmark });
    } catch (err) {
      console.error("Toggle Bookmark Error:", err);
      res.status(500).json({ error: "Failed to toggle bookmark" });
    }
  };

//🟥 Get User Project/pro bookmarks
  const getUserBookmarks = async (req, res) => {
    try {
      const { userId } = req.params;
      const bookmarks = await Bookmark.findOne({ user: userId });
      if (!bookmarks) return res.json({ professionals: [], projects: [] });
  
      res.json(bookmarks);
    } catch (error) {
      console.error("Fetch bookmarks error:", error);
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  };

module.exports = { toggleBookmark ,getUserBookmarks};
