import express from "express";
import { Opportunity } from "../models/Opportunity.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/opportunities", verifyToken, async (req, res) => {
  const result = await Opportunity.create(req.body);
  res.send(result);
});

router.get("/opportunities", async (req, res) => {
  const { search, work_type, page = 1, limit = 10 } = req.query;
  let query = {};

  if (search) {
    query.$or = [
      { role_title: { $regex: search, $options: "i" } },
      { required_skills: { $regex: search, $options: "i" } },
    ];
  }

  if (work_type) {
    query.work_type = { $in: work_type.split(",") };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const result = await Opportunity.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("startup_id");

  const total = await Opportunity.countDocuments(query);

  res.send({ result, total, page: parseInt(page), limit: parseInt(limit) });
});

router.get("/opportunities/startup/:id", verifyToken, async (req, res) => {
  const result = await Opportunity.find({ startup_id: req.params.id });
  res.send(result);
});

router.patch("/opportunities/:id", verifyToken, async (req, res) => {
  const result = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(result);
});

router.get("/opportunities/:id", async (req, res) => {
  const result = await Opportunity.findById(req.params.id).populate("startup_id");
  res.send(result);
});

router.delete("/opportunities/:id", verifyToken, async (req, res) => {
  const result = await Opportunity.findByIdAndDelete(req.params.id);
  res.send(result);
});

export default router;
