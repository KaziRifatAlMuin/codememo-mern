import { Link, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, CalendarDays, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"
import { deleteNote, fetchNoteById, notesKeys } from "../api/notesApi.js"
import ActionBar from "../components/ActionBar.jsx"
import CodeBlock from "../components/CodeBlock.jsx"
import MarkdownPreview from "../components/MarkdownPreview.jsx"
import {
  difficultyClass,
  languageLabel,
  normalizeNote,
  platformFromUrl,
  statusClass,
} from "../utils/noteMeta.js"

export default function NoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all })
      toast.success("Note deleted")
      navigate("/")
    },
    onError: (err) => toast.error(err.message),
  })

  const handleDelete = () => {
    const confirmed = window.confirm("Delete this note?")
    if (confirmed) deleteMutation.mutate(id)
  }

  if (isLoading) {
    return <div className="skeleton h-72 rounded-lg" />
  }

  if (error || !note) {
    return (
      <div className="rounded-lg border border-dashed border-base-300 bg-base-200/60 p-10 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4">
          <h3 className="text-xl font-semibold">Note not found</h3>
          <p className="text-base-content/70">
            {error?.message || "That note might have been deleted or moved."}
          </p>
          <Link className="btn btn-primary gap-2" to="/">
            <ArrowLeft size={18} aria-hidden="true" />
            Back Home
          </Link>
        </div>
      </div>
    )
  }

  const createdDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(note.createdAt))
  const memo = normalizeNote(note)
  const platform = platformFromUrl(memo.problemUrl)

  return (
    <section className="surface-panel mx-auto w-full max-w-5xl rounded-lg">
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-3">
            <div className="badge badge-secondary badge-outline">CodeMemo Detail</div>
            <h1 className="text-2xl font-bold sm:text-3xl">{memo.title}</h1>
            <div className="flex flex-wrap gap-2">
              <span className={`badge ${difficultyClass[memo.difficulty]}`}>{memo.difficulty}</span>
              <span className={`badge ${statusClass[memo.revisionStatus]}`}>
                {memo.revisionStatus}
              </span>
              <span className="badge badge-outline">{languageLabel(memo.language)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <CalendarDays size={16} aria-hidden="true" />
              Created {createdDate}
            </div>
          </div>
          <ActionBar
            onEdit={() => navigate(`/create/${note._id}`)}
            onDelete={handleDelete}
            deleteDisabled={deleteMutation.isPending}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="rounded-lg border border-base-300 bg-base-100/70 p-4 sm:p-5">
            <MarkdownPreview content={memo.content} />
          </div>

          <aside className="grid content-start gap-3 rounded-lg border border-base-300 bg-base-100/70 p-4">
            <div>
              <p className="text-xs uppercase text-base-content/45">Problem</p>
              {memo.problemUrl ? (
                <a
                  className="link link-primary inline-flex max-w-full items-center gap-1 truncate text-sm font-medium"
                  href={memo.problemUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  {platform}
                </a>
              ) : (
                <p className="text-sm text-base-content/60">No link attached</p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase text-base-content/45">Tags</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {memo.tags.length ? (
                  memo.tags.map((tag) => (
                    <span key={tag} className="badge badge-ghost badge-sm">
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-base-content/60">No tags</span>
                )}
              </div>
            </div>
          </aside>
        </div>

        {memo.codeSnippet ? (
          <div className="code-window">
            <div className="flex items-center justify-between border-b border-base-300 px-4 py-2 text-xs text-base-content/55">
              <span>{languageLabel(memo.language)}</span>
              <span>syntax highlighted snippet</span>
            </div>
            <CodeBlock code={memo.codeSnippet} language={memo.language} />
          </div>
        ) : null}

        <div>
          <Link className="btn btn-ghost btn-sm gap-2" to="/">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to All Notes
          </Link>
        </div>
      </div>
    </section>
  )
}
