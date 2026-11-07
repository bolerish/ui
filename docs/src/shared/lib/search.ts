export type SearchDocument = {
  section: string;
  slug: string;
  title: string;
  text: string;
  isNew?: boolean;
};

export function searchText(markdown: string) {
  return markdown
    .replace(/```[^\n]*\n[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*`|>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchDocuments(documents: SearchDocument[], query: string) {
  const { terms, newOnly } = parseSearchQuery(query);
  return documents
    .filter((item) => {
      const text = `${item.title} ${item.text}`.toLocaleLowerCase();
      return (!newOnly || item.isNew === true) && terms.every((term) => text.includes(term));
    })
    .map((item) => {
      const position = terms.length ? item.text.toLocaleLowerCase().indexOf(terms[0]) : -1;
      const start = position > 60 ? position - 60 : 0;
      const excerpt = item.text.slice(start, start + 240);
      return {
        ...item,
        description: `${start ? "…" : ""}${excerpt}${start + 240 < item.text.length ? "…" : ""}`,
      };
    });
}

export function parseSearchQuery(query: string) {
  const tokens = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return { terms: tokens.filter((term) => term !== "#new"), newOnly: tokens.includes("#new") };
}
