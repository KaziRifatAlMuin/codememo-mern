import mongoose from "mongoose"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/thinkboard-db"
  const maxAttempts = Number(process.env.MONGO_CONNECT_ATTEMPTS || 10)

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await mongoose.connect(mongoUri, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      })
      console.log("MongoDB connected")
      break
    } catch (err) {
      const isFinalAttempt = attempt === maxAttempts
      console.error(`MongoDB connection attempt ${attempt} failed:`, err.message || err)

      if (isFinalAttempt) {
        throw new Error("Could not connect to MongoDB after several attempts")
      }

      const delay = Math.min(1000 * attempt, 5000)
      console.log(`Retrying MongoDB connection in ${delay}ms...`)
      await sleep(delay)
    }
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected")
  })

  const gracefulExit = async () => {
    await mongoose.connection.close()
    console.log("MongoDB connection closed")
    process.exit(0)
  }

  process.once("SIGINT", gracefulExit)
  process.once("SIGTERM", gracefulExit)
}

export default connectDB
