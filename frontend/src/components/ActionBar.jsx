import { Pencil, Trash2 } from "lucide-react"

export default function ActionBar({
  onEdit,
  onDelete,
  editDisabled = false,
  deleteDisabled = false,
  editLabel = "Edit",
  deleteLabel = "Delete",
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="btn btn-outline btn-sm gap-2 border-white/15 hover:border-secondary/55 hover:bg-secondary/10"
        onClick={onEdit}
        disabled={editDisabled}
      >
        <Pencil size={16} aria-hidden="true" />
        {editLabel}
      </button>
      <button
        type="button"
        className="btn btn-error btn-sm gap-2"
        onClick={onDelete}
        disabled={deleteDisabled}
      >
        <Trash2 size={16} aria-hidden="true" />
        {deleteLabel}
      </button>
    </div>
  )
}
