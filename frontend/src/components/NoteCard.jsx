import { Link } from "react-router-dom"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { difficultyClass, normalizeNote, statusClass, statusRowClass } from "../utils/noteMeta.js"

export default function NoteCard({ note, onEdit, onDelete, deleting = false }) {
  const memo = normalizeNote(note)

  return (
    <article className={`rounded-lg border border-white/10 p-3 ${statusRowClass[memo.revisionStatus]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{memo.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-base-content/60">
            <span className={`badge badge-xs border ${difficultyClass[memo.difficulty]}`}>{memo.difficulty || "-"}</span>
            <span>{memo.tags.join(" | ") || "No topics"}</span>
          </div>
        </div>
        <span className={`badge badge-sm shrink-0 border ${statusClass[memo.revisionStatus]}`}>
          {memo.revisionStatus}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-base-content/65">{memo.takeaways || memo.analysis || "-"}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Link className="btn btn-ghost btn-xs gap-1" to={`/notes/${note._id}`}>
          <Eye size={13} aria-hidden="true" />
          Open
        </Link>
        <div className="flex gap-1">
          <button type="button" className="btn btn-ghost btn-xs" onClick={onEdit}>
            <Pencil size={13} aria-hidden="true" />
          </button>
          <button type="button" className="btn btn-ghost btn-xs text-error" onClick={onDelete} disabled={deleting}>
            <Trash2 size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
