// import express from "express"
const express = require("express")

const app = express()

app.get("/api/notes", (req, res) => {
    // send the notes to the frontend
    res.status(200).send("You got 10 notes!")
})

app.post("/api/notes", (req, res) => {
    // create a new note and send it to the frontend
    res.status(201).json({ message: "Note created successfully!" })
})

app.put("/api/notes/:id", (req, res) => {
    // update a note and send it to the frontend
    res.status(200).json({ message: "Note updated successfully!" })
})

app.delete("/api/notes/:id", (req, res) => {
    // delete a note and send it to the frontend
    res.status(200).json({ message: "Note deleted successfully!" })
})
 
app.listen(5001, () => {
    console.log("Server is running on port 5001")
});