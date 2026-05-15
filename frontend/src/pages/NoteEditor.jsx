import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Plus, Save, Tags, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import {
  createNote,
  deleteNote,
  fetchNoteById,
  notesKeys,
  updateNote,
} from "../api/notesApi.js"
import { createTag, fetchTags, tagsKeys } from "../api/tagsApi.js"
import {
  DIFFICULTIES,
  LANGUAGES,
  REVISION_STATUSES,
  TAG_COLORS,
  colorForTag,
  difficultyHex,
  difficultySelectClass,
  normalizeNote,
  parseTags,
  tagColorClass,
} from "../utils/noteMeta.js"

function NoteForm({ id, initialNote }) {
  const isEditMode = Boolean(id)
  const memo = normalizeNote(initialNote)
  const [title, setTitle] = useState(memo.title)
  const [content, setContent] = useState(memo.content)
  const [selectedTags, setSelectedTags] = useState(memo.tags)
  const [newTag, setNewTag] = useState("")
  const [newTagColor, setNewTagColor] = useState("cyan")
  const [difficulty, setDifficulty] = useState(memo.difficulty)
  const [language, setLanguage] = useState(memo.language)
  const [codeSnippet, setCodeSnippet] = useState(memo.codeSnippet)
  const [problemUrl, setProblemUrl] = useState(memo.problemUrl)
  const [revisionStatus, setRevisionStatus] = useState(memo.revisionStatus)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const titleRef = useRef(null)

  const { data: tags = [] } = useQuery({
    queryKey: tagsKeys.all,
    queryFn: fetchTags,
  })

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: (tag) => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all })
      setSelectedTags((current) => (current.includes(tag.name) ? current : [...current, tag.name]))
      setNewTag("")
      toast.success("Tag saved")
    },
    onError: (err) => toast.error(err.message),
  })

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (created) => {
      const note = created.note || created
      queryClient.invalidateQueries({ queryKey: notesKeys.all })
      toast.success("Note created")
      navigate(note?._id ? `/notes/${note._id}` : "/")
    },
    onError: (err) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: (payload) => updateNote(id, payload),
    onSuccess: (updated) => {
      const note = updated.note || updated
      queryClient.invalidateQueries({ queryKey: notesKeys.all })
      queryClient.setQueryData(notesKeys.detail(id), note)
      toast.success("Note updated")
      navigate(`/notes/${id}`)
    },
    onError: (err) => toast.error(err.message),
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

  const isSaving = createMutation.isPending || updateMutation.isPending
  const visibleTags = [
    ...tags,
    ...selectedTags
      .filter((name) => !tags.some((tag) => tag.name === name))
      .map((name) => ({ _id: "", name, color: colorForTag(name, tags) })),
  ].sort((a, b) => a.name.localeCompare(b.name))

  const handleSubmit = (event) => {
    event.preventDefault()

    const payload = {
      title: title.trim(),
      content: content.trim(),
      tags: parseTags(selectedTags),
      difficulty,
      language,
      codeSnippet: codeSnippet.trim(),
      problemUrl: problemUrl.trim(),
      revisionStatus,
    }

    if (!payload.title || !payload.content) {
      toast.error("Title and content are required")
      return
    }

    if (isEditMode) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleDelete = () => {
    if (!isEditMode) {
      toast("Save the note before deleting it")
      return
    }

    const confirmed = window.confirm("Delete this note?")
    if (confirmed) deleteMutation.mutate(id)
  }

  const toggleTag = (tagName) => {
    setSelectedTags((current) =>
      current.includes(tagName)
        ? current.filter((item) => item !== tagName)
        : [...current, tagName].slice(0, 12)
    )
  }

  const handleCreateTag = () => {
    if (!newTag.trim()) {
      toast.error("Tag name is required")
      return
    }
    createTagMutation.mutate({ name: newTag, color: newTagColor })
  }

  return (
    <section className="surface-panel mx-auto w-full max-w-5xl rounded-lg">
      <div className="flex flex-col gap-5 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <div className="badge badge-primary badge-outline">
              {isEditMode ? "Update Memo" : "New Memo"}
            </div>
            <h1 className="text-xl font-bold sm:text-2xl">
              {isEditMode ? "Refine this problem-solving note." : "Capture a focused study memo."}
            </h1>
          </div>
          {isEditMode ? (
            <button
              type="button"
              className="btn btn-error btn-sm gap-2"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={16} aria-hidden="true" />
              Delete
            </button>
          ) : null}
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Title</span>
            </div>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Binary Search, Segment Tree, Graph Theory..."
              className="input input-bordered glass-input w-full"
              autoFocus={!isEditMode}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Difficulty</span>
              </div>
              <select
                className={`select select-bordered ${difficultySelectClass[difficulty]}`}
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                {DIFFICULTIES.map((item) => (
                  <option key={item} style={{ color: difficultyHex[item], background: "#0d1224" }}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Language</span>
              </div>
              <select
                className="select select-bordered glass-input"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {LANGUAGES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Revision</span>
              </div>
              <select
                className="select select-bordered glass-input"
                value={revisionStatus}
                onChange={(event) => setRevisionStatus(event.target.value)}
              >
                {REVISION_STATUSES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4">
            <div className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Tags</span>
                <span className="label-text-alt text-base-content/50">Select multiple</span>
              </div>
              <div className="grid gap-3 rounded-lg border border-white/10 bg-base-100/50 p-3">
                <div className="flex flex-wrap gap-2">
                  {visibleTags.length ? (
                    visibleTags.map((tag) => {
                      const selected = selectedTags.includes(tag.name)
                      return (
                        <button
                          type="button"
                          key={tag._id || tag.name}
                          className={`badge cursor-pointer border px-3 py-3 ${tagColorClass[colorForTag(tag, visibleTags)]} ${
                            selected ? "ring-1 ring-white/70" : "opacity-75"
                          }`}
                          onClick={() => toggleTag(tag.name)}
                        >
                          #{tag.name}
                        </button>
                      )
                    })
                  ) : (
                    <span className="text-sm text-base-content/60">Create a tag below to start a collection.</span>
                  )}
                </div>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_135px_auto]">
                  <label className="input input-bordered glass-input flex h-11 items-center gap-2">
                    <Tags size={16} className="text-base-content/45" aria-hidden="true" />
                    <input
                      className="grow text-sm"
                      value={newTag}
                      onChange={(event) => setNewTag(event.target.value)}
                      placeholder="New tag"
                    />
                  </label>
                  <select
                    className={`select select-bordered h-11 text-sm ${tagColorClass[newTagColor]}`}
                    value={newTagColor}
                    onChange={(event) => setNewTagColor(event.target.value)}
                    aria-label="New tag color"
                  >
                    {TAG_COLORS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm h-11 gap-2 border-0 text-base-100"
                    onClick={handleCreateTag}
                    disabled={createTagMutation.isPending}
                  >
                    <Plus size={16} aria-hidden="true" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Problem Link</span>
              </div>
              <input
                type="url"
                value={problemUrl}
                onChange={(event) => setProblemUrl(event.target.value)}
                placeholder="https://codeforces.com/..."
                className="input input-bordered glass-input w-full"
              />
            </label>
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Markdown Note</span>
            </div>
            <textarea
              rows="9"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={"## Idea\n- Explain the pattern\n- Add edge cases\n- Link observations to the snippet"}
              className="textarea textarea-bordered glass-input w-full leading-7"
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Code Snippet</span>
              <span className="label-text-alt text-base-content/50">C++, Python, or JavaScript</span>
            </div>
            <textarea
              rows="8"
              value={codeSnippet}
              onChange={(event) => setCodeSnippet(event.target.value)}
              placeholder="Paste the reusable pattern or solved snippet here"
              className="textarea textarea-bordered w-full border-white/10 bg-[#060816] font-mono text-sm leading-6 text-base-content/85"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary gap-2" disabled={isSaving}>
              <Save size={18} aria-hidden="true" />
              {isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Create Memo"}
            </button>
            <button type="button" className="btn btn-ghost gap-2 hover:bg-white/5" onClick={() => navigate("/")}>
              <ArrowLeft size={18} aria-hidden="true" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default function NoteEditor() {
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const { data: existingNote, isLoading, error } = useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: () => fetchNoteById(id),
    enabled: isEditMode,
  })

  if (isLoading) {
    return <div className="skeleton h-72 rounded-lg" />
  }

  if (error) {
    return (
      <div className="alert alert-error rounded-lg">
        <span>{error.message}</span>
      </div>
    )
  }

  return <NoteForm key={id || "new-note"} id={id} initialNote={existingNote} />
}
