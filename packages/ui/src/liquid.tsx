"use client";

import { colorVars, radiusVars, typo } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from "react";

import { createLiquidMap } from "./styles/liquid-map";
import { mergeStyles, type StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  root: {
    borderRadius: radiusVars.md,
    color: colorVars.fgPrimary,
    fontFamily: typo.fontFamilyBody,
    isolation: "isolate",
    minWidth: 0,
    position: "relative",
  },
  background: {
    borderRadius: "inherit",
    display: "var(--bolerish-liquid-display, none)",
    inset: 0,
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
    "@media (prefers-reduced-transparency: reduce)": { display: "none" },
    "@media (forced-colors: active)": { display: "none" },
  },
  tint: {
    "--bolerish-material-opacity": "var(--bolerish-liquid-opacity, 100%)",
    "--bolerish-material-filter": "none",
    "--bolerish-surface-reflection": "var(--bolerish-liquid-reflection, 0 0 transparent)",
    borderRadius: "inherit",
    inset: 0,
    pointerEvents: "none",
    position: "absolute",
  },
  content: { position: "relative" },
  definitions: { position: "absolute", pointerEvents: "none" },
});

export type LiquidProps = StyledProps<ComponentProps<"div">> & {
  /** A decorative background owned by this liquid, not a snapshot of the page. */
  background: ReactNode;
  xstyle?: stylex.StyleXStyles;
};

/** Refracts an explicit decorative background while foreground controls remain sharp. */
export function Liquid({ background, children, className, style, xstyle, ...props }: LiquidProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const [map, setMap] = useState<{ url: string; revision: number }>();
  useEffect(() => {
    const element = backgroundRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    let revision = 0;
    let frame = 0;
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { width, height } = entry.contentRect;
        // shortcut: large SVG sources vary across WebKit versions; use the plain material above 1024px.
        if (!width || !height || width > 1024 || height > 1024) {
          setMap(undefined);
          return;
        }
        try {
          const value = getComputedStyle(element).borderTopLeftRadius;
          const radius =
            (parseFloat(value) || 0) * (value.endsWith("%") ? Math.min(width, height) / 100 : 1);
          const pixels = createLiquidMap(width, height, radius);
          const canvas = document.createElement("canvas");
          canvas.width = pixels.width;
          canvas.height = pixels.height;
          const context = canvas.getContext("2d");
          if (!context) {
            setMap(undefined);
            return;
          }
          context.putImageData(new ImageData(pixels.data, pixels.width, pixels.height), 0, 0);
          // WebKit caches filter output by ID; resized lenses need a fresh ID.
          setMap({ url: canvas.toDataURL(), revision: ++revision });
        } catch {
          setMap(undefined);
        }
      });
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  const filterId = `${id}-liquid-${map?.revision ?? 0}`;
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}>
      <div
        {...stylex.props(styles.background)}
        ref={backgroundRef}
        aria-hidden="true"
        inert
        style={map ? { filter: `url(#${filterId})` } : undefined}
      >
        {background}
      </div>
      <div aria-hidden="true" {...stylex.props(surfaceStyles.panel, styles.tint)} />
      <div {...stylex.props(styles.content)}>{children}</div>
      <svg
        {...stylex.props(styles.definitions)}
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {map ? (
            <filter
              id={filterId}
              x="0"
              y="0"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={map.url}
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="map"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale="12"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          ) : null}
        </defs>
      </svg>
    </div>
  );
}
