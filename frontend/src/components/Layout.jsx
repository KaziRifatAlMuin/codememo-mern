import { Link, useLocation } from "react-router-dom"
import { Braces, Home, NotebookPen, Plus } from "lucide-react"

function NavLink({ to, children, icon: Icon }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      className={`btn btn-ghost btn-sm gap-2 ${isActive ? "btn-active" : ""}`}
      to={to}
    >
      <Icon size={16} aria-hidden="true" />
      {children}
    </Link>
  )
}

export default function Layout({ children }) {
  return (
    <div data-theme="codememo" className="min-h-screen pb-10">
      <header className="sticky top-0 z-20 border-b border-base-300 bg-base-100/90 backdrop-blur">
        <div className="navbar mx-auto min-h-16 w-full max-w-6xl px-4 sm:px-6">
          <div className="navbar-start">
            <Link className="btn btn-ghost gap-2 px-2 text-lg font-bold" to="/">
              <span className="grid size-9 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <NotebookPen size={20} aria-hidden="true" />
              </span>
              <span className="hidden sm:inline">CodeMemo</span>
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
            <Link className="btn btn-primary btn-sm gap-2" to="/create">
              <Plus size={16} aria-hidden="true" />
              <span className="hidden sm:inline">New Memo</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-base-300 px-4 pt-6 text-sm text-base-content/65 sm:px-6">
        <span className="inline-flex items-center gap-2">
          <Braces size={16} aria-hidden="true" />
          CodeMemo keeps algorithms, snippets, and revision notes close.
        </span>
        <span className="badge badge-outline">MERN + DaisyUI</span>
      </footer>
    </div>
  )
}
