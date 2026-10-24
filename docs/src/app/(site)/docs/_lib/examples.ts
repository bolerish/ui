import { lazy, type ComponentType } from "react";
const modules = import.meta.glob<{ default: ComponentType }>([
  "../_content/components/*/*.tsx",
  "../_content/patterns/*/*.tsx",
  "../_content/foundations/*/*Example.tsx",
]);
const loaders = Object.fromEntries(
  Object.entries(modules).map(([path, load]) => [
    path.split("/").slice(-2).join("--").replace(".tsx", ""),
    load,
  ]),
);
export const loadedExamples: Record<string, ComponentType> = {};
const pending: Record<string, Promise<{ default: ComponentType }>> = {};
export async function loadExample(name: string) {
  try {
    const module = await (pending[name] ??= loaders[name]());
    loadedExamples[name] = module.default;
    return module;
  } catch (error) {
    delete pending[name];
    throw error;
  }
}
export const examples = Object.fromEntries(
  Object.keys(loaders).map((name) => [name, lazy(() => loadExample(name))]),
);
export async function preloadExamples(slug: string) {
  await Promise.all(
    Object.keys(loaders)
      .filter((name) => name.startsWith(`${slug}--`))
      .map(loadExample),
  );
}
