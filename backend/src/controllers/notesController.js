const notes = [
    { id: 1, title: "First note", content: "This is the first note." },
    { id: 2, title: "Second note", content: "This is the second note." }
]

export function getAllNotes(req, res) {
    res.status(200).json(notes)
}

export function getNoteById(req, res) {
    const noteId = Number(req.params.id)
    const note = notes.find((item) => item.id === noteId)

    if (!note) {
        return res.status(404).json({ message: "Note not found" })
    }

    res.status(200).json(note)
}

export function createNote(req, res) {
    const { title, content } = req.body

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" })
    }

    const newNote = {
        id: notes.length ? notes[notes.length - 1].id + 1 : 1,
        title,
        content,
    }

    notes.push(newNote)

    res.status(201).json({ message: "Note created successfully!", note: newNote })
}

export function updateNote(req, res) {
    const noteId = Number(req.params.id)
    const note = notes.find((item) => item.id === noteId)

    if (!note) {
        return res.status(404).json({ message: "Note not found" })
    }

    const { title, content } = req.body

    if (title) {
        note.title = title
    }

    if (content) {
        note.content = content
    }

    res.status(200).json({ message: "Note updated successfully!", note })
}

export function deleteNote(req, res) {
    const noteId = Number(req.params.id)
    const noteIndex = notes.findIndex((item) => item.id === noteId)

    if (noteIndex === -1) {
        return res.status(404).json({ message: "Note not found" })
    }

    notes.splice(noteIndex, 1)

    res.status(200).json({ message: "Note deleted successfully!" })
}