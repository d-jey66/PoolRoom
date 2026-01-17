import User from "../models/user.model.js";
import Reservation from "../models/reservation.model.js";
import Transaction from "../models/transaction.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const allTransactions = await Transaction.find({ status: 'completed' });
    
    const weekRevenue = allTransactions
      .filter(t => new Date(t.transactionDate) >= oneWeekAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthRevenue = allTransactions
      .filter(t => new Date(t.transactionDate) >= oneMonthAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const yearRevenue = allTransactions
      .filter(t => new Date(t.transactionDate) >= oneYearAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalRevenue = allTransactions.reduce((sum, t) => sum + t.amount, 0);

    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ paymentStatus: 'pending' });
    const paidReservations = await Reservation.countDocuments({ paymentStatus: 'paid' });
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });

    const recentReservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'username email');

    res.status(200).json({
      revenue: {
        week: weekRevenue,
        month: monthRevenue,
        year: yearRevenue,
        total: totalRevenue
      },
      counts: {
        totalReservations,
        pendingReservations,
        paidReservations,
        totalUsers,
        adminUsers
      },
      recentReservations
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ message: "Failed to get dashboard stats" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const reservationCount = await Reservation.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          reservationCount
        };
      })
    );

    res.status(200).json({ users: usersWithStats });
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: "User is already an admin" });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({ 
      message: "User promoted to admin successfully",
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    console.error("Error promoting user:", error);
    res.status(500).json({ message: "Failed to promote user" });
  }
};

export const demoteToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === 'user') {
      return res.status(400).json({ message: "User is already a regular user" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot demote yourself" });
    }

    user.role = 'user';
    await user.save();

    res.status(200).json({ 
      message: "User demoted to regular user successfully",
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    console.error("Error demoting user:", error);
    res.status(500).json({ message: "Failed to demote user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Reservation.deleteMany({ userId });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};