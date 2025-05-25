// routes/adminRoutes.js
const express = require('express');
const { getDashboardData,
     getFilteredProfessionals ,
    updateStatus,
    getAllBookings,
    getAllProjects,
    updateProjectStatus,
    getBookingGrowth} = require('../controllers/adminController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/dashboard', getDashboardData);
router.get("/analytics/booking-growth", getBookingGrowth);

router.get("/professionals", getFilteredProfessionals);
// PATCH /api/admin/professionals/:id/status
router.patch("/professionals/:id/status", updateStatus);

router.get('/bookings', getAllBookings);

router.get("/projects", getAllProjects);
router.put("/projects/:id/status", updateProjectStatus);
  
  

module.exports= router;
