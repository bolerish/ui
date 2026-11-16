import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const workflow = readFileSync(new URL("./metadata.yml", import.meta.url), "utf8");
const script = workflow
  .split("          script: |\n")[1]
  .split("\n")
  .map((line) => line.slice(12))
  .join("\n");
const run = new (Object.getPrototypeOf(async function () {}).constructor)(
  "context",
  "github",
  script,
);

async function execute({
  title = "fix(button): preserve focus",
  assignees = [],
  labels = [],
  issue = false,
} = {}) {
  const calls = [];
  const item = { number: 42, title, assignees, labels };
  await run(
    {
      repo: { owner: "bolerish", repo: "ui" },
      payload: { [issue ? "issue" : "pull_request"]: item },
    },
    {
      rest: {
        issues: {
          addAssignees: async (input) => calls.push(["assign", input]),
          addLabels: async (input) => calls.push(["label", input]),
        },
      },
    },
  );
  return calls;
}

test("assigns an unowned PR and labels its change type", async () => {
  assert.deepEqual(await execute(), [
    ["assign", { owner: "bolerish", repo: "ui", issue_number: 42, assignees: ["bolerish"] }],
    ["label", { owner: "bolerish", repo: "ui", issue_number: 42, labels: ["bug"] }],
  ]);
});

test("preserves existing assignees and does not duplicate labels", async () => {
  assert.deepEqual(
    await execute({ assignees: [{ login: "contributor" }], labels: [{ name: "bug" }] }),
    [],
  );
});

test("classifies features, documentation, maintenance and breaking changes", async () => {
  for (const [title, label] of [
    ["feat!: new API", "enhancement"],
    ["docs: explain setup", "documentation"],
    ["ci: speed up checks", "maintenance"],
  ]) {
    const calls = await execute({ title, assignees: [{ login: "bolerish" }] });
    assert.deepEqual(
      calls.map(([, input]) => input.labels),
      [[label]],
    );
  }
});

test("assigns issues without inferring labels from user-provided titles", async () => {
  const calls = await execute({ issue: true });
  assert.deepEqual(
    calls.map(([operation]) => operation),
    ["assign"],
  );
});

test("does not evaluate title text or guess labels for unrecognized titles", async () => {
  for (const title of [
    "Something happened",
    "constructor: surprise",
    "fix: ${process.exit(1)}",
    "$(touch /tmp/untrusted)",
  ]) {
    const calls = await execute({ title, assignees: [{ login: "bolerish" }] });
    assert.equal(calls.length, title.startsWith("fix:") ? 1 : 0);
  }
});
