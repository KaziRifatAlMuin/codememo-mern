import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Clock3, Edit3, Filter, Plus, RefreshCw, Search, Tags, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { deleteNote, fetchNotes, notesKeys } from "../api/notesApi.js"
import { createTag, deleteTag, fetchTags, tagsKeys } from "../api/tagsApi.js"
import {
  DIFFICULTIES,
  REVISION_STATUSES,
  difficultyClass,
  difficultyOptionColor,
  normalizeNote,
  statusClass,
  statusOptionColor,
  statusRowClass,
} from "../utils/noteMeta.js"
import logo2 from "../assets/logo2.png"

function TopicsPanel({ tags, notes, onCreateTag, onDeleteTag, creating, deletingId }) {
  const [name, setName] = useState("")
  const usage = useMemo(() => {
    return notes.reduce((map, note) => {
      normalizeNote(note).tags.forEach((tag) => {
        map[tag] = (map[tag] || 0) + 1
      })
      return map
    }, {})
  }, [notes])

  const handleSubmit = (event) => {
    event.preventDefault()
    onCreateTag(name)
    setName("")
  }

  return (
    <section className="tech-panel grid gap-3 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Topics</h2>
          <p className="text-xs text-base-content/60">A reusable list. Select multiple topics when creating a memo.</p>
        </div>
        <form className="flex min-w-0 flex-1 justify-end gap-2 sm:max-w-md" onSubmit={handleSubmit}>
          <label className="input input-bordered glass-input flex h-9 min-w-0 flex-1 items-center gap-2">
            <Tags size={15} className="text-base-content/45" aria-hidden="true" />
            <input
              className="grow text-sm"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Add topic"
            />
          </label>
          <button className="btn btn-primary btn-sm h-9 gap-1.5" disabled={creating}>
            <Plus size={15} aria-hidden="true" />
            Add
          </button>
        </form>
      </div>

      {tags.length ? (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="table table-xs">
            <thead className="bg-base-100/70 text-base-content/55">
              <tr>
                <th>Topic</th>
                <th className="w-24 text-right">Memos</th>
                <th className="w-16 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag._id || tag.name} className="border-white/10">
                  <td className="font-medium text-base-content/85">{tag.name}</td>
                  <td className="text-right text-base-content/60">{usage[tag.name] || 0}</td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                      onClick={() => onDeleteTag(tag._id)}
                      disabled={!tag._id || deletingId === tag._id}
                      aria-label={`Delete ${tag.name}`}
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-base-100/40 p-5 text-center text-sm text-base-content/60">
          No topics yet. Add topics like dp, stl, number-theory, combinatorics.
        </div>
      )}
    </section>
  )
}

function formatDateTime(value) {
  if (!value) return "-"
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function MemoCards({ notes, deleting, onEdit, onDelete }) {
  if (!notes.length) {
    return (
      <div className="rounded-lg border border-dashed border-white/15 bg-base-200/60 p-7 text-center text-sm text-base-content/70">
        No matching memos.
      </div>
    )
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => {
        const memo = normalizeNote(note)
        return (
          <article
            key={note._id}
            className={`rounded-lg border border-white/10 p-3 shadow-[0_10px_28px_rgba(0,0,0,0.16)] ${statusRowClass[memo.revisionStatus]}`}
          >
            <div className="flex items-start justify-between gap-2">
              <Link className="line-clamp-2 text-sm font-semibold leading-5 hover:text-secondary" to={`/notes/${note._id}`}>
                {memo.title}
              </Link>
              <div className="flex shrink-0 gap-1">
                <button type="button" className="btn btn-ghost btn-xs" onClick={() => onEdit(note._id)}>
                  <Edit3 size={12} aria-hidden="true" />
                </button>
                <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => onDelete(note._id)} disabled={deleting === note._id}>
                  <Trash2 size={12} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={`badge badge-xs border ${difficultyClass[memo.difficulty]}`}>{memo.difficulty}</span>
              <span className={`badge badge-xs border ${statusClass[memo.revisionStatus]}`}>{memo.revisionStatus}</span>
              <span className="badge badge-xs border border-white/10 bg-base-100/50">{memo.resolve}</span>
            </div>
            <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-base-content/68">{memo.takeaways || memo.analysis || "No memo text yet."}</p>
            <p className="mt-2 truncate text-xs text-base-content/55">{memo.tags.length ? memo.tags.join(" | ") : "No topics"}</p>
            <div className="mt-3 grid gap-1 border-t border-white/10 pt-2 text-[0.68rem] text-base-content/50">
              <span className="inline-flex items-center gap-1">
                <Clock3 size={11} aria-hidden="true" />
                Created {formatDateTime(note.createdAt)}
              </span>
              <span>Edited {formatDateTime(note.updatedAt)}</span>
              {note.owner?.name ? <span>Owner {note.owner.name}</span> : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") === "topics" ? "topics" : "memos"
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [difficulty, setDifficulty] = useState("All")
  const [status, setStatus] = useState("All")
  const [topic, setTopic] = useState("All")

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 220)
    return () => window.clearTimeout(timeout)
  }, [search])

  const { data: notes = [], isLoading, isFetching, error, refetch } = useQuery({
    queryKey: notesKeys.all,
    queryFn: fetchNotes,
  })

  const { data: collectionTags = [] } = useQuery({
    queryKey: tagsKeys.all,
    queryFn: fetchTags,
  })

  const allTags = useMemo(() => {
    const existing = new Set(collectionTags.map((tag) => tag.name))
    const inferred = Array.from(new Set(notes.flatMap((note) => normalizeNote(note).tags)))
      .filter((name) => !existing.has(name))
      .map((name) => ({ _id: "", name }))

    return [...collectionTags, ...inferred].sort((a, b) => a.name.localeCompare(b.name))
  }, [collectionTags, notes])

  const createTagMutation = useMutation({
    mutationFn: (name) => createTag({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all })
      toast.success("Topic added")
    },
    onError: (err) => toast.error(err.message),
  })

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all })
      toast.success("Topic deleted")
    },
    onError: (err) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all })
      toast.success("Memo deleted")
    },
    onError: (err) => toast.error(err.message),
  })

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const memo = normalizeNote(note)
      const haystack = [
        memo.title,
        memo.difficulty,
        memo.revisionStatus,
        memo.metacognition,
        memo.takeaways,
        memo.analysis,
        memo.acceptedDate,
        memo.resolve,
        ...memo.tags,
      ]
        .join(" ")
        .toLowerCase()

      return (
        (!debouncedSearch || haystack.includes(debouncedSearch)) &&
        (status === "All" || memo.revisionStatus === status) &&
        (difficulty === "All" || memo.difficulty === difficulty) &&
        (topic === "All" || memo.tags.includes(topic))
      )
    })
  }, [debouncedSearch, difficulty, notes, status, topic])

  const handleCreateTag = (name) => {
    if (!name.trim()) {
      toast.error("Topic name is required")
      return
    }
    createTagMutation.mutate(name)
  }

  const handleDeleteTag = (id) => {
    if (!id) return
    if (window.confirm("Delete this topic from the list?")) deleteTagMutation.mutate(id)
  }

  const handleDeleteMemo = (id) => {
    if (window.confirm("Delete this memo?")) deleteMutation.mutate(id)
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="tech-panel p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img className="h-8 w-auto object-contain" src={logo2} alt="CodeMemo" />
            <div>
              <h1 className="text-lg font-semibold leading-tight">Problem Review Tracker</h1>
              <p className="text-xs text-base-content/60">
                Compact memo cards for problems, status, topics, thinking notes, and review state.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm h-9 ${activeTab === "memos" ? "btn-primary" : "btn-ghost border border-white/10"}`}
              onClick={() => setSearchParams({ tab: "memos" })}
            >
              Memos
            </button>
            <button
              type="button"
              className={`btn btn-sm h-9 ${activeTab === "topics" ? "btn-primary" : "btn-ghost border border-white/10"}`}
              onClick={() => setSearchParams({ tab: "topics" })}
            >
              Topics
            </button>
            <Link className="btn btn-secondary btn-sm h-9 gap-1.5 border-0 text-base-100" to="/create">
              <Plus size={15} aria-hidden="true" />
              New
            </Link>
          </div>
        </div>
      </section>

      {activeTab === "memos" ? (
        <>
          <section className="tech-panel grid gap-3 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-base-content/80">
                <Filter size={15} aria-hidden="true" />
                Filters
              </div>
              <button className="btn btn-ghost btn-xs gap-1.5" type="button" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} aria-hidden="true" />
                Refresh
              </button>
            </div>
            <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_150px_150px_180px]">
              <label className="input input-bordered glass-input flex h-9 items-center gap-2">
                <Search size={15} className="text-base-content/45" aria-hidden="true" />
                <input
                  type="search"
                  className="grow text-sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search problem, topic, takeaway, analysis..."
                />
              </label>
              <select
                className={`select select-bordered h-9 min-h-9 text-sm ${
                  difficulty === "All" ? "glass-input" : difficultyClass[difficulty]
                }`}
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                <option style={{ color: "#eef4ff", background: "#0d1224" }}>All</option>
                {DIFFICULTIES.map((item) => (
                  <option key={item} style={{ color: difficultyOptionColor[item], background: "#0d1224" }}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                className={`select select-bordered h-9 min-h-9 text-sm ${
                  status === "All" ? "glass-input" : statusClass[status]
                }`}
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option style={{ color: "#eef4ff", background: "#0d1224" }}>All</option>
                {REVISION_STATUSES.map((item) => (
                  <option key={item} style={{ color: statusOptionColor[item], background: "#0d1224" }}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                className="select select-bordered glass-input h-9 min-h-9 text-sm"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              >
                <option>All</option>
                {allTags.map((tag) => (
                  <option key={tag._id || tag.name}>{tag.name}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-base-content/55">
              Showing {filteredNotes.length} of {notes.length} memos.
            </p>
          </section>

          {error ? (
            <div className="alert alert-error rounded-lg py-2 text-sm">{error.message}</div>
          ) : isLoading ? (
            <div className="skeleton h-52 rounded-lg" />
          ) : (
            <MemoCards
              notes={filteredNotes}
              deleting={deleteMutation.variables}
              onEdit={(id) => navigate(`/create/${id}`)}
              onDelete={handleDeleteMemo}
            />
          )}
        </>
      ) : (
        <TopicsPanel
          tags={allTags}
          notes={notes}
          onCreateTag={handleCreateTag}
          onDeleteTag={handleDeleteTag}
          creating={createTagMutation.isPending}
          deletingId={deleteTagMutation.variables}
        />
      )}
    </div>
  )
}
