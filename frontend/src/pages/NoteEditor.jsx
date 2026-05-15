import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Eye, Plus, Save, Tags, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { createNote, deleteNote, fetchNoteById, notesKeys, updateNote } from "../api/notesApi.js"
import { createTag, fetchTags, tagsKeys } from "../api/tagsApi.js"
import CodeBlock from "../components/CodeBlock.jsx"
import MarkdownPreview from "../components/MarkdownPreview.jsx"
import {
  DIFFICULTIES,
  LANGUAGES,
  REVISITED_STATUSES,
  REVISION_STATUSES,
  difficultyClass,
  difficultyOptionColor,
  normalizeNote,
  parseTags,
  revisitedClass,
  statusClass,
  statusOptionColor,
  statusRowClass,
} from "../utils/noteMeta.js"

function NoteForm({ id, initialNote }) {
  const isEditMode = Boolean(id)
  const memo = normalizeNote(initialNote)
  const [title, setTitle] = useState(memo.title)
  const [difficulty, setDifficulty] = useState(memo.difficulty)
  const [revisionStatus, setRevisionStatus] = useState(memo.revisionStatus)
  const [selectedTags, setSelectedTags] = useState(memo.tags)
  const [metacognition, setMetacognition] = useState(memo.metacognition)
  const [takeaways, setTakeaways] = useState(memo.takeaways)
  const [analysis, setAnalysis] = useState(memo.analysis)
  const [acceptedDate, setAcceptedDate] = useState(memo.acceptedDate)
  const [resolve, setResolve] = useState(memo.resolve)
  const [problemUrl, setProblemUrl] = useState(memo.problemUrl)
  const [language, setLanguage] = useState(memo.language)
  const [codeSnippet, setCodeSnippet] = useState(memo.codeSnippet)
  const [newTopic, setNewTopic] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const titleRef = useRef(null)

  const { data: topics = [] } = useQuery({
    queryKey: tagsKeys.all,
    queryFn: fetchTags,
  })

  const visibleTopics = [
    ...topics,
    ...selectedTags
      .filter((name) => !topics.some((topic) => topic.name === name))
      .map((name) => ({ _id: "", name })),
  ].sort((a, b) => a.name.localeCompare(b.name))

  const createTopicMutation = useMutation({
    mutationFn: (name) => createTag({ name }),
    onSuccess: (topic) => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all })
      setSelectedTags((current) => (current.includes(topic.name) ? current : [...current, topic.name]))
      setNewTopic("")
      toast.success("Topic added")
    },
    onError: (err) => toast.error(err.message),
  })

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (created) => {
      const note = created.note || created
      queryClient.invalidateQueries({ queryKey: notesKeys.all })
      toast.success("Memo created")
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
      toast.success("Memo updated")
      navigate(`/notes/${id}`)
    },
    onError: (err) => toast.error(err.message),
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

  const isSaving = createMutation.isPending || updateMutation.isPending

  const toggleTopic = (topicName) => {
    setSelectedTags((current) =>
      current.includes(topicName)
        ? current.filter((item) => item !== topicName)
        : [...current, topicName].slice(0, 16)
    )
  }

  const handleCreateTopic = () => {
    if (!newTopic.trim()) {
      toast.error("Topic name is required")
      return
    }
    createTopicMutation.mutate(newTopic)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const payload = {
      title: title.trim(),
      difficulty: difficulty.trim(),
      revisionStatus,
      tags: parseTags(selectedTags),
      metacognition: metacognition.trim(),
      takeaways: takeaways.trim(),
      analysis: analysis.trim(),
      acceptedDate: acceptedDate.trim(),
      resolve,
      problemUrl: problemUrl.trim(),
      language,
      codeSnippet: codeSnippet.trim(),
      content: takeaways.trim(),
    }

    if (!payload.title) {
      toast.error("Problem is required")
      return
    }

    if (isEditMode) updateMutation.mutate(payload)
    else createMutation.mutate(payload)
  }

  const handleDelete = () => {
    if (!isEditMode) return
    if (window.confirm("Delete this memo?")) deleteMutation.mutate(id)
  }

  return (
    <section className={`mx-auto w-full max-w-5xl rounded-lg border border-white/10 ${statusRowClass[revisionStatus]}`}>
      <div className="grid gap-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className={`badge badge-sm border ${statusClass[revisionStatus]}`}>{isEditMode ? "Edit Memo" : "New Memo"}</div>
            <h1 className="mt-2 text-lg font-semibold">
              {isEditMode ? "Update problem review details." : "Add a problem review memo."}
            </h1>
          </div>
          {isEditMode ? (
            <button type="button" className="btn btn-error btn-sm gap-1.5" onClick={handleDelete} disabled={deleteMutation.isPending}>
              <Trash2 size={15} aria-hidden="true" />
              Delete
            </button>
          ) : null}
        </div>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px_170px]">
            <label className="form-control">
              <span className="label py-1 text-xs font-medium">Problem</span>
              <input
                ref={titleRef}
                className="input input-bordered glass-input h-10 min-h-10 text-sm placeholder:text-base-content/30"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Problem title with round/code"
                autoFocus={!isEditMode}
              />
            </label>
            <label className="form-control">
              <span className="label py-1 text-xs font-medium">Difficulty</span>
              <select
                className={`select select-bordered h-10 min-h-10 text-sm ${difficultyClass[difficulty]}`}
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                {DIFFICULTIES.map((item) => (
                  <option key={item} style={{ color: difficultyOptionColor[item], background: "#0d1224" }}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control">
              <span className="label py-1 text-xs font-medium">Status</span>
              <select
                className={`select select-bordered h-10 min-h-10 text-sm ${statusClass[revisionStatus]}`}
                value={revisionStatus}
                onChange={(event) => setRevisionStatus(event.target.value)}
              >
                {REVISION_STATUSES.map((item) => (
                  <option key={item} style={{ color: statusOptionColor[item], background: "#0d1224" }}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-2 rounded-lg border border-white/10 bg-base-100/45 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium">Topics</span>
              <div className="flex gap-2">
                <label className="input input-bordered glass-input flex h-8 min-h-8 items-center gap-1.5">
                  <Tags size={13} className="text-base-content/45" aria-hidden="true" />
                  <input
                    className="w-36 text-xs placeholder:text-base-content/30"
                    value={newTopic}
                    onChange={(event) => setNewTopic(event.target.value)}
                    placeholder="Add reusable topic"
                  />
                </label>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs h-8 min-h-8 gap-1 border-0 text-base-100"
                  onClick={handleCreateTopic}
                  disabled={createTopicMutation.isPending}
                >
                  <Plus size={13} aria-hidden="true" />
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {visibleTopics.length ? (
                visibleTopics.map((topic) => {
                  const selected = selectedTags.includes(topic.name)
                  return (
                    <button
                      type="button"
                      key={topic._id || topic.name}
                      className={`rounded border px-2 py-1 text-xs transition ${
                        selected
                          ? "border-secondary/45 bg-secondary/10 text-secondary"
                          : "border-white/10 bg-base-200/60 text-base-content/65 hover:border-white/25"
                      }`}
                      onClick={() => toggleTopic(topic.name)}
                    >
                      {topic.name}
                    </button>
                  )
                })
              ) : (
                <span className="text-xs text-base-content/55">No topics yet.</span>
              )}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <label className="form-control">
              <span className="label py-1 text-xs font-medium">Metacognition</span>
              <input
                className="input input-bordered glass-input h-10 min-h-10 text-sm"
                value={metacognition}
                onChange={(event) => setMetacognition(event.target.value)}
                placeholder="Thinking state or pattern noticed"
              />
            </label>
            <label className="form-control">
              <span className="label py-1 text-xs font-medium">Revisited</span>
              <select
                className={`select select-bordered h-10 min-h-10 text-sm ${revisitedClass[resolve]}`}
                value={resolve}
                onChange={(event) => setResolve(event.target.value)}
              >
                {REVISITED_STATUSES.map((item) => (
                  <option key={item} style={{ color: item === "Mastered" ? "#5eead4" : item === "Revisited" ? "#93c5fd" : "#e2e8f0", background: "#0d1224" }}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_150px_150px]">
            <label className="form-control">
              <span className="label py-1 text-xs font-medium">Problem Link</span>
              <input
                type="url"
                className="input input-bordered glass-input h-10 min-h-10 text-sm placeholder:text-base-content/30"
                value={problemUrl}
                onChange={(event) => setProblemUrl(event.target.value)}
                placeholder="Optional problem URL"
              />
            </label>
            <label className="form-control">
              <span className="label py-1 text-xs font-medium">Accepted</span>
              <input
                className="input input-bordered glass-input h-10 min-h-10 text-sm placeholder:text-base-content/30"
                value={acceptedDate}
                onChange={(event) => setAcceptedDate(event.target.value)}
                placeholder="Solved date"
              />
            </label>
            <label className="form-control">
              <span className="label py-1 text-xs font-medium">Code Language</span>
              <select
                className="select select-bordered glass-input h-10 min-h-10 text-sm"
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
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <label className="form-control">
              <span className="label py-1 text-xs font-medium">Takeaways Markdown</span>
              <textarea
                rows="4"
                className="textarea textarea-bordered glass-input text-sm leading-6 placeholder:text-base-content/30"
                value={takeaways}
                onChange={(event) => setTakeaways(event.target.value)}
                placeholder={"- Key observation\n- Why the simpler version helped"}
              />
            </label>
            <label className="form-control">
              <span className="label py-1 text-xs font-medium">Analysis Markdown</span>
              <textarea
                rows="4"
                className="textarea textarea-bordered glass-input text-sm leading-6 placeholder:text-base-content/30"
                value={analysis}
                onChange={(event) => setAnalysis(event.target.value)}
                placeholder={"1. First approach\n2. Where it failed\n3. Final correction"}
              />
            </label>
          </div>

          <label className="form-control">
            <span className="label py-1 text-xs font-medium">Code Snippet</span>
            <textarea
              rows="5"
              className="textarea textarea-bordered border-white/10 bg-[#060816] font-mono text-xs leading-5 text-base-content/85 placeholder:text-base-content/25"
              value={codeSnippet}
              onChange={(event) => setCodeSnippet(event.target.value)}
              placeholder="Paste the important part of the accepted solution"
            />
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" className="btn btn-primary btn-sm gap-1.5" disabled={isSaving}>
              <Save size={15} aria-hidden="true" />
              {isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Create Memo"}
            </button>
            <button type="button" className="btn btn-secondary btn-sm gap-1.5 border-0 text-base-100" onClick={() => setShowPreview((value) => !value)}>
              <Eye size={15} aria-hidden="true" />
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
            <button type="button" className="btn btn-ghost btn-sm gap-1.5 hover:bg-white/5" onClick={() => navigate("/")}>
              <ArrowLeft size={15} aria-hidden="true" />
              Cancel
            </button>
          </div>
        </form>

        {showPreview ? (
          <section className="grid gap-3 rounded-lg border border-white/10 bg-base-100/55 p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className={`badge badge-sm border ${statusClass[revisionStatus]}`}>{revisionStatus}</div>
                <h2 className="mt-2 text-lg font-semibold">{title || "Problem preview"}</h2>
                <p className="mt-1 text-xs text-base-content/60">
                  {difficulty} · {selectedTags.length ? selectedTags.join(" | ") : "No topics"} · {resolve}
                </p>
              </div>
              <span className={`badge badge-sm border ${difficultyClass[difficulty]}`}>{difficulty}</span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-base-200/60 p-3">
                <h3 className="text-sm font-semibold text-secondary">Takeaways</h3>
                <div className="mt-2 text-sm">
                  <MarkdownPreview content={takeaways || "_Add concise lessons learned here._"} />
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-base-200/60 p-3">
                <h3 className="text-sm font-semibold text-secondary">Analysis</h3>
                <div className="mt-2 text-sm">
                  <MarkdownPreview content={analysis || "_Add the thinking path, failed tries, and correction here._"} />
                </div>
              </div>
            </div>
            {codeSnippet ? (
              <div className="code-window">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-base-content/55">
                  <span>{LANGUAGES.find((item) => item.value === language)?.label}</span>
                  <span>formatted snippet</span>
                </div>
                <CodeBlock code={codeSnippet} language={language} />
              </div>
            ) : null}
          </section>
        ) : null}
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

  if (isLoading) return <div className="skeleton h-60 rounded-lg" />

  if (error) {
    return (
      <div className="alert alert-error rounded-lg py-2 text-sm">
        <span>{error.message}</span>
      </div>
    )
  }

  return <NoteForm key={id || "new-note"} id={id} initialNote={existingNote} />
}
