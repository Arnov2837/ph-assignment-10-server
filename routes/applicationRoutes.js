import express from "express";
import { Application } from "../models/Application.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/applications", async (req, res) => {
  const result = await Application.create(req.body);
  res.send(result);
});

router.get(
  "/applications/collaborator/:email",
  verifyToken,
  async (req, res) => {
    const result = await Application.find({
      applicant_email: req.params.email,
    }).populate("opportunity_id");
    res.send(result);
  },
);

router.get("/applications/opportunity/:id", verifyToken, async (req, res) => {
  const result = await Application.find({ opportunity_id: req.params.id });
  res.send(result);
});

router.patch("/applications/status/:id", verifyToken, async (req, res) => {
  const { status } = req.body;
  const result = await Application.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  res.send(result);
});

export default router;
