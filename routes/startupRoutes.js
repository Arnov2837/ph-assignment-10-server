import express from "express";
import { Startup } from "../models/Startup.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/startups", verifyToken, async (req, res) => {
  const result = await Startup.create(req.body);
  res.send(result);
});

router.get("/startups", async (req, res) => {
  const result = await Startup.find();
  res.send(result);
});

router.get("/startups/founder/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  const result = await Startup.find({ founder_email: email });
  res.send(result);
});

router.patch("/startups/status/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const result = await Startup.findByIdAndUpdate(id, { status }, { new: true });
  res.send(result);
});

router.delete("/startups/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const result = await Startup.findByIdAndDelete(id);
  res.send(result);
});


router.get("/startups/:id", async (req, res) => {
  try {
    const result = await Startup.findById(req.params.id);
    if (!result) {
      return res.status(404).send({ message: "Startup not found" });
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

export default router;
