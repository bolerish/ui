import assert from "node:assert/strict";
import test from "node:test";

import worker from "./worker.ts";

test("production aliases redirect permanently and preserve the path and query", async () => {
  for (const origin of [
    "http://ui.bolerish.com",
    "http://bolerish-docs.myjeong19.workers.dev",
    "https://bolerish-docs.myjeong19.workers.dev",
  ]) {
    for (const path of ["/", "/docs/components/button/ko?colorMode=dark&density=compact"]) {
      const response = await worker.fetch(new Request(`${origin}${path}`), {
        ASSETS: { fetch: async () => assert.fail("Aliases must not serve duplicate assets") },
      });
      assert.equal(response.status, 308);
      assert.equal(response.headers.get("location"), `https://ui.bolerish.com${path}`);
    }
  }
});

test("canonical, development and unrelated hosts pass the original request to assets", async () => {
  for (const origin of [
    "https://ui.bolerish.com",
    "http://127.0.0.1:3005",
    "http://localhost:3000",
    "https://ui.bolerish.com.example.org",
  ]) {
    const request = new Request(`${origin}/unknown?test=1`);
    const response = new Response("Not found", { status: 404 });
    const result = await worker.fetch(request, {
      ASSETS: {
        fetch: async (received) => {
          assert.equal(received, request);
          return response;
        },
      },
    });
    assert.equal(result, response);
  }
});
