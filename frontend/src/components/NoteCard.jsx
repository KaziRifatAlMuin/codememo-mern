import { Link } from "react-router-dom"
import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react"
import {
  difficultyClass,
  languageLabel,
  normalizeNote,
  platformFromUrl,
  statusClass,
} from "../utils/noteMeta.js"

export default function NoteCard({ note, onEdit, onDelete, deleting = false }) {
  const memo = normalizeNote(note)
  const snippet = memo.content.length > 120 ? `${memo.content.slice(0, 120)}...` : memo.content
  const date = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(note.createdAt))
  const platform = platformFromUrl(memo.problemUrl)

  return (
    <article className="card surface-panel h-full rounded-lg transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="card-body gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight">{memo.title}</h3>
          <span className="badge badge-ghost shrink-0 text-xs">{date}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`badge badge-sm ${difficultyClass[memo.difficulty]}`}>
            {memo.difficulty}
          </span>
          <span className={`badge badge-sm ${statusClass[memo.revisionStatus]}`}>
            {memo.revisionStatus}
          </span>
          <span className="badge badge-sm badge-outline">{languageLabel(memo.language)}</span>
        </div>

        <p className="min-h-14 whitespace-pre-wrap text-sm leading-6 text-base-content/70">
          {snippet}
        </p>

        {memo.codeSnippet ? (
          <div className="rounded-md border border-base-300 bg-base-100 px-3 py-2 font-mono text-xs text-base-content/65">
            {memo.codeSnippet.split("\n")[0].slice(0, 64)}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {memo.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge badge-ghost badge-sm">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-base-300 pt-3 text-xs text-base-content/55">
          <span className="inline-flex min-w-0 items-center gap-1">
            <ExternalLink size={14} aria-hidden="true" />
            <span className="truncate">{platform}</span>
          </span>
          <span>{memo.tags.length} tags</span>
        </div>

        <div className="card-actions items-center justify-between gap-3">
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
