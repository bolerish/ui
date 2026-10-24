import { catalog } from "@/app/(site)/docs/_lib/catalog";
import { examples, loadExample } from "@/app/(site)/docs/_lib/examples";

const featured = ["card", "calendar"];
const items = catalog
  .filter((page) => page.section === "components")
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
let gallery: Awaited<ReturnType<typeof loadHomeGallery>> | undefined;
let failure: { reason: unknown } | undefined;

export function getHomeGallery() {
  if (failure) throw failure.reason;
  if (!gallery) throw new Error("Home gallery must be preloaded before rendering.");
  return gallery;
}

export async function preloadHome() {
  try {
    gallery = await loadHomeGallery();
    failure = undefined;
  } catch (reason) {
    failure = { reason };
    throw reason;
  }
  return null;
}
