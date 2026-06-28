import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    applicant_email: { type: String, required: true },
    portfolio_link: { type: String, required: true },
    motivation: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    applied_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Application = mongoose.model("Application", applicationSchema);
