/** Select explicitly marked ranges from the executable example's raw source. */
export function getExampleSource(source: string) {
  const blocks: string[] = [];
  let lines: string[] | undefined;
  for (const line of source.split("\n")) {
    const marker = line.trim();
    if (marker === "/* @example-start */" || marker === "{/* @example-start */}") {
      if (lines) throw new Error("Nested example source range");
      lines = [];
    } else if (marker === "/* @example-end */" || marker === "{/* @example-end */}") {
      if (!lines) throw new Error("Example source range has no start");
      blocks.push(lines.join("\n"));
      lines = undefined;
    } else if (lines) {
      lines.push(line);
    }
  }
  if (lines) throw new Error("Example source range has no end");
  if (!blocks.length) return source;
  if (!source.includes("/* @example-preserve-indent */"))
    return blocks
      .map((block) => {
        const lines = block.split("\n");
        const indent = Math.min(
          ...lines
            .filter((line) => line.trim())
            .map((line) => line.length - line.trimStart().length),
        );
        return lines
          .map((line) => line.slice(indent))
          .join("\n")
          .trim();
      })
      .join("\n\n");
  const selected = blocks.join("\n").split("\n");
  const indentation = Math.min(
    ...selected.filter((line) => line.trim()).map((line) => line.length - line.trimStart().length),
  );
  return selected
    .map((line) => line.slice(indentation))
    .join("\n")
    .trim();
}
