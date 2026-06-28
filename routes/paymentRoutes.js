import express from "express";
import Stripe from "stripe";
import { Payment } from "../models/Payment.js";
import { verifyToken } from "../middleware/verifyToken.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/create-payment-intent", verifyToken, async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount * 100),
    currency: "usd",
    payment_method_types: ["card"],
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

router.post("/payments", verifyToken, async (req, res) => {
  const result = await Payment.create(req.body);
  res.send(result);
});

router.get("/payments", verifyToken, async (req, res) => {
  const result = await Payment.find();
  res.send(result);
});

export default router;
