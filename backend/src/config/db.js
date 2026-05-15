import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/thinkboard-db";
  let attempts = 0;

  const connectWithRetry = async () => {
    try {
      attempts += 1;
      await mongoose.connect(mongoUri, {
        // use the new URL parser and unified topology are defaults in mongoose v6+
        // keep options here for clarity and future tweaks
        family: 4,
      });
      console.log("MongoDB connected");
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempts} failed:`, err.message || err);
      if (attempts < 5) {
        const delay = 2000 * attempts;
        console.log(`Retrying in ${delay}ms...`);
        setTimeout(connectWithRetry, delay);
      } else {
        console.error("Could not connect to MongoDB after several attempts. Exiting.");
        process.exit(1);
      }
    }
  };

  await connectWithRetry();

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  // Graceful shutdown
  const gracefulExit = () => {
    mongoose.connection.close(() => {
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  };

  process.on("SIGINT", gracefulExit);
  process.on("SIGTERM", gracefulExit);
};

export default connectDB;