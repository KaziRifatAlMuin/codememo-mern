import { useState } from "react"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext.jsx"

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await updateProfile({ name, bio })
      toast.success("Profile updated")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="surface-panel mx-auto grid w-full max-w-xl gap-3 rounded-lg p-4">
      <div>
        <h1 className="text-lg font-semibold">Profile</h1>
        <p className="text-xs text-base-content/60">{user?.email} · {user?.role}</p>
      </div>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="form-control">
          <span className="label py-1 text-xs">Name</span>
          <input className="input input-bordered glass-input h-10 min-h-10 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="form-control">
          <span className="label py-1 text-xs">Bio</span>
          <textarea className="textarea textarea-bordered glass-input text-sm" rows="4" value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <button className="btn btn-primary btn-sm justify-self-start" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  )
}
