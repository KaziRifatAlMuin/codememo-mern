import { Link } from "react-router-dom"
import { Eye, Pencil, Trash2 } from "lucide-react"

export default function NoteCard({ note, onEdit, onDelete, deleting = false }) {
  const snippet = note.content.length > 150 ? `${note.content.slice(0, 150)}...` : note.content
  const date = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(note.createdAt))

  return (
    <article className="card surface-panel h-full rounded-lg transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="card-body gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight">{note.title}</h3>
          <span className="badge badge-ghost shrink-0 text-xs">{date}</span>
        </div>

        <p className="min-h-16 whitespace-pre-wrap text-sm leading-6 text-base-content/70">
          {snippet}
        </p>

        <div className="card-actions items-center justify-between gap-3 pt-2">
          <Link className="btn btn-ghost btn-sm gap-2" to={`/notes/${note._id}`}>
            <Eye size={16} aria-hidden="true" />
            Open
          </Link>
          <div className="join">
            <button type="button" className="btn join-item btn-outline btn-sm" onClick={onEdit}>
              <Pencil size={16} aria-hidden="true" />
              <span className="sr-only">Edit</span>
            </button>
            <button
              type="button"
              className="btn join-item btn-error btn-sm"
              onClick={onDelete}
              disabled={deleting}
            >
              <Trash2 size={16} aria-hidden="true" />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
