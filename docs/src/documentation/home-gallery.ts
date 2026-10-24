import { catalog } from "./catalog";
import { examples, loadExample } from "./examples";

const featured = ["card", "calendar", "search-and-filter"];
const items = catalog
  .filter((page) => page.section === "components" || page.section === "patterns")
  .sort((a, b) => {
    const position = (slug: string) => {
      const index = featured.indexOf(slug);
      return index < 0 ? featured.length : index;
    };
    return position(a.slug) - position(b.slug);
  })
  .map((page) => ({
    ...page,
    example:
      page.slug === "card"
        ? "card--AccountCreationForm"
        : Object.hasOwn(examples, `${page.slug}--Default`)
          ? `${page.slug}--Default`
          : Object.keys(examples).find((name) => name.startsWith(`${page.slug}--`))!,
  }));
export async function loadHomeGallery() {
  return Promise.all(
    items.map(async (page) => ({
      ...page,
      Example: (await loadExample(page.example)).default,
    })),
  );
}
export async function preloadHome() {
  await loadHomeGallery();
  return null;
}
