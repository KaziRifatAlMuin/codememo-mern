import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import notesRoutes from "./routes/notesRoutes.js"
import tagsRoutes from "./routes/tagsRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import usersRoutes from "./routes/usersRoutes.js"
import connectDB from "./config/db.js"
import dotenv from "dotenv"

dotenv.config()
const app = express()
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(cors({ origin: corsOrigins }))
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/notes", notesRoutes)
app.use("/api/tags", tagsRoutes)
app.use("/api/users", usersRoutes)

app.get("/api/health", (req, res) => {
    const dbConnected = mongoose.connection.readyState === 1
    res.status(dbConnected ? 200 : 503).json({
        status: dbConnected ? "ok" : "degraded",
        database: dbConnected ? "connected" : "disconnected",
    })
})

const startServer = async () => {
    try {
        await connectDB()
        const PORT = process.env.PORT || 5001
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error("Failed to start server:", err)
        process.exit(1)
    }
}

process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection:", err)
})

startServer()
