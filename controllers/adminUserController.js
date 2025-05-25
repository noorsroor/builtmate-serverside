const User =require( "../models/UserModel.js");
// Get all users (excluding deleted ones)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();
    res.json({ message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Soft delete user
exports.softDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = true;
    await user.save();
    res.json({ message: 'User soft deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
