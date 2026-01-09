import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    googleId: {
      type: String
    },
    profilePic: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);


export default mongoose.model("User", userSchema);
// 🔴 SORRY: CHANGE MADE HERE (module.exports → export default)

