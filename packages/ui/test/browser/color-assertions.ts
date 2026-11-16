import { expect, type Locator } from "@playwright/test";

export async function expectColor(
  locator: Locator,
  property: string,
  expected: [number, number, number, number],
) {
  await expect
    .poll(() =>
      locator.evaluate((element, property) => {
        const context = document.createElement("canvas").getContext("2d")!;
        context.fillStyle = getComputedStyle(element).getPropertyValue(property);
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data];
      }, property),
    )
    .toEqual(expected);
}
