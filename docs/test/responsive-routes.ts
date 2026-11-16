export function responsiveRoutes(
  available: readonly string[],
  selection?: string,
): readonly string[] {
  if (!selection) return available;
  const selected: unknown = JSON.parse(selection);
  if (
    !Array.isArray(selected) ||
    !selected.every((route): route is string => typeof route === "string")
  ) {
    throw new Error("DOCS_RESPONSIVE_ROUTES must be a JSON array of route strings");
  }
  // Removed or unrecognized routes need the full catalog and navigation checks.
  if (selected.length === 0 || selected.some((route) => !available.includes(route)))
    return available;
  return [...new Set(["/", ...selected])];
}
