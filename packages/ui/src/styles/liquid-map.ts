export function createLiquidMap(width: number, height: number, radius: number) {
  if (![width, height, radius].every(Number.isFinite) || width <= 0 || height <= 0 || radius < 0)
    throw new RangeError(
      "Liquid geometry must be finite with positive dimensions and a non-negative radius.",
    );
  const ratio = Math.min(1, 256 / Math.max(width, height));
  const mapWidth = Math.max(1, Math.round(width * ratio));
  const mapHeight = Math.max(1, Math.round(height * ratio));
  const data = new Uint8ClampedArray(mapWidth * mapHeight * 4);
  const corner = Math.min(radius, width / 2, height / 2);
  const band = Math.min(16, width / 4, height / 4);
  const distance = (x: number, y: number) => {
    const dx = Math.abs(x - width / 2) - (width / 2 - corner);
    const dy = Math.abs(y - height / 2) - (height / 2 - corner);
    return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0) - corner;
  };
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const px = ((x + 0.5) * width) / mapWidth;
      const py = ((y + 0.5) * height) / mapHeight;
      const d = distance(px, py);
      const amount = d <= 0 ? Math.max(0, 1 + d / band) ** 2 : 0;
      const nx = distance(px + 0.5, py) - distance(px - 0.5, py);
      const ny = distance(px, py + 0.5) - distance(px, py - 0.5);
      const length = Math.hypot(nx, ny) || 1;
      const index = (y * mapWidth + x) * 4;
      data[index] = Math.round(128 - (nx / length) * amount * 120);
      data[index + 1] = Math.round(128 - (ny / length) * amount * 120);
      data[index + 2] = 128;
      data[index + 3] = 255;
    }
  }
  return { width: mapWidth, height: mapHeight, data };
}
