import { Link } from "react-router-dom"

export default function NoteCard({ note, onEdit, onDelete }) {
  const snippet = note.content.length > 140 ? `${note.content.slice(0, 140)}...` : note.content
  const date = new Date(note.createdAt).toLocaleDateString()

  return (
    <article className="note-card">
      <div className="note-card-header">
        <h3>{note.title}</h3>
        <span className="note-date">{date}</span>
      </div>
      <p>{snippet}</p>
      <div className="note-card-footer">
        <Link className="link" to={`/notes/${note._id}`}>
          Open
        </Link>
        <div className="note-actions">
          <button type="button" className="btn ghost" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="btn danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
