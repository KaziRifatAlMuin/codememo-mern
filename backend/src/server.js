import express from "express"
import notesRoutes from "./routes/notesRoutes.js"
import connectDB from "./config/db.js"
import dotenv from "dotenv"

dotenv.config()
const app = express()

app.use(express.json())
app.use("/api/notes", notesRoutes)

app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }))

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
