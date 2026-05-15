function renderInline(text) {
  const parts = text.split(/(`[^`]+`)/g)

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-base-300 px-1.5 py-0.5 text-sm text-secondary">
          {part.slice(1, -1)}
        </code>
      )
    }

    return part
  })
}

export default function MarkdownPreview({ content }) {
  const lines = (content || "").split("\n")
  const nodes = []
  let listItems = []
  let codeLines = []
  let inCode = false

  const flushList = () => {
    if (!listItems.length) return

    nodes.push(
      <ul key={`list-${nodes.length}`} className="list-disc space-y-1 pl-5 text-base-content/75">
        {listItems.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ul>
    )
    listItems = []
  }

  const flushCode = () => {
    if (!codeLines.length) return

    nodes.push(
      <div key={`code-${nodes.length}`} className="code-window">
        <pre>
          <code>{codeLines.join("\n")}</code>
        </pre>
      </div>
    )
    codeLines = []
  }

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        inCode = false
        flushCode()
      } else {
        flushList()
        inCode = true
      }
      return
    }

    if (inCode) {
      codeLines.push(line)
      return
    }

    if (line.startsWith("### ")) {
      flushList()
      nodes.push(
        <h3 key={`h3-${nodes.length}`} className="pt-2 text-lg font-semibold text-base-content">
          {renderInline(line.slice(4))}
        </h3>
      )
      return
    }

    if (line.startsWith("## ")) {
      flushList()
      nodes.push(
        <h2 key={`h2-${nodes.length}`} className="pt-2 text-xl font-semibold text-base-content">
          {renderInline(line.slice(3))}
        </h2>
      )
      return
    }

    if (line.startsWith("# ")) {
      flushList()
      nodes.push(
        <h1 key={`h1-${nodes.length}`} className="pt-2 text-2xl font-bold text-base-content">
          {renderInline(line.slice(2))}
        </h1>
      )
      return
    }

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2))
      return
    }

    flushList()

    if (line.trim()) {
      nodes.push(
        <p key={`p-${nodes.length}`} className="text-base-content/75">
          {renderInline(line)}
        </p>
      )
    }
  })

  flushList()
  flushCode()

  return <div className="space-y-4 leading-7">{nodes}</div>
}
