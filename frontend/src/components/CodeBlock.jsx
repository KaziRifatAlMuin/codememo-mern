const keywords = {
  cpp: /\b(int|long|long long|double|bool|char|string|vector|map|unordered_map|set|unordered_set|queue|stack|priority_queue|if|else|for|while|return|void|const|auto|class|struct|public|private|include|using|namespace)\b/g,
  java: /\b(public|private|protected|class|static|void|int|long|double|boolean|char|String|ArrayList|HashMap|HashSet|Queue|Stack|if|else|for|while|return|new|null|true|false|import|package)\b/g,
  python: /\b(def|return|if|elif|else|for|while|in|import|from|class|self|True|False|None|and|or|not|lambda|with|as|try|except)\b/g,
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
      <code className="text-[0.78rem]">
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
