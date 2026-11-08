import type { CatalogDocument } from "./catalog.js";
const phrases = [
  {
    phrases: ["저장 실패 알림", "save failure notification"],
    targets: ["components/toast", "foundations/feedback"],
  },
  {
    phrases: ["즉시 적용되는 설정", "즉시 적용 설정", "immediate setting"],
    targets: ["components/switch", "foundations/overview"],
  },
  { phrases: ["선택된 행", "selected row"], targets: ["components/table", "foundations/state"] },
];
export function searchDocuments(
  documents: readonly CatalogDocument[],
  query: string,
  section?: string,
) {
  const original = query.trim().toLowerCase().replace(/\s+/g, " ");
  let residual = original;
  const targets: string[][] = [];
  for (const mapping of phrases) {
    for (const phrase of mapping.phrases) {
      const pattern = new RegExp(`(^| )${phrase}(?= |$)`, "g");
      if (pattern.test(residual)) {
        residual = residual.replace(pattern, "$1 ");
        targets.push(mapping.targets);
      }
    }
  }
  const terms = residual.split(/\s+/).filter(Boolean);
  return documents
    .filter(
      (doc) =>
        (!section || doc.section === section) &&
        targets.every((allowed) => allowed.includes(doc.id)) &&
        terms.every((term) => `${doc.id} ${doc.title} ${doc.content}`.toLowerCase().includes(term)),
    )
    .map((doc) => {
      const exact =
        doc.id.toLowerCase() === original || doc.id.split("/").at(-1)?.toLowerCase() === original;
      const title = terms.some((term) => doc.title.toLowerCase().includes(term));
      let matchReasons: string[] = [];
      let rank = 1;
      if (exact) {
        matchReasons = ["exact"];
        rank = 3;
      } else if (targets.length) {
        matchReasons = ["keyword"];
        rank = 2;
      } else if (title) {
        matchReasons = ["title"];
        rank = 2;
      } else if (terms.length) {
        matchReasons = ["body"];
      }
      return { document: { ...doc, matchReasons }, rank };
    })
    .sort((a, b) => (original ? b.rank - a.rank || a.document.id.localeCompare(b.document.id) : 0))
    .map((result) => result.document);
}
export function relatedExamples(documents: readonly CatalogDocument[], id: string) {
  if (!id.startsWith("components/")) return [];
  return documents
    .filter((doc) => doc.section === "examples" && doc.id.startsWith(`examples/${id.slice(11)}/`))
    .map((doc) => doc.id);
}
