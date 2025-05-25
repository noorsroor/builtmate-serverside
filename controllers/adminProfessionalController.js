const Professional = require('../models/Professional');
const User = require('../models/UserModel');

exports.getProfessionals = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status, sort = "desc" } = req.query;
    const query = {};

    if (search) {
      query.profession = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const professionals = await Professional.find(query)
      .populate('userId', 'firstname lastname email')
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Professional.countDocuments(query);

    res.status(200).json({ data: professionals, total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching professionals', error: err });
  }
};

exports.updateProfessionalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const pro = await Professional.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (status === 'approved') {
      await User.findByIdAndUpdate(pro.userId, { role: 'pro', professionalId: pro._id });
    }

    res.status(200).json(pro);
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err });
  }
};

exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    const updated = await Professional.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );

    if (status === 'approved') {
      const professionals = await Professional.find({ _id: { $in: ids } });
      for (let pro of professionals) {
        await User.findByIdAndUpdate(pro.userId, { role: 'pro', professionalId: pro._id });
      }
    }

    res.status(200).json({ message: 'Updated successfully', updated });
  } catch (err) {
    res.status(500).json({ message: 'Bulk update failed', error: err });
  }
};

exports.getProfessionalDetails = async (req, res) => {
  try {
    const pro = await Professional.findById(req.params.id).populate('userId');
    res.status(200).json(pro);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pro details', error: err });
  }
};
