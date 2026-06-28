import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    role_title: { type: String, required: true },
    required_skills: { type: [String], required: true },
    work_type: { type: String, required: true },
    commitment_level: { type: String, required: true },
    deadline: { type: Date, required: true },
    location: { type: String, required: false }, 
  },
  { timestamps: true },
);
export const Opportunity = mongoose.model("Opportunity", opportunitySchema);
