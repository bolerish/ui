import { colorVars, radiusVars, spacingVars } from "@bolerish/tokens/semantic.stylex";

export default function PreviewContent() {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        padding: spacingVars.space4,
        display: "flex",
        flexDirection: "column",
        gap: spacingVars.space4,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: spacingVars.space4,
        }}
      >
        {[0, 1, 2].map((n) => (
          <div
            key={n}
            style={{
              aspectRatio: "16 / 9",
              borderRadius: radiusVars.lg,
              background: colorVars.bgSubtle,
            }}
          />
        ))}
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          borderRadius: radiusVars.lg,
          background: colorVars.bgSubtle,
        }}
      />
    </div>
  );
}
