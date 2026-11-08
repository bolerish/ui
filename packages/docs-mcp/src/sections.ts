export function getSections(content: string) {
  const sections: { id: string; title: string; level: number; start: number; end: number }[] = [];
  const used = new Set<string>();
  let fence: { marker: string; length: number } | undefined;
  let start = 0;
  for (const line of content.split(/(?<=\n)/)) {
    const marker = /^ {0,3}(`{3,}|~{3,})(.*)/.exec(line);
    if (fence) {
      if (
        marker &&
        marker[1][0] === fence.marker &&
        marker[1].length >= fence.length &&
        !marker[2].trim()
      )
        fence = undefined;
    } else if (marker) {
      fence = { marker: marker[1][0], length: marker[1].length };
    } else {
      const heading = /^ {0,3}(#{1,6})\s+(.+?)\s*$/.exec(line.trimEnd());
      if (heading) {
        const title = heading[2].replace(/\s+#+\s*$/, "");
        const base =
          title
            .toLowerCase()
            .replace(/[^\p{L}\p{N} -]/gu, "")
            .trim()
            .replace(/\s+/g, "-") || "section";
        let id = base;
        let count = 1;
        while (used.has(id)) id = `${base}-${++count}`;
        used.add(id);
        sections.push({ id, title, level: heading[1].length, start, end: content.length });
      }
    }
    start += line.length;
  }
  for (let i = 0; i < sections.length; i++) {
    const next = sections.slice(i + 1).find((section) => section.level <= sections[i].level);
    if (next) sections[i].end = next.start;
  }
  return sections;
}
