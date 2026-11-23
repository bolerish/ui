import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

test("packed exports render without a consumer StyleX compiler and expose server catalog", (t) => {
  const consumer = mkdtempSync(join(tmpdir(), "bolerish-json-consumer-"));
  t.after(() => rmSync(consumer, { recursive: true, force: true }));
  execFileSync("pnpm", ["pack", "--pack-destination", consumer], {
    cwd: import.meta.dirname,
    stdio: "pipe",
  });
  const archive = readdirSync(consumer).find((name) => name.endsWith(".tgz"));
  assert.ok(archive);
  const target = join(consumer, "node_modules/@bolerish/json-render");
  mkdirSync(target, { recursive: true });
  execFileSync("tar", ["-xzf", join(consumer, archive), "--strip-components=1", "-C", target]);
  for (const name of [
    "@bolerish/ui",
    "@json-render/core",
    "@json-render/react",
    "react",
    "react-dom",
    "zod",
  ]) {
    const destination = join(consumer, "node_modules", name);
    mkdirSync(resolve(destination, ".."), { recursive: true });
    symlinkSync(resolve(import.meta.dirname, "node_modules", name), destination, "dir");
  }
  writeFileSync(
    join(consumer, "check.mjs"),
    `
    import assert from 'node:assert/strict';
    import {createElement as h} from 'react';
    import {renderToString} from 'react-dom/server';
    import {bolerishRegistry} from '@bolerish/json-render';
    import {bolerishCatalog, parseBolerishSpec} from '@bolerish/json-render/catalog';
    import {JSONUIProvider, Renderer} from '@json-render/react';
    const spec = parseBolerishSpec({root:'text',elements:{text:{type:'Paragraph',props:{text:'Packed consumer'}}}}, {});
    const html = renderToString(h(JSONUIProvider,{registry:bolerishRegistry},h(Renderer,{registry:bolerishRegistry,spec})));
    assert.match(html, /Packed consumer/);
    assert.match(html, /class=/);
    assert.match(bolerishCatalog.prompt(), /Button/);
  `,
  );
  execFileSync(process.execPath, ["check.mjs"], { cwd: consumer, stdio: "pipe" });
  execFileSync(
    process.execPath,
    [
      "--conditions=react-server",
      "--input-type=module",
      "-e",
      "import {bolerishCatalog} from '@bolerish/json-render/catalog'; if (!bolerishCatalog.prompt()) process.exit(1)",
    ],
    { cwd: consumer, stdio: "pipe" },
  );
});
