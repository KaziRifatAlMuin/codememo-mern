import { Link } from "react-router-dom"
import { ArrowLeft, FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="rounded-lg border border-dashed border-base-300 bg-base-200/60 p-10 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
          <FileQuestion size={34} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="mt-2 text-base-content/70">Return to CodeMemo and keep solving.</p>
        </div>
        <Link className="btn btn-primary gap-2" to="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Back Home
        </Link>
      </div>
    </div>
  )
}
