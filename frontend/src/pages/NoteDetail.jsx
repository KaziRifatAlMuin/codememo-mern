import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { deleteNote, fetchNoteById } from "../api/notesApi.js"
import ActionBar from "../components/ActionBar.jsx"

export default function NoteDetail() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadNote = async () => {
      setLoading(true)
      try {
        const data = await fetchNoteById(id)
        setNote(data)
      } catch (err) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadNote()
  }, [id])

  const handleDelete = async () => {
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
        <div className="detail-card skeleton" />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3>Note not found</h3>
          <p>That note might have been deleted or moved.</p>
          <Link className="btn primary" to="/">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const createdDate = new Date(note.createdAt).toLocaleString()

  return (
    <div className="page">
      <section className="detail-card">
        <div className="detail-header">
          <div>
            <p className="eyebrow">NOTE DETAIL</p>
            <h2>{note.title}</h2>
            <span className="note-date">Created {createdDate}</span>
          </div>
          <ActionBar
            onEdit={() => navigate(`/create/${note._id}`)}
            onDelete={handleDelete}
          />
        </div>
        <div className="detail-content">
          <p>{note.content}</p>
        </div>
        <div className="detail-footer">
          <Link className="link" to="/">
            Back to all notes
          </Link>
        </div>
      </section>
    </div>
  )
}
