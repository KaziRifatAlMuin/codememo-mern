import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext.jsx"
import logo2 from "../assets/logo2.png"

export default function Auth({ mode }) {
  const isRegister = mode === "register"
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (isRegister) await register({ name, email, password })
      else await login({ email, password })
      navigate("/")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-[70vh] w-full max-w-sm place-items-center">
      <form className="surface-panel grid w-full gap-3 rounded-lg p-4" onSubmit={handleSubmit}>
        <img className="h-9 w-auto" src={logo2} alt="CodeMemo" />
        <div>
          <h1 className="text-lg font-semibold">{isRegister ? "Create Account" : "Login"}</h1>
          <p className="text-xs text-base-content/60">
            {isRegister ? "First registered account becomes admin." : "Continue to your memo workspace."}
          </p>
        </div>
        {isRegister ? (
          <label className="form-control">
            <span className="label py-1 text-xs">Name</span>
            <input className="input input-bordered glass-input h-10 min-h-10 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        ) : null}
        <label className="form-control">
          <span className="label py-1 text-xs">Email</span>
          <input className="input input-bordered glass-input h-10 min-h-10 text-sm" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="form-control">
          <span className="label py-1 text-xs">Password</span>
          <input className="input input-bordered glass-input h-10 min-h-10 text-sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
        <p className="text-center text-xs text-base-content/60">
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <Link className="link link-secondary" to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </form>
    </div>
  )
}
