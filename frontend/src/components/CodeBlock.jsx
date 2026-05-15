const keywords = {
  cpp: /\b(int|long|double|bool|char|string|vector|map|set|if|else|for|while|return|void|const|auto|class|struct|public|private)\b/g,
  python: /\b(def|return|if|elif|else|for|while|in|import|from|class|self|True|False|None|and|or|not)\b/g,
  javascript: /\b(const|let|var|function|return|if|else|for|while|class|import|export|async|await|new|true|false|null)\b/g,
}

function highlightLine(line, language) {
  const matcher = keywords[language] || keywords.cpp
  const parts = []
  let lastIndex = 0

  line.replace(matcher, (match, _keyword, offset) => {
    if (offset > lastIndex) parts.push(line.slice(lastIndex, offset))
    parts.push(
      <span key={`${match}-${offset}`} className="text-primary">
        {match}
      </span>
    )
    lastIndex = offset + match.length
    return match
  })

  if (lastIndex < line.length) parts.push(line.slice(lastIndex))
  return parts.length ? parts : line
}

export default function CodeBlock({ code, language }) {
  return (
    <pre>
      <code>
        {(code || "").split("\n").map((line, index) => (
          <span key={index} className="block">
            <span className="mr-4 select-none text-base-content/25">
              {String(index + 1).padStart(2, "0")}
            </span>
            {highlightLine(line, language)}
          </span>
        ))}
      </code>
    </pre>
  )
}
