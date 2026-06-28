import express from "express";
import { User } from "../models/User.js";
import { Startup } from "../models/Startup.js";
import { Opportunity } from "../models/Opportunity.js";
import { Application } from "../models/Application.js";
import { Payment } from "../models/Payment.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/dashboard/stats/founder", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user?.email;

    const startup = await Startup.findOne({ founder_email: userEmail });
    
    if (!startup) {
      return res.send({
        totalOpportunities: 0,
        totalApplications: 0,
        acceptedMembers: 0
      });
    }

    const totalOpportunities = await Opportunity.countDocuments({ startup_id: startup._id });

    const opportunities = await Opportunity.find({ startup_id: startup._id });
    const oppIds = opportunities.map(opp => opp._id);

    const totalApplications = await Application.countDocuments({ opportunity_id: { $in: oppIds } });

    const acceptedMembers = await Application.countDocuments({ 
      opportunity_id: { $in: oppIds },
      status: "Accepted"
    });

    res.send({ totalOpportunities, totalApplications, acceptedMembers });

  } catch (error) {
    res.status(500).send({ message: "Failed to fetch founder stats" });
  }
});

router.get("/dashboard/stats/collaborator", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user?.email;

    const totalApplied = await Application.countDocuments({ applicant_email: userEmail });
    const accepted = await Application.countDocuments({ applicant_email: userEmail, status: "Accepted" });
    const pending = await Application.countDocuments({ applicant_email: userEmail, status: "Pending" });
    const rejected = await Application.countDocuments({ applicant_email: userEmail, status: "Rejected" });

    res.send({ totalApplied, accepted, pending, rejected });

  } catch (error) {
    res.status(500).send({ message: "Failed to fetch collaborator stats" });
  }
});

router.get("/dashboard/stats/admin", verifyToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStartups = await Startup.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();

    const revenueResult = await Payment.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      totalUsers,
      totalStartups,
      totalOpportunities,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;