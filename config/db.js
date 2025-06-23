const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://himalayfan:j8YM0uQcPCx7gJRd@cluster0.bxqj3m0.mongodb.net/Himalay?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
