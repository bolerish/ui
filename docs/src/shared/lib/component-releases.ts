import uiPackage from "../../../../packages/ui/package.json" with { type: "json" };

const introducedIn = new Map([["snackbar", "0.18.0"]]);

/** Mark only components introduced in the exact current UI package release. */
export function isNewComponent(section: string, slug: string, version = uiPackage.version) {
  const introduced = section === "components" ? introducedIn.get(slug) : undefined;
  return introduced === version;
}
