import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { fetchUser, updateUser, usersKeys } from "../api/usersApi.js"

export default function UserDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { data: user, isLoading, error } = useQuery({ queryKey: usersKeys.detail(id), queryFn: () => fetchUser(id) })
  const [draft, setDraft] = useState(null)
  const current = draft || user || {}
  const mutation = useMutation({
    mutationFn: (payload) => updateUser(id, payload),
    onSuccess: (updated) => {
      setDraft(updated)
      queryClient.invalidateQueries({ queryKey: usersKeys.all })
      queryClient.setQueryData(usersKeys.detail(id), updated)
      toast.success("User updated")
    },
    onError: (err) => toast.error(err.message),
  })

  if (isLoading) return <div className="skeleton h-52 rounded-lg" />
  if (error) return <div className="alert alert-error py-2 text-sm">{error.message}</div>

  return (
    <section className="surface-panel mx-auto grid w-full max-w-xl gap-3 rounded-lg p-4">
      <h1 className="text-lg font-semibold">User Profile</h1>
      <label className="form-control">
        <span className="label py-1 text-xs">Name</span>
        <input className="input input-bordered glass-input h-10 min-h-10 text-sm" value={current.name || ""} onChange={(e) => setDraft({ ...current, name: e.target.value })} />
      </label>
      <label className="form-control">
        <span className="label py-1 text-xs">Email</span>
        <input className="input input-bordered glass-input h-10 min-h-10 text-sm" value={current.email || ""} disabled />
      </label>
      <label className="form-control">
        <span className="label py-1 text-xs">Role</span>
        <select className="select select-bordered glass-input h-10 min-h-10 text-sm" value={current.role || "user"} onChange={(e) => setDraft({ ...current, role: e.target.value })}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </label>
      <label className="form-control">
        <span className="label py-1 text-xs">Bio</span>
        <textarea className="textarea textarea-bordered glass-input text-sm" rows="4" value={current.bio || ""} onChange={(e) => setDraft({ ...current, bio: e.target.value })} />
      </label>
      <button className="btn btn-primary btn-sm justify-self-start" onClick={() => mutation.mutate(current)} disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save User"}
      </button>
    </section>
  )
}
