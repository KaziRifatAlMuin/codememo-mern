export default function ActionBar({
  onEdit,
  onDelete,
  editDisabled = false,
  deleteDisabled = false,
  editLabel = "Edit",
  deleteLabel = "Delete",
}) {
  return (
    <div className="action-bar">
      <button
        type="button"
        className="btn ghost"
        onClick={onEdit}
        disabled={editDisabled}
      >
        {editLabel}
      </button>
      <button
        type="button"
        className="btn danger"
        onClick={onDelete}
        disabled={deleteDisabled}
      >
        {deleteLabel}
      </button>
    </div>
  )
}
