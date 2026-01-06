import mongoose from "mongoose";
// 🔴 SORRY: CHANGE MADE HERE

console.error("it has arrived in for connecting the database ?");
const connectDB = async () => {
  console.log("IN FUNCTION");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (e) {
    console.error(e);
    console.error("GPT login pe hi fail ho raha h kya ?");
    process.exit(1);
  }
};

export default connectDB;
// 🔴 SORRY: CHANGE MADE HERE

