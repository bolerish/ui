// shortcut: guides contain one-line imports, LocaleContent and fenced Markdown; use an MDX parser if they gain expressions or raw HTML.
export function guideMarkdown(source: string, locale: "en" | "ko", filename: string) {
  let active: "en" | "ko" | null = null;
  let fence: { marker: string; length: number } | null = null;
  const lines: string[] = [];
  const sourceLines = source.replace(/\r\n/g, "\n").split("\n");
  const fail = (index: number, message: string): never => {
    throw new Error(`${filename}:${index + 1}: ${message}: ${sourceLines[index]?.trim() ?? ""}`);
  };
  for (const [index, line] of sourceLines.entries()) {
    const trimmed = line.trim();
    const marker = /^(`{3,}|~{3,})(.*)$/.exec(trimmed);
    if (fence) {
      if (
        marker &&
        marker[1][0] === fence.marker &&
        marker[1].length >= fence.length &&
        !marker[2].trim()
      )
        fence = null;
    } else if (marker) {
      fence = { marker: marker[1][0], length: marker[1].length };
    } else {
      if (trimmed.startsWith("import ")) {
        if (!trimmed.endsWith(";")) fail(index, "Guide imports must use one line");
        continue;
      }
      const opening = /^<LocaleContent\s+locale=(["'])(en|ko)\1\s*>$/.exec(trimmed);
      if (opening) {
        if (active) fail(index, "Nested guide locale blocks are unsupported");
        active = opening[2] as "en" | "ko";
        continue;
      }
      if (trimmed === "</LocaleContent>") {
        if (!active) fail(index, "Unexpected guide locale closing tag");
        active = null;
        continue;
      }
      if (trimmed.startsWith("<")) fail(index, "Guide JSX or HTML must be in a code fence");
    }
    if (!active || active === locale) lines.push(line);
  }
  if (active || fence) fail(sourceLines.length - 1, "Unclosed guide locale block or code fence");
  return `${lines.join("\n").trim()}\n`;
}
