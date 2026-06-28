import mongoose from "mongoose";

const startupSchema = new mongoose.Schema(
  {
    startup_name: { type: String, required: true },
    logo: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    funding_stage: { type: String, required: true },
    founder_email: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export const Startup = mongoose.model("Startup", startupSchema);
