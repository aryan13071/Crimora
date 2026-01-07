import mongoose from "mongoose";

const crimeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    type: String,
    details: String,
    location: String,
    intensity: String,
  },
  { timestamps: true }
);

export default mongoose.model("Crime", crimeSchema);
