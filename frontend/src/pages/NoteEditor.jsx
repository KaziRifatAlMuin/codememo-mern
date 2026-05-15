import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import {
  createNote,
  deleteNote,
  fetchNoteById,
  updateNote,
} from "../api/notesApi.js"
import ActionBar from "../components/ActionBar.jsx"

export default function NoteEditor() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(isEditMode)
  const navigate = useNavigate()
  const titleRef = useRef(null)

  useEffect(() => {
    if (!isEditMode) return

    const loadNote = async () => {
      setLoading(true)
      try {
        const data = await fetchNoteById(id)
        setTitle(data.title)
        setContent(data.content)
      } catch (err) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadNote()
  }, [id, isEditMode])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required")
      return
    }

    try {
      if (isEditMode) {
        await updateNote(id, { title, content })
        toast.success("Note updated")
      } else {
        const created = await createNote({ title, content })
        toast.success("Note created")
        navigate(`/notes/${created.note?._id || created._id || ""}`)
        return
      }
      navigate(`/notes/${id}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async () => {
    if (!isEditMode) {
      toast("Create a note before deleting", { icon: "✍" })
      return
    }

    const confirmed = window.confirm("Delete this note?")
    if (!confirmed) return

    try {
      await deleteNote(id)
      toast.success("Note deleted")
      navigate("/")
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="editor-card skeleton" />
      </div>
    )
  }

  return (
    <div className="page">
      <section className="editor-card">
        <div className="editor-header">
          <div>
            <p className="eyebrow">{isEditMode ? "UPDATE NOTE" : "NEW NOTE"}</p>
            <h2>{isEditMode ? "Refine your thought." : "Start a new idea."}</h2>
          </div>
          <ActionBar
            onEdit={() => titleRef.current?.focus()}
            onDelete={handleDelete}
            editLabel={isEditMode ? "Editing" : "Edit"}
            editDisabled={!isEditMode}
          />
        </div>

        <form className="editor-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Give the note a bold title"
            />
          </label>
          <label>
            Note
            <textarea
              rows="8"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write your note with clarity and detail"
            />
          </label>
          <div className="editor-actions">
            <button type="submit" className="btn primary">
              {isEditMode ? "Save changes" : "Create note"}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
