import { Link, useLocation } from "react-router-dom"
import { Home, NotebookPen, Plus } from "lucide-react"

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
    <div data-theme="thinkboard" className="min-h-screen pb-10">
      <header className="sticky top-0 z-20 border-b border-base-300 bg-base-100/90 backdrop-blur">
        <div className="navbar mx-auto min-h-16 w-full max-w-7xl px-4 lg:px-8">
          <div className="navbar-start">
            <Link className="btn btn-ghost gap-2 px-2 text-lg font-bold" to="/">
              <NotebookPen size={22} className="text-primary" aria-hidden="true" />
              Thinkboard
            </Link>
          </div>
          <nav className="navbar-center hidden gap-2 md:flex" aria-label="Primary navigation">
            <NavLink to="/" icon={Home}>
              Home
            </NavLink>
            <NavLink to="/create" icon={Plus}>
              Create
            </NavLink>
          </nav>
          <div className="navbar-end">
            <Link className="btn btn-primary btn-sm gap-2" to="/create">
              <Plus size={16} aria-hidden="true" />
              New Note
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:px-8">
        {children}
      </main>

      <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-base-300 px-4 pt-6 text-sm text-base-content/70 lg:px-8">
        <span>Thinkboard keeps notes simple, searchable, and local-development friendly.</span>
        <span className="badge badge-outline">MERN + Docker</span>
      </footer>
    </div>
  )
}
