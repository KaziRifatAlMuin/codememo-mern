import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import {
  createNote,
  deleteNote,
  fetchNoteById,
  notesKeys,
  updateNote,
} from "../api/notesApi.js"

function NoteForm({ id, initialNote }) {
  const isEditMode = Boolean(id)
  const [title, setTitle] = useState(initialNote?.title || "")
  const [content, setContent] = useState(initialNote?.content || "")
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const titleRef = useRef(null)

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

  const handleSubmit = (event) => {
    event.preventDefault()

    const payload = {
      title: title.trim(),
      content: content.trim(),
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

  return (
    <section className="surface-panel rounded-lg">
      <div className="flex flex-col gap-6 p-5 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <div className="badge badge-primary badge-outline">
              {isEditMode ? "Update Note" : "New Note"}
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">
              {isEditMode ? "Refine this note." : "Start a new idea."}
            </h1>
          </div>
          <button
            type="button"
            className="btn btn-error btn-sm gap-2"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 size={16} aria-hidden="true" />
            Delete
          </button>
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
              placeholder="Give the note a clear title"
              className="input input-bordered w-full bg-base-100"
              autoFocus={!isEditMode}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Note</span>
            </div>
            <textarea
              rows="10"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write the details here"
              className="textarea textarea-bordered w-full bg-base-100 leading-7"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary gap-2" disabled={isSaving}>
              <Save size={18} aria-hidden="true" />
              {isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Create Note"}
            </button>
            <button type="button" className="btn btn-ghost gap-2" onClick={() => navigate("/")}>
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
    return <div className="skeleton h-80 rounded-lg" />
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
