import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Founder", "Collaborator", "Admin"],
      required: true,
    },
    isBlocked: { type: Boolean, default: false },
    image: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);