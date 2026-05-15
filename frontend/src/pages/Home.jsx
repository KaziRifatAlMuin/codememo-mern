import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FileText, Plus, RefreshCw, Search, Sparkles } from "lucide-react"
import toast from "react-hot-toast"
import { fetchNotes, deleteNote, notesKeys } from "../api/notesApi.js"
import NoteCard from "../components/NoteCard.jsx"

export default function Home() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: notes = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: notesKeys.all,
    queryFn: fetchNotes,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all })
      toast.success("Note deleted")
    },
    onError: (err) => toast.error(err.message),
  })

  const handleDelete = (id) => {
    const confirmed = window.confirm("Delete this note?")
    if (confirmed) deleteMutation.mutate(id)
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 rounded-lg border border-base-300 bg-base-200/70 p-5 md:p-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.5fr)]">
        <div className="max-w-3xl space-y-5">
          <div className="badge badge-primary badge-outline gap-2">
            <Sparkles size={14} aria-hidden="true" />
            MERN Note Studio
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-normal text-base-content md:text-5xl">
              Capture ideas, decisions, and tiny sparks before they wander off.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-base-content/70">
              A clean full-stack notes app with React, Tailwind, DaisyUI, Express, MongoDB,
              and Docker wired together for local development.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-primary gap-2" to="/create">
              <Plus size={18} aria-hidden="true" />
              Create Note
            </Link>
            <button
              type="button"
              className="btn btn-outline gap-2"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="stats stats-vertical rounded-lg border border-base-300 bg-base-100 shadow-sm">
            <div className="stat">
              <div className="stat-figure text-primary">
                <FileText size={28} aria-hidden="true" />
              </div>
              <div className="stat-title">Total Notes</div>
              <div className="stat-value text-primary">{notes.length}</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Search size={28} aria-hidden="true" />
              </div>
              <div className="stat-title">Status</div>
              <div className="stat-value text-2xl text-secondary">
                {isFetching ? "Syncing" : "Ready"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">All Notes</h2>
          <p className="text-base-content/70">Review, update, or remove notes from one place.</p>
        </div>
        <button type="button" className="btn btn-secondary gap-2" onClick={() => navigate("/create")}>
          <Plus size={18} aria-hidden="true" />
          New Note
        </button>
      </section>

      {error ? (
        <div className="alert alert-error rounded-lg">
          <span>{error.message}</span>
          <button type="button" className="btn btn-sm" onClick={() => refetch()}>
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton h-56 rounded-lg" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-base-300 bg-base-200/60 p-10 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4 text-primary">
              <FileText size={34} aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">No notes yet</h3>
              <p className="mt-2 text-base-content/70">Create the first note and it will appear here.</p>
            </div>
            <Link className="btn btn-primary gap-2" to="/create">
              <Plus size={18} aria-hidden="true" />
              Create First Note
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              deleting={deleteMutation.isPending && deleteMutation.variables === note._id}
              onEdit={() => navigate(`/create/${note._id}`)}
              onDelete={() => handleDelete(note._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
