const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // console.log("Log the URI: " + process.env.MONGODB_URI);
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
