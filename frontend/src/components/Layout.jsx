import { Link, useLocation } from "react-router-dom"
import { Home, Plus } from "lucide-react"
import logo2 from "../assets/logo2.png"

function NavLink({ to, children, icon: Icon }) {
  const location = useLocation()
  const isActive = location.pathname === to

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
            <NavLink to="/" icon={Home}>
              Dashboard
            </NavLink>
            <NavLink to="/create" icon={Plus}>
              Create
            </NavLink>
          </nav>
          <div className="navbar-end">
            <Link className="btn btn-primary btn-sm gap-2 border-0 shadow-[0_10px_30px_rgba(124,92,255,0.28)]" to="/create">
              <Plus size={16} aria-hidden="true" />
              <span className="hidden sm:inline">New Memo</span>
              <span className="sm:hidden">New</span>
            </Link>
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
