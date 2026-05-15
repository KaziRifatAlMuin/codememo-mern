import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { fetchNotes, deleteNote } from "../api/notesApi.js"
import NoteCard from "../components/NoteCard.jsx"

export default function Home() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadNotes = async () => {
    setLoading(true)
    try {
      const data = await fetchNotes()
      setNotes(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this note?")
    if (!confirmed) return

    try {
      await deleteNote(id)
      setNotes((prev) => prev.filter((note) => note._id !== id))
      toast.success("Note deleted")
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">MERN NOTE STUDIO</p>
          <h1>Capture ideas that refuse to wait.</h1>
          <p className="subtitle">
            Thinkboard is a frictionless space for notes, sketches, and daily
            clarity. Create, edit, and keep everything synced.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/create">
              Create a note
            </Link>
            <button type="button" className="btn ghost" onClick={loadNotes}>
              Refresh
            </button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="stat-card">
            <span>Total notes</span>
            <strong>{notes.length}</strong>
          </div>
          <div className="stat-card">
            <span>Status</span>
            <strong>{loading ? "Syncing" : "Ready"}</strong>
          </div>
          <div className="stat-card">
            <span>Workspace</span>
            <strong>Thinkboard</strong>
          </div>
        </div>
      </section>

      <section className="section-header">
        <div>
          <h2>All notes</h2>
          <p>Every thought, polished and searchable.</p>
        </div>
        <button
          type="button"
          className="btn secondary"
          onClick={() => navigate("/create")}
        >
          New note
        </button>
      </section>

      {loading ? (
        <div className="grid loading">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="note-card skeleton" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <h3>No notes yet.</h3>
          <p>Start with your first idea and build from there.</p>
          <Link className="btn primary" to="/create">
            Create your first note
          </Link>
        </div>
      ) : (
        <div className="grid">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => navigate(`/create/${note._id}`)}
              onDelete={() => handleDelete(note._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
