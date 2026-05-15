import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Braces,
  FileCode2,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tags,
  Trash2,
} from "lucide-react"
import toast from "react-hot-toast"
import { fetchNotes, deleteNote, notesKeys } from "../api/notesApi.js"
import { createTag, deleteTag, fetchTags, tagsKeys } from "../api/tagsApi.js"
import NoteCard from "../components/NoteCard.jsx"
import {
  DIFFICULTIES,
  REVISION_STATUSES,
  TAG_COLORS,
  colorForTag,
  difficultyClass,
  difficultyHex,
  difficultySelectClass,
  normalizeNote,
  platformFromUrl,
  tagColorClass,
} from "../utils/noteMeta.js"
import heroArt from "../assets/hero.png"
import logo2 from "../assets/logo2.png"

function TagPanel({ tags, notes, onCreateTag, onDeleteTag, creating, deletingId }) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("cyan")

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
    onCreateTag({ name, color })
    setName("")
  }

  return (
    <div className="grid gap-4">
      <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_150px_auto]" onSubmit={handleSubmit}>
        <label className="input input-bordered glass-input flex items-center gap-2">
          <Tags size={17} className="text-base-content/45" aria-hidden="true" />
          <input
            className="grow"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Create tag: graphs, dp, greedy..."
          />
        </label>
        <select
          className={`select select-bordered border ${tagColorClass[color]}`}
          value={color}
          onChange={(event) => setColor(event.target.value)}
          aria-label="Tag color"
        >
          {TAG_COLORS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary btn-sm h-12 gap-2 border-0 text-base-100" disabled={creating}>
          <Plus size={17} aria-hidden="true" />
          Add Tag
        </button>
      </form>

      {tags.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <div key={tag._id || tag.name} className="rounded-lg border border-white/10 bg-base-100/60 p-3">
              <div className="flex items-start justify-between gap-3">
                <span className={`badge border ${tagColorClass[colorForTag(tag, tags)]}`}>#{tag.name}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                  onClick={() => onDeleteTag(tag._id)}
                  disabled={!tag._id || deletingId === tag._id}
                  aria-label={`Delete ${tag.name}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
              <p className="mt-3 text-sm text-base-content/65">
                Used in {usage[tag.name] || 0} memo{usage[tag.name] === 1 ? "" : "s"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-base-100/45 p-6 text-center text-sm text-base-content/65">
          No collection tags yet. Create tags here, then select multiple tags while writing a memo.
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("memos")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [difficulty, setDifficulty] = useState("All")
  const [revisionStatus, setRevisionStatus] = useState("All")
  const [selectedTag, setSelectedTag] = useState("All")

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

  const { data: tags = [] } = useQuery({
    queryKey: tagsKeys.all,
    queryFn: fetchTags,
  })

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all })
      toast.success("Tag saved")
    },
    onError: (err) => toast.error(err.message),
  })

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all })
      toast.success("Tag deleted")
    },
    onError: (err) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all })
      toast.success("Note deleted")
    },
    onError: (err) => toast.error(err.message),
  })

  const handleCreateTag = (tag) => {
    if (!tag.name.trim()) {
      toast.error("Tag name is required")
      return
    }
    createTagMutation.mutate(tag)
  }

  const handleDeleteTag = (id) => {
    if (!id) return
    const confirmed = window.confirm("Delete this tag from the collection?")
    if (confirmed) deleteTagMutation.mutate(id)
  }

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
      const matchesTag = selectedTag === "All" || memo.tags.includes(selectedTag)

      return matchesSearch && matchesDifficulty && matchesStatus && matchesTag
    })
  }, [debouncedSearch, difficulty, notes, revisionStatus, selectedTag])

  const allTags = useMemo(() => {
    const existing = new Set(tags.map((tag) => tag.name))
    const fromNotes = notes.flatMap((note) => normalizeNote(note).tags)
    const inferred = Array.from(new Set(fromNotes))
      .filter((name) => !existing.has(name))
      .map((name) => ({ _id: "", name, color: colorForTag(name, tags) }))

    return [...tags, ...inferred].sort((a, b) => a.name.localeCompare(b.name))
  }, [notes, tags])

  const masteredCount = notes.filter((note) => normalizeNote(note).revisionStatus === "Mastered").length
  const taggedCount = notes.reduce((sum, note) => sum + normalizeNote(note).tags.length, 0)

  return (
    <div className="flex flex-col gap-5">
      <section className="grid items-center gap-4 overflow-hidden rounded-lg border border-white/10 bg-base-200/72 p-4 shadow-[0_18px_56px_rgba(0,0,0,0.25)] backdrop-blur lg:grid-cols-[minmax(0,1.06fr)_minmax(260px,0.94fr)]">
        <div className="max-w-xl space-y-3">
          <img className="h-10 w-auto object-contain" src={logo2} alt="CodeMemo" />
          <div className="badge badge-primary badge-outline gap-2 border-primary/45 bg-primary/10 text-primary">
            <Braces size={14} aria-hidden="true" />
            Problem-solving memo system
          </div>
          <div className="space-y-2">
            <h1 className="max-w-xl text-2xl font-bold tracking-normal text-base-content sm:text-[1.9rem] lg:text-[2rem] lg:leading-[1.12]">
              Compact coding notes with colored difficulty, reusable tags, and focused review.
            </h1>
            <p className="max-w-lg text-sm leading-6 text-base-content/70">
              A dark blue/cyan workspace for keeping algorithms, snippets, platform links, and revision state easy to scan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((item) => (
              <span key={item} className={`badge badge-sm border ${difficultyClass[item]}`}>
                {item}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-primary btn-sm gap-2 border-0 shadow-[0_12px_34px_rgba(124,92,255,0.28)]" to="/create">
              <Plus size={17} aria-hidden="true" />
              Create Memo
            </Link>
            <button
              type="button"
              className="btn btn-outline btn-sm gap-2 border-white/15 hover:border-secondary/55 hover:bg-secondary/10"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw size={17} className={isFetching ? "animate-spin" : ""} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <div className="relative grid gap-3 rounded-lg border border-white/10 bg-base-100/50 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-secondary">Live workspace</p>
              <p className="text-sm text-base-content/65">Compact stats and tag signal</p>
            </div>
            <Sparkles className="text-secondary" size={19} aria-hidden="true" />
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="metric-tile p-3">
              <FileText className="mb-2 text-primary" size={18} aria-hidden="true" />
              <div className="text-xl font-bold leading-none text-primary">{notes.length}</div>
              <div className="mt-1 text-xs text-base-content/60">Memos</div>
            </div>
            <div className="metric-tile p-3">
              <Search className="mb-2 text-secondary" size={18} aria-hidden="true" />
              <div className="text-xl font-bold leading-none text-secondary">
                {isFetching ? "..." : masteredCount}
              </div>
              <div className="mt-1 text-xs text-base-content/60">Mastered</div>
            </div>
            <div className="metric-tile p-3">
              <FileCode2 className="mb-2 text-accent" size={18} aria-hidden="true" />
              <div className="text-xl font-bold leading-none text-accent">{taggedCount}</div>
              <div className="mt-1 text-xs text-base-content/60">Tag uses</div>
            </div>
          </div>

          <div className="grid min-h-28 place-items-center rounded-lg border border-dashed border-white/10 bg-base-200/50 p-2">
            <img className="h-24 w-auto object-contain opacity-95 sm:h-28" src={heroArt} alt="" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-white/10 bg-base-200/70 p-4 shadow-[0_14px_44px_rgba(0,0,0,0.18)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="badge badge-ghost gap-2 border border-white/10">
              <Filter size={14} aria-hidden="true" />
              Control Center
            </div>
            <h2 className="mt-2 text-xl font-bold">Dashboard</h2>
            <p className="text-sm text-base-content/70">
              Filter memos or manage your reusable tag collection.
            </p>
          </div>
          <div className="tabs-boxed tabs border border-white/10 bg-base-100/55 p-1">
            <button
              type="button"
              className={`tab h-8 text-sm ${activeTab === "memos" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("memos")}
            >
              Memos
            </button>
            <button
              type="button"
              className={`tab h-8 text-sm ${activeTab === "tags" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("tags")}
            >
              Tags
            </button>
          </div>
        </div>

        {activeTab === "memos" ? (
          <>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_170px]">
              <label className="input input-bordered glass-input flex h-11 items-center gap-2">
                <Search size={17} className="text-base-content/45" aria-hidden="true" />
                <input
                  type="search"
                  className="grow text-sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tag, platform, dp..."
                />
              </label>
              <select
                className={`select select-bordered h-11 text-sm ${
                  difficulty === "All" ? "glass-input" : difficultySelectClass[difficulty]
                }`}
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                aria-label="Filter by difficulty"
              >
                <option style={{ color: "#eef4ff", background: "#0d1224" }}>All</option>
                {DIFFICULTIES.map((item) => (
                  <option key={item} style={{ color: difficultyHex[item], background: "#0d1224" }}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                className="select select-bordered glass-input h-11 text-sm"
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

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`badge cursor-pointer border px-3 py-3 ${
                  selectedTag === "All" ? "border-secondary/40 bg-secondary/10 text-secondary" : "border-white/10"
                }`}
                onClick={() => setSelectedTag("All")}
              >
                All tags
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag._id || tag.name}
                  type="button"
                  className={`badge cursor-pointer border px-3 py-3 ${tagColorClass[colorForTag(tag, allTags)]} ${
                    selectedTag === tag.name ? "ring-1 ring-white/60" : ""
                  }`}
                  onClick={() => setSelectedTag(tag.name)}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </>
        ) : (
          <TagPanel
            tags={allTags}
            notes={notes}
            onCreateTag={handleCreateTag}
            onDeleteTag={handleDeleteTag}
            creating={createTagMutation.isPending}
            deletingId={deleteTagMutation.variables}
          />
        )}
      </section>

      {activeTab === "memos" ? (
        <>
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">All Memos</h2>
              <p className="text-sm text-base-content/70">
                Showing {filteredNotes.length} of {notes.length} saved notes.
              </p>
            </div>
            <button type="button" className="btn btn-secondary btn-sm gap-2 border-0 text-base-100" onClick={() => navigate("/create")}>
              <Plus size={17} aria-hidden="true" />
              New Memo
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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton h-48 rounded-lg" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/15 bg-base-200/60 p-8 text-center">
              <div className="mx-auto flex max-w-md flex-col items-center gap-4">
                <div className="rounded-full bg-primary/10 p-4 text-primary">
                  <FileText size={30} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No notes yet</h3>
                  <p className="mt-2 text-sm text-base-content/70">Create the first note and it will appear here.</p>
                </div>
                <Link className="btn btn-primary btn-sm gap-2" to="/create">
                  <Plus size={17} aria-hidden="true" />
                  Create First Memo
                </Link>
              </div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/15 bg-base-200/60 p-7 text-center text-sm text-base-content/70">
              No matching memos. Try a tag, platform, or lighter filter.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  tags={allTags}
                  deleting={deleteMutation.isPending && deleteMutation.variables === note._id}
                  onEdit={() => navigate(`/create/${note._id}`)}
                  onDelete={() => handleDelete(note._id)}
                />
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
