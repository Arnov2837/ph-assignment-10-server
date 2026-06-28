import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/users", async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  const existingUser = await User.findOne(query);

  if (existingUser) {
    return res.send({ message: "user already exists", insertedId: null });
  }

  const result = await User.create(user);
  res.send(result);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found! Please register first." });
    }

    if (user.password !== password) {
      return res.status(401).send({ message: "Incorrect password!" });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .send({
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .send({ message: "Logged out successfully" });
});

router.get("/users", verifyToken, async (req, res) => {
  const result = await User.find();
  res.send(result);
});

router.get("/users/role/:email", async (req, res) => {
  const email = req.params.email;
  const result = await User.findOne({ email });
  res.send({ role: result?.role });
});

router.patch("/users/block/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const { isBlocked } = req.body;
  const result = await User.findByIdAndUpdate(id, { isBlocked }, { new: true });
  res.send(result);
});

router.get("/users/profile/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  const result = await User.findOne({ email }).select("-password");
  res.send(result);
});

router.patch("/users/profile/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  const { name, image, bio, skills } = req.body;
  const result = await User.findOneAndUpdate(
    { email },
    { name, image, bio, skills },
    { new: true },
  );
  res.send(result);
});

export default router;
