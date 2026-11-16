import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { browserScope } from "./ci-scope.ts";

test("docs and lint changes omit only UI browsers; shared and unknown changes run both", () => {
  for (const file of [
    "docs/src/page.mdx",
    "packages/lint/src/index.ts",
    "packages/docs-mcp/src/index.ts",
  ]) {
    assert.deepEqual(browserScope([file]), { ui: false, docs: true, routes: [] });
  }
  for (const file of [
    "packages/ui/src/button.tsx",
    "docs/src/docs/_content/components/button/Default.tsx",
    "docs/public/fonts/example.woff2",
    "packages/tokens/src/color.ts",
    "pnpm-lock.yaml",
    ".github/workflows/verify.yml",
    "new-package/index.ts",
  ]) {
    assert.deepEqual(browserScope(["docs/src/page.mdx", file]), {
      ui: true,
      docs: true,
      routes: [],
    });
  }
});

test("repository guidance alone needs no browser jobs and cannot hide other changes", () => {
  const guidance = [
    "README.md",
    "skills/bolerish-ui/SKILL.md",
    "skills/bolerish-ui/references/source-map.md",
  ];
  assert.deepEqual(browserScope(guidance), { ui: false, docs: false, routes: [] });
  assert.deepEqual(
    browserScope([...guidance, "docs/src/docs/_content/components/button/docs.mdx"]),
    {
      ui: false,
      docs: true,
      routes: ["/docs/components/button"],
    },
  );
  for (const file of [
    "packages/ui/src/button.tsx",
    "skills/check.ts",
    "new-file.md",
    ".github/workflows/verify.yml",
  ]) {
    assert.deepEqual(browserScope([...guidance, file]), { ui: true, docs: true, routes: [] });
  }
});

test("CLI compares the PR branch with its merge base and includes deleted rename sources", () => {
  const cwd = mkdtempSync(join(tmpdir(), "bolerish-ci-scope-"));
  const git = (...args: string[]) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
  const script = fileURLToPath(new URL("./ci-scope.ts", import.meta.url));
  const run = (env: NodeJS.ProcessEnv) =>
    execFileSync(process.execPath, ["--experimental-strip-types", script], {
      cwd,
      env: { ...process.env, ...env },
      encoding: "utf8",
    });
  try {
    git("init", "-q");
    git("config", "user.email", "test@example.com");
    git("config", "user.name", "Test");
    mkdirSync(join(cwd, "docs"));
    mkdirSync(join(cwd, "packages/ui"), { recursive: true });
    writeFileSync(join(cwd, "packages/ui/example.ts"), "export {};\n");
    git("add", ".");
    git("commit", "-qm", "base");
    const base = git("rev-parse", "HEAD");
    mkdirSync(join(cwd, "docs/src/docs/_content/components/button"), { recursive: true });
    writeFileSync(join(cwd, "docs/src/docs/_content/components/button/docs.mdx"), "docs\n");
    git("add", ".");
    git("commit", "-qm", "docs");
    const head = git("rev-parse", "HEAD");
    git("checkout", "-q", "--detach", base);
    writeFileSync(join(cwd, "shared.config.json"), "{}\n");
    git("add", ".");
    git("commit", "-qm", "advance target branch");
    const advancedBase = git("rev-parse", "HEAD");
    git("checkout", "-q", "--detach", head);
    const env = { EVENT_NAME: "pull_request", BASE_SHA: advancedBase, HEAD_SHA: "HEAD" };
    assert.equal(
      run(env),
      'format_only=false\nui=false\ndocs=true\nroutes=["/docs/components/button"]\n',
    );
    assert.equal(
      run({ EVENT_NAME: "push", BASE_SHA: advancedBase, HEAD_SHA: head }),
      "format_only=false\nui=true\ndocs=true\nroutes=[]\n",
    );
    git("mv", "packages/ui/example.ts", "docs/example.md");
    git("commit", "-qm", "move UI source into docs");
    assert.equal(run(env), "format_only=false\nui=true\ndocs=true\nroutes=[]\n");
    assert.equal(
      run({ EVENT_NAME: "push", BASE_SHA: base, HEAD_SHA: head }),
      'format_only=false\nui=false\ndocs=true\nroutes=["/docs/components/button"]\n',
    );
    writeFileSync(join(cwd, ".oxfmtrc.json"), "{}\n");
    git("add", ".");
    git("commit", "-qm", "format config");
    const formatHead = git("rev-parse", "HEAD");
    const formatBase = git("rev-parse", "HEAD^");
    for (const event of ["push", "pull_request"]) {
      assert.equal(
        run({ EVENT_NAME: event, BASE_SHA: formatBase, HEAD_SHA: formatHead }),
        "format_only=true\nui=false\ndocs=false\nroutes=[]\n",
      );
    }
    assert.equal(
      run({ EVENT_NAME: "push", BASE_SHA: base, HEAD_SHA: formatHead }),
      "format_only=false\nui=true\ndocs=true\nroutes=[]\n",
    );
    assert.equal(
      run({ EVENT_NAME: "push", BASE_SHA: "0".repeat(40), HEAD_SHA: formatHead }),
      "format_only=false\nui=true\ndocs=true\nroutes=[]\n",
    );
    assert.equal(run({ EVENT_NAME: "push" }), "format_only=false\nui=true\ndocs=true\nroutes=[]\n");
    assert.equal(
      run({ EVENT_NAME: "merge_group" }),
      "format_only=false\nui=true\ndocs=true\nroutes=[]\n",
    );
    assert.equal(
      run({ EVENT_NAME: "workflow_dispatch" }),
      "format_only=false\nui=true\ndocs=true\nroutes=[]\n",
    );
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("document-only changes select their routes; shared changes override route selection", () => {
  const files = [
    "docs/src/docs/_content/components/button/docs.mdx",
    "docs/src/docs/_content/guides/installation.mdx",
    "docs/src/docs/_content/components/button/docs.mdx",
    "docs/src/docs/_content/foundations/color/docs.mdx",
    "docs/src/docs/_content/api/gradient/docs.mdx",
  ];
  assert.deepEqual(browserScope(files), {
    ui: false,
    docs: true,
    routes: [
      "/docs/api/gradient",
      "/docs/components/button",
      "/docs/foundations/color",
      "/docs/installation",
    ],
  });
  for (const file of [
    "docs/src/shared/theme.ts",
    "packages/tokens/src/color.ts",
    "docs/src/docs/_content/foundations/color/guidelines.md",
    "unknown.ts",
  ]) {
    assert.deepEqual(browserScope([...files, file]).routes, []);
  }
});
