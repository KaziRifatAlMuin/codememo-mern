import { Link, useLocation } from "react-router-dom"

function NavLink({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link className={isActive ? "nav-link active" : "nav-link"} to={to}>
      {children}
    </Link>
  )
}

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <div className="glow-layer" aria-hidden="true"></div>
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-dot"></span>
          Thinkboard
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/create">Create</NavLink>
        </nav>
        <Link className="btn primary" to="/create">
          New Note
        </Link>
      </header>
      <main className="app-main">{children}</main>
      <footer className="footer">
        <span>Thinkboard for fast ideas and calm focus.</span>
        <span className="footer-tag">MERN Stack</span>
      </footer>
    </div>
  )
}
