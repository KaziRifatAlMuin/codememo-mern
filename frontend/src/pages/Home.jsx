import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Braces, FileText, Filter, Plus, RefreshCw, Search } from "lucide-react"
import toast from "react-hot-toast"
import { fetchNotes, deleteNote, notesKeys } from "../api/notesApi.js"
import NoteCard from "../components/NoteCard.jsx"
import { DIFFICULTIES, REVISION_STATUSES, normalizeNote, platformFromUrl } from "../utils/noteMeta.js"

export default function Home() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [difficulty, setDifficulty] = useState("All")
  const [revisionStatus, setRevisionStatus] = useState("All")

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 260)
    return () => window.clearTimeout(timeout)
  }, [search])

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

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const memo = normalizeNote(note)
      const platform = platformFromUrl(memo.problemUrl).toLowerCase()
      const haystack = [
        memo.title,
        memo.content,
        memo.codeSnippet,
        memo.difficulty,
        memo.revisionStatus,
        platform,
        ...memo.tags,
      ]
        .join(" ")
        .toLowerCase()

      const matchesSearch = !debouncedSearch || haystack.includes(debouncedSearch)
      const matchesDifficulty = difficulty === "All" || memo.difficulty === difficulty
      const matchesStatus = revisionStatus === "All" || memo.revisionStatus === revisionStatus

      return matchesSearch && matchesDifficulty && matchesStatus
    })
  }, [debouncedSearch, difficulty, notes, revisionStatus])

  const masteredCount = notes.filter((note) => normalizeNote(note).revisionStatus === "Mastered").length

  return (
    <div className="flex flex-col gap-7">
      <section className="grid gap-5 rounded-lg border border-base-300 bg-base-200/80 p-4 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(250px,0.75fr)]">
        <div className="max-w-2xl space-y-5">
          <div className="badge badge-primary badge-outline gap-2">
            <Braces size={14} aria-hidden="true" />
            Notes for problem solvers
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-normal text-base-content sm:text-4xl">
              Organize algorithms, snippets, and learning notes in one place.
            </h1>
            <p className="max-w-xl text-sm leading-6 text-base-content/70 sm:text-base">
              CodeMemo is a compact MERN workspace for markdown notes, code snippets,
              problem links, tags, and revision tracking.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-primary btn-sm gap-2 sm:btn-md" to="/create">
              <Plus size={18} aria-hidden="true" />
              Create Memo
            </Link>
            <button
              type="button"
              className="btn btn-outline btn-sm gap-2 sm:btn-md"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="stats stats-vertical rounded-lg border border-base-300 bg-base-100 shadow-sm sm:stats-horizontal sm:col-span-3 lg:stats-vertical lg:col-span-1">
            <div className="stat">
              <div className="stat-figure text-primary">
                <FileText size={28} aria-hidden="true" />
              </div>
              <div className="stat-title">Memos</div>
              <div className="stat-value text-primary">{notes.length}</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Search size={28} aria-hidden="true" />
              </div>
              <div className="stat-title">Mastered</div>
              <div className="stat-value text-2xl text-secondary">
                {isFetching ? "Syncing" : masteredCount}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-base-300 bg-base-200/70 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="badge badge-ghost gap-2">
              <Filter size={14} aria-hidden="true" />
              Debounced Search
            </div>
            <h2 className="mt-2 text-2xl font-bold">Dashboard</h2>
            <p className="text-sm text-base-content/70">
              Search tags, keywords, platforms, difficulty, and revision status.
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm gap-2" onClick={() => navigate("/create")}>
            <Plus size={18} aria-hidden="true" />
            New Memo
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
          <label className="input input-bordered flex items-center gap-2 bg-base-100">
            <Search size={18} className="text-base-content/45" aria-hidden="true" />
            <input
              type="search"
              className="grow"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search binary search, Codeforces, dp..."
            />
          </label>
          <select
            className="select select-bordered bg-base-100"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            aria-label="Filter by difficulty"
          >
            <option>All</option>
            {DIFFICULTIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            className="select select-bordered bg-base-100"
            value={revisionStatus}
            onChange={(event) => setRevisionStatus(event.target.value)}
            aria-label="Filter by revision status"
          >
            <option>All</option>
            {REVISION_STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">All Memos</h2>
          <p className="text-sm text-base-content/70">
            Showing {filteredNotes.length} of {notes.length} saved notes.
          </p>
        </div>
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
              Create First Memo
            </Link>
          </div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-base-300 bg-base-200/60 p-8 text-center text-base-content/70">
          No matching memos. Try a tag, platform, or lighter filter.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
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
