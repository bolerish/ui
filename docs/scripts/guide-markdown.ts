// shortcut: guides contain one-line imports, LocaleContent and fenced Markdown; use an MDX parser if they gain expressions.
export function guideMarkdown(source: string, locale: "en" | "ko") {
  let active: "en" | "ko" | null = null;
  let fenced = false;
  const lines: string[] = [];
  for (const line of source.split("\n")) {
    if (line.startsWith("```")) {
      fenced = !fenced;
    } else if (!fenced) {
      if (line.startsWith("import ")) {
        if (!line.endsWith(";")) throw new Error("Guide imports must use one line");
        continue;
      }
      if (line === '<LocaleContent locale="en">' || line === '<LocaleContent locale="ko">') {
        if (active) throw new Error("Nested guide locale blocks are unsupported");
        active = line.includes('"en"') ? "en" : "ko";
        continue;
      }
      if (line === "</LocaleContent>") {
        if (!active) throw new Error("Unexpected guide locale closing tag");
        active = null;
        continue;
      }
      if (line.trimStart().startsWith("<")) throw new Error("Guide JSX must be in a code fence");
    }
    if (!active || active === locale) lines.push(line);
  }
  if (active || fenced) throw new Error("Unclosed guide locale block or code fence");
  return `${lines.join("\n").trim()}\n`;
}
