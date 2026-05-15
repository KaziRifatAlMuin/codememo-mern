import { Link, useLocation } from "react-router-dom"
import { Home, LogOut, Plus, Tags, User, Users } from "lucide-react"
import { useAuth } from "../context/AuthContext.jsx"
import logo2 from "../assets/logo2.png"

function NavLink({ to, children, icon: Icon }) {
  const location = useLocation()
  const isActive = `${location.pathname}${location.search}` === to || (to === "/" && location.pathname === "/" && !location.search)

  return (
    <Link
      className={`btn btn-ghost btn-sm gap-2 text-base-content/75 hover:bg-white/5 hover:text-base-content ${
        isActive ? "border border-white/10 bg-white/5 text-base-content" : ""
      }`}
      to={to}
    >
      <Icon size={16} aria-hidden="true" />
      {children}
    </Link>
  )
}

export default function Layout({ children }) {
  const { user, isAdmin, logout } = useAuth()

  return (
    <div data-theme="codememo" className="min-h-screen pb-8">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-base-100/80 backdrop-blur-xl">
        <div className="navbar mx-auto min-h-14 w-full max-w-5xl px-4 sm:px-5">
          <div className="navbar-start">
            <Link className="btn btn-ghost h-11 px-1 hover:bg-transparent" to="/" aria-label="CodeMemo home">
              <img className="h-8 w-auto object-contain sm:h-9" src={logo2} alt="CodeMemo" />
            </Link>
          </div>
          <nav className="navbar-center hidden gap-2 md:flex" aria-label="Primary navigation">
            {user ? (
              <>
                <NavLink to="/" icon={Home}>Memos</NavLink>
                <NavLink to="/?tab=topics" icon={Tags}>Topics</NavLink>
                <NavLink to="/create" icon={Plus}>New</NavLink>
                {isAdmin ? <NavLink to="/users" icon={Users}>Users</NavLink> : null}
              </>
            ) : null}
          </nav>
          <div className="navbar-end">
            {user ? (
              <div className="flex items-center gap-2">
                <Link className="btn btn-ghost btn-sm gap-1.5 border border-white/10" to="/profile">
                  <User size={15} aria-hidden="true" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button className="btn btn-ghost btn-sm" type="button" onClick={logout} aria-label="Logout">
                  <LogOut size={15} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login">Login</Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-5 lg:py-6">
        {children}
      </main>

      <footer className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 pt-5 text-sm text-base-content/65 sm:px-5">
        <span className="inline-flex items-center gap-2">
          <img className="h-5 w-auto object-contain" src={logo2} alt="" />
          CodeMemo keeps algorithms, snippets, and revision notes close.
        </span>
        <span className="badge badge-outline border-secondary/35 text-secondary">MERN + DaisyUI</span>
      </footer>
    </div>
  )
}
