import mongoose from "mongoose";
import "dotenv/config";

const connectDb = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || "err";

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected.");

    mongoose.connection.on("error", (err) => {
      console.log("MongoDB connection error: ", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected.");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
    process.exit(1);
  }
};

export default connectDb;
