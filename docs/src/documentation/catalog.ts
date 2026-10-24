import foundations from "../foundations/order.json";
import patterns from "../patterns/order.json";
const components = import.meta.glob("../components/*/docs.mdx");
export const catalog = [
  { section: "guide", slug: "getting-started", title: "Introduction" },
  { section: "guide", slug: "installation", title: "Installation" },
  { section: "guide", slug: "theming", title: "Theming" },
  { section: "guide", slug: "styling", title: "Styling" },
  { section: "guide", slug: "changelog", title: "Changelog" },
  ...foundations.map((item) => ({ ...item, section: "foundations" })),
  ...patterns.map((item) => ({ ...item, section: "patterns" })),
  ...Object.keys(components)
    .sort()
    .map((path) => {
      const slug = path.split("/")[2];
      return {
        section: "components",
        slug,
        title: slug
          .split("-")
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(" "),
      };
    }),
];
export function findDocument(section: string, slug: string) {
  return catalog.find((item) => item.section === section && item.slug === slug);
}
