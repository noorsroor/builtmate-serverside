const express = require('express');
const router = express.Router();
const {
  getProfessionals,
  updateProfessionalStatus,
  bulkUpdateStatus,
  getProfessionalDetails
} = require('../controllers/adminProfessionalController')

// GET with filtering, sorting, pagination
router.get('/', getProfessionals);

// GET single pro details
router.get('/:id', getProfessionalDetails);

// PUT status change
router.put('/:id/status', updateProfessionalStatus);

// POST bulk approve/reject
router.post('/bulk-update', bulkUpdateStatus);

module.exports = router;
