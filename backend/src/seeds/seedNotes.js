import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Note from '../models/Note.js'
import connectDB from '../config/db.js'

dotenv.config()

const seed = async () => {
  try {
    await connectDB()

    const sampleNotes = [
      { title: 'Welcome to Thinkboard', content: 'This is your first note.' },
      { title: 'How to use', content: 'Create, update and delete notes via the API.' },
    ]

    await Note.deleteMany({})
    const created = await Note.insertMany(sampleNotes)
    console.log(`Inserted ${created.length} notes`)
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed', err)
    process.exit(1)
  }
}

seed()
