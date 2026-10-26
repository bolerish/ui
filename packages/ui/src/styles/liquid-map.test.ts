import assert from "node:assert/strict";
import test from "node:test";

import { createLiquidMap } from "./liquid-map.ts";

test("the map bends rounded edges while leaving the reading area neutral", () => {
  const { width, data } = createLiquidMap(200, 120, 16);
  const pixel = (x: number, y: number) =>
    Array.from(data.slice((y * width + x) * 4, (y * width + x) * 4 + 4));
  assert.deepEqual(pixel(100, 60), [128, 128, 128, 255]);
  assert.ok(pixel(2, 60)[0] > 128);
  assert.ok(pixel(197, 60)[0] < 128);
  assert.ok(pixel(100, 2)[1] > 128);
  assert.ok(pixel(100, 117)[1] < 128);
  assert.ok(pixel(5, 5)[0] > 128 && pixel(5, 5)[1] > 128);
});

test("map generation has a bounded raster and validates geometry", () => {
  const map = createLiquidMap(800, 600, 24);
  assert.equal(map.width, 256);
  assert.equal(map.height, 192);
  assert.equal(map.data.length, map.width * map.height * 4);
  for (const args of [
    [0, 20, 4],
    [20, -1, 4],
    [NaN, 20, 4],
    [20, Infinity, 4],
    [20, 20, -1],
  ]) {
    assert.throws(() => createLiquidMap(...(args as [number, number, number])), RangeError);
  }
  assert.deepEqual(createLiquidMap(20, 20, 100), createLiquidMap(20, 20, 10));
});
