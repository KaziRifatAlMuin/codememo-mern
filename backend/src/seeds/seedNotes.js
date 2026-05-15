import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Note from '../models/Note.js'
import Tag from '../models/Tag.js'
import connectDB from '../config/db.js'

dotenv.config()

const seed = async () => {
  try {
    await connectDB()

    const sampleNotes = [
      {
        title: 'Binary Search',
        content: '## Pattern\nUse when the answer space is monotonic.\n\n- Define low/high carefully\n- Keep the invariant visible\n- Test edge cases',
        tags: ['algorithms', 'search'],
        difficulty: 'Easy',
        language: 'cpp',
        codeSnippet: 'int lo = 0, hi = n - 1;\nwhile (lo <= hi) {\n  int mid = lo + (hi - lo) / 2;\n  if (ok(mid)) hi = mid - 1;\n  else lo = mid + 1;\n}',
        problemUrl: 'https://codeforces.com/problemset',
        revisionStatus: 'In Mind',
      },
      {
        title: 'Segment Tree',
        content: 'Range queries with point or range updates. Keep merge logic small and reusable.',
        tags: ['data-structures', 'trees'],
        difficulty: 'Hard',
        language: 'cpp',
        codeSnippet: 'void update(int node, int start, int end, int idx, int val) {\n  if (start == end) tree[node] = val;\n}',
        problemUrl: 'https://atcoder.jp/',
        revisionStatus: 'To Do',
      },
    ]

    await Note.deleteMany({})
    await Tag.deleteMany({})
    await Tag.insertMany([
      { name: 'number-theory' },
      { name: 'combinatorics' },
      { name: 'dp' },
      { name: 'stl' },
      { name: 'trees' },
    ])
    const created = await Note.insertMany(sampleNotes)
    console.log(`Inserted ${created.length} notes`)
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed', err)
    process.exit(1)
  }
}

seed()
