const User =require( "../models/userModel.js");
const Professional =require( "../models/Professional.js");
const Booking =require( "../models/BookingModel.js");
const Project =require( "../models/ProjectModel.js");

exports.getDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPros = await Professional.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalIdeas = await Project.countDocuments();

    // Example: Generate user registration chart data
    const now = new Date();
    const months = [];
    const userCounts = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const count = await User.countDocuments({
        createdAt: { $gte: start, $lt: end },
      });

      months.push(start.toLocaleString("default", { month: "short" }));
      userCounts.push(count);
    }

    res.json({
      stats: { totalUsers, totalPros, totalBookings, totalIdeas },
      chartData: { months, userCounts },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookingGrowth = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = new Date().getFullYear();
    const selectedYear = year ? parseInt(year) : currentYear;

    const monthlyGrowth = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${selectedYear}-01-01T00:00:00Z`),
            $lt: new Date(`${selectedYear + 1}-01-01T00:00:00Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalBookings: { $sum: 1 },
          totalEarnings: { $sum: "$payment.adminCommission" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    // Fill in missing months with 0 values for smoother graph display
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const data = monthlyGrowth.find((item) => item._id === month);
      return {
        month,
        totalBookings: data ? data.totalBookings : 0,
        totalEarnings: data ? data.totalEarnings || 0 : 0,
      };
    });

    res.status(200).json({ monthlyData });
  } catch (error) {
    console.error("Error fetching booking growth:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// controllers/adminController.js

exports.getFilteredProfessionals = async (req, res) => {
  try {
    const { search = "", status = "all", sort = "desc" } = req.query;

    const query = {};

    // If filtering by status
    if (status !== "all") {
      query.status = status;
    }

    // If searching by name or professional type
    if (search.trim() !== "") {
      query.$or = [
        { professionalType: { $regex: search, $options: "i" } },
        {
          // assuming the professional has populated userId
        },
      ];
    }

    // Build aggregation with user name filtering
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: "$userId",
      },
      {
        $match: {
          ...query,
          ...(search.trim()
            ? {
                $or: [
                  { "userId.firstname": { $regex: search, $options: "i" } },
                  { "userId.lastname": { $regex: search, $options: "i" } },
                  { professionalType: { $regex: search, $options: "i" } },
                ],
              }
            : {}),
        },
      },
      {
        $sort: {
          createdAt: sort === "asc" ? 1 : -1,
        },
      },
    ];

    const professionals = await Professional.aggregate(pipeline);

    res.status(200).json({ professionals });
  } catch (error) {
    console.error("Error fetching professionals:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updateStatus = async (req, res) => {
        try {
          const { id } = req.params;
          const { status } = req.body;
          const role= "user"
      
          if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value." });
          }
      
          const professional = await Professional.findByIdAndUpdate(
            id,
            { status },
            { new: true }
          );

          if (!professional) {
            return res.status(404).json({ error: "Professional not found." });
          }

          if (status === "approved") {
            await User.findByIdAndUpdate(professional.userId, { role: "pro" });
          }else {
            await User.findByIdAndUpdate(professional.userId, { role: "user" });
          }
      
          res.json({ message: "Status updated successfully.", professional });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error." });
        }

};


exports.getAllBookings = async (req, res) => {
  try {
    const { search = "", status = "all", sort = "desc" } = req.query;

    const query = {
      ...(status !== "all" && { status })
    };

    const bookings = await Booking.find(query)
      .populate("user", "firstname lastname")
      .populate({
        path: "professional",
        populate: { path: "userId", select: "firstname lastname" }
      })
      .sort({ createdAt: sort === "asc" ? 1 : -1 });

    const filtered = bookings.filter(b =>
      b.user?.firstname?.toLowerCase().includes(search.toLowerCase()) ||
      b.professional?.userId?.firstname?.toLowerCase().includes(search.toLowerCase())
    );

    res.json({ bookings: filtered });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};



// GET all projects with filters
exports.getAllProjects = async (req, res) => {
  try {
    const { search = "", status = "all", sort = "desc" } = req.query;

    const query = {
      ...(status !== "all" && { status })
    };

    let projects = await Project.find(query)
      .populate({
        path: "professional",
        populate: {
          path: "userId",
          select: "firstname lastname"
        }
      })
      .sort({ createdAt: sort === "asc" ? 1 : -1 });

    if (search) {
      projects = projects.filter((p) =>
        p.professional?.userId?.firstname?.toLowerCase().includes(search.toLowerCase()) ||
        p.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({ projects });
  } catch (err) {
    console.error("Error fetching projects", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// PUT to update status
exports.updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await Project.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, updated });
  } catch (err) {
    console.error("Error updating status", err);
    res.status(500).json({ error: "Failed to update project status" });
  }
};
