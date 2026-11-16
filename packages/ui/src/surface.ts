export type SurfaceOptions = {
  mode: "solid" | "glass";
};

export type SurfaceProps = {
  "data-bolerish-surface": SurfaceOptions["mode"];
};

function props({ mode }: SurfaceOptions): SurfaceProps {
  if (mode !== "solid" && mode !== "glass") {
    throw new TypeError('surface.props requires mode "solid" or "glass".');
  }
  return { "data-bolerish-surface": mode };
}

/** Selects the shared material without replacing an element's className or style. */
export const surface = { props };
