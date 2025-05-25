const express = require("express");
const { addProfessional, getProfessionals, getProfessionalDetails, createProfessional,searchProfessionals  } = require("../controllers/professionalController");
const router = express.Router();
const parser = require('../middleware/upload'); // Multer + Cloudinary config

router.post("/", addProfessional); // Add a new professional test postman
router.post(
  "/create",
  parser.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "companyRegistration", maxCount: 1 },
    { name: "portfolio", maxCount: 10 },
    { name: "certifications", maxCount: 10 }
  ]),
  createProfessional
);

// Search Route
router.get("/search", searchProfessionals);

router.get("/", getProfessionals); // Get all professionals
router.get("/:id", getProfessionalDetails); // Get  professional by id




module.exports = router;
