import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="page">
      <div className="empty-state">
        <h3>That page went missing.</h3>
        <p>Return to your notes and keep the story moving.</p>
        <Link className="btn primary" to="/">
          Back home
        </Link>
      </div>
    </div>
  )
}
