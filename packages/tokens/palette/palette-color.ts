// OKLCH → linear sRGB, following CSS Color 4 color conversions.
// https://www.w3.org/TR/css-color-4/#color-conversion-code
export function oklchToHex(value: unknown) {
  const match =
    typeof value === "string" &&
    value.match(/^oklch\(([\d.]+)% ([\d.]+) ([\d.]+)(?: \/ ([\d.]+)%)?\)$/);
  if (!match) throw new Error(`Expected an OKLCH color: ${value}`);
  const [lightness, chroma, hue, alpha] = [
    Number(match[1]) / 100,
    Number(match[2]),
    Number(match[3]),
    Number(match[4] ?? 100) / 100,
  ];
  if (
    ![lightness, chroma, hue, alpha].every(Number.isFinite) ||
    lightness < 0 ||
    lightness > 1 ||
    chroma < 0 ||
    hue < 0 ||
    hue > 360 ||
    alpha < 0 ||
    alpha > 1
  ) {
    throw new Error(`Invalid OKLCH coordinates: ${value}`);
  }
  const a = chroma * Math.cos((hue * Math.PI) / 180);
  const b = chroma * Math.sin((hue * Math.PI) / 180);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  // Allow rounding at the sRGB boundary in existing four-decimal chroma values.
  if (linear.some((channel) => channel < -0.0002 || channel > 1.0002)) {
    throw new Error(`Color is outside sRGB; reduce chroma before generating: ${value}`);
  }
  const channels = linear.map((channel) =>
    Math.max(
      0,
      Math.min(1, channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055),
    ),
  );
  if (alpha !== 1) channels.push(alpha);
  return `#${channels
    .map((channel) =>
      Math.round(channel * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase()}`;
}
