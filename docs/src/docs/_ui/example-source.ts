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
      const indentation = Math.min(
        ...lines
          .filter((value) => value.trim())
          .map((value) => value.length - value.trimStart().length),
      );
      blocks.push(
        lines
          .map((value) => value.slice(indentation))
          .join("\n")
          .trim(),
      );
      lines = undefined;
    } else if (lines) {
      lines.push(line);
    }
  }
  if (lines) throw new Error("Example source range has no end");
  return blocks.length ? blocks.join("\n\n") : source;
}
