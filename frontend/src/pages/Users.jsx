import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { fetchUsers, updateUser, usersKeys } from "../api/usersApi.js"

export default function Users() {
  const queryClient = useQueryClient()
  const { data: users = [], isLoading, error } = useQuery({ queryKey: usersKeys.all, queryFn: fetchUsers })
  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all })
      toast.success("User updated")
    },
    onError: (err) => toast.error(err.message),
  })

  if (isLoading) return <div className="skeleton h-52 rounded-lg" />
  if (error) return <div className="alert alert-error py-2 text-sm">{error.message}</div>

  return (
    <section className="tech-panel grid gap-3 p-3">
      <div>
        <h1 className="text-lg font-semibold">Users</h1>
        <p className="text-xs text-base-content/60">Admins can update roles and user details.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <article key={user._id} className="rounded-lg border border-white/10 bg-base-100/55 p-3 text-sm">
            <Link className="font-semibold hover:text-secondary" to={`/users/${user._id}`}>{user.name}</Link>
            <p className="mt-1 text-xs text-base-content/60">{user.email}</p>
            <select
              className="select select-bordered glass-input mt-3 h-8 min-h-8 w-full text-xs"
              value={user.role}
              onChange={(e) => mutation.mutate({ id: user._id, payload: { role: e.target.value } })}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </article>
        ))}
      </div>
    </section>
  )
}
