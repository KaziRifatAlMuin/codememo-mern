import { Link, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, CalendarDays } from "lucide-react"
import toast from "react-hot-toast"
import { deleteNote, fetchNoteById, notesKeys } from "../api/notesApi.js"
import ActionBar from "../components/ActionBar.jsx"

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

  return (
    <section className="surface-panel rounded-lg">
      <div className="flex flex-col gap-6 p-5 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-3">
            <div className="badge badge-secondary badge-outline">Note Detail</div>
            <h1 className="text-3xl font-bold md:text-4xl">{note.title}</h1>
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

        <div className="min-h-52 whitespace-pre-wrap rounded-lg border border-base-300 bg-base-200/60 p-5 leading-7 text-base-content/80">
          {note.content}
        </div>

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
