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
  revisitedClass,
  statusClass,
  statusRowClass,
} from "../utils/noteMeta.js"

export default function NoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: note, isLoading, error } = useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all })
      toast.success("Memo deleted")
      navigate("/")
    },
    onError: (err) => toast.error(err.message),
  })

  if (isLoading) return <div className="skeleton h-56 rounded-lg" />

  if (error || !note) {
    return (
      <div className="rounded-lg border border-dashed border-white/15 bg-base-200/60 p-8 text-center">
        <h3 className="text-lg font-semibold">Memo not found</h3>
        <p className="mt-2 text-sm text-base-content/70">{error?.message || "That memo might have been deleted."}</p>
        <Link className="btn btn-primary btn-sm mt-4 gap-1.5" to="/">
          <ArrowLeft size={15} aria-hidden="true" />
          Back
        </Link>
      </div>
    )
  }

  const memo = normalizeNote(note)
  const platform = platformFromUrl(memo.problemUrl)
  const createdDate = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(note.createdAt))

  return (
    <section className={`mx-auto w-full max-w-5xl rounded-lg border border-white/10 p-4 ${statusRowClass[memo.revisionStatus]}`}>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className={`badge badge-sm border ${statusClass[memo.revisionStatus]}`}>{memo.revisionStatus}</div>
            <h1 className="mt-2 text-xl font-semibold">{memo.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-base-content/60">
              <span className={`badge badge-sm border ${difficultyClass[memo.difficulty]}`}>{memo.difficulty || "-"}</span>
              <span>Topics: {memo.tags.join(" | ") || "-"}</span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={13} aria-hidden="true" />
                {createdDate}
              </span>
            </div>
          </div>
          <ActionBar
            onEdit={() => navigate(`/create/${note._id}`)}
            onDelete={() => {
              if (window.confirm("Delete this memo?")) deleteMutation.mutate(id)
            }}
            deleteDisabled={deleteMutation.isPending}
          />
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-base-100/55 p-3">
            <p className="text-xs uppercase text-base-content/45">Metacognition</p>
            <p className="mt-2 text-sm text-base-content/75">{memo.metacognition || "-"}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-base-100/55 p-3">
            <p className="text-xs uppercase text-base-content/45">Accepted</p>
            <p className="mt-2 text-sm text-base-content/75">{memo.acceptedDate || "-"}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-base-100/55 p-3">
            <p className="text-xs uppercase text-base-content/45">Revisited</p>
            <p className={`badge badge-sm mt-2 border ${revisitedClass[memo.resolve]}`}>{memo.resolve || "-"}</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <section className="rounded-lg border border-white/10 bg-base-100/55 p-3">
            <h2 className="text-sm font-semibold">Takeaways</h2>
            <div className="mt-2 text-sm">
              <MarkdownPreview content={memo.takeaways || "_No takeaways yet._"} />
            </div>
          </section>
          <section className="rounded-lg border border-white/10 bg-base-100/55 p-3">
            <h2 className="text-sm font-semibold">Analysis</h2>
            <div className="mt-2 text-sm">
              <MarkdownPreview content={memo.analysis || "_No analysis yet._"} />
            </div>
          </section>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          {memo.problemUrl ? (
            <a className="link link-primary inline-flex items-center gap-1" href={memo.problemUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={14} aria-hidden="true" />
              {platform}
            </a>
          ) : null}
          <span className="text-base-content/60">{languageLabel(memo.language)}</span>
        </div>

        {memo.codeSnippet ? (
          <div className="code-window">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-base-content/55">
              <span>{languageLabel(memo.language)}</span>
              <span>snippet</span>
            </div>
            <CodeBlock code={memo.codeSnippet} language={memo.language} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
