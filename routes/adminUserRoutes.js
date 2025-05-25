const express =require( 'express');
const { protect, admin } =require( '../middleware/authMiddleware.js');
const {
  getAllUsers,
  updateUserRole,
  softDeleteUser
} =require( '../controllers/adminUserController.js');

const router = express.Router();

router.get('/',  getAllUsers);
router.put('/:id/role',  updateUserRole);
router.delete('/:id',  softDeleteUser);

module.exports= router;
