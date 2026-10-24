import foundations from "@/app/(site)/docs/_content/foundations/order.json";
const components = import.meta.glob("../_content/components/*/docs.mdx");
export const catalog = [
  { section: "guide", slug: "getting-started", title: "Introduction" },
  { section: "guide", slug: "installation", title: "Installation" },
  { section: "guide", slug: "theming", title: "Theming" },
  { section: "guide", slug: "styling", title: "Styling" },
  { section: "guide", slug: "lint", title: "Lint" },
  { section: "guide", slug: "changelog", title: "Changelog" },
  ...foundations.map((item) => ({ ...item, section: "foundations" })),
  ...Object.keys(components)
    .sort()
    .map((path) => {
      const slug = path.split("/").at(-2)!;
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
