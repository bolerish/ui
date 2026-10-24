import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";
import { createContext, SourceTextModule, SyntheticModule } from "node:vm";

test("the gallery retains resolved components when the example cache is replaced", async () => {
  const context = createContext({});
  const names = ["other--Default", "calendar--Default", "card--AccountCreationForm"];
  const cache: Record<string, () => string> = {};
  const calls: string[] = [];
  const catalog = new SyntheticModule(
    ["catalog"],
    function () {
      this.setExport("catalog", [
        { section: "components", slug: "other", title: "Other" },
        { section: "components", slug: "calendar", title: "Calendar" },
        { section: "components", slug: "card", title: "Card" },
        { section: "guide", slug: "installation", title: "Installation" },
      ]);
    },
    { context },
  );
  const examples = new SyntheticModule(
    ["examples", "loadExample"],
    function () {
      this.setExport("examples", Object.fromEntries(names.map((name) => [name, () => name])));
      this.setExport("loadExample", async (name: string) => {
        calls.push(name);
        const component = () => name;
        cache[name] = component;
        return { default: component };
      });
    },
    { context },
  );
  const source = await readFile(new URL("./home-gallery.ts", import.meta.url), "utf8");
  const module = new SourceTextModule(stripTypeScriptTypes(source), { context });
  await module.link((specifier) => (specifier.endsWith("/catalog") ? catalog : examples));
  await module.evaluate();
  const { loadHomeGallery, getHomeGallery, preloadHome } = module.namespace as {
    loadHomeGallery(): Promise<Array<{ slug: string; Example: () => string }>>;
    getHomeGallery(): Array<{ slug: string; Example: () => string }>;
    preloadHome(): Promise<null>;
  };

  assert.throws(getHomeGallery, /must be preloaded/);

  const gallery = await loadHomeGallery();
  assert.deepEqual(
    Array.from(gallery, (item) => item.slug),
    ["card", "calendar", "other"],
  );
  assert.deepEqual(calls, ["card--AccountCreationForm", "calendar--Default", "other--Default"]);
  for (const key of Object.keys(cache)) delete cache[key];
  for (const item of gallery) assert.equal(typeof item.Example, "function");
  assert.deepEqual(
    Array.from(gallery, (item) => item.Example()),
    ["card--AccountCreationForm", "calendar--Default", "other--Default"],
  );
  assert.equal(await preloadHome(), null);
  const prepared = getHomeGallery();
  for (const key of Object.keys(cache)) delete cache[key];
  assert.equal(getHomeGallery(), prepared);
  assert.deepEqual(
    Array.from(prepared, (item) => item.Example()),
    ["card--AccountCreationForm", "calendar--Default", "other--Default"],
  );
});
