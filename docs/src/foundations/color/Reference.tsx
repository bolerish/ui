import { colorPaletteGroups } from "@bolerish/tokens/color-palette";
import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { DocsContext } from "@storybook/addon-docs/blocks";
import * as stylex from "@stylexjs/stylex";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { useLocale } from "../../documentation/locale";
import korean from "../../documentation/locales/reference.ko.json";
import { useColorMode } from "../../documentation/useColorMode";
import { useDocumentationGlobals } from "../../documentation/useDocumentationGlobals";
const translations: Record<string, string> = korean;
const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space10,
    marginInline: "auto",
    maxWidth: "72rem",
    padding: 0,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space4,
  },
  sectionTitle: {
    fontSize: typo.fontSizeLg,
    lineHeight: typo.lineHeightTight,
    margin: 0,
  },
  sectionDescription: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
  grid: {
    display: "grid",
    gap: spacingVars.space3,
    gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
  },
  swatch: (backgroundColor: string) => ({
    backgroundColor,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    height: "5rem",
  }),
  semanticSwatch: (backgroundColor: string, color: string) => ({
    alignItems: "flex-end",
    backgroundColor,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color,
    display: "flex",
    height: "6rem",
    padding: spacingVars.space3,
  }),
  strokeSwatch: (borderColor: string) => ({
    backgroundColor: colorVars.bgSurface,
    borderColor,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.focusRing,
    height: "6rem",
  }),
  layerBase: (backgroundColor: string) => ({ backgroundColor }),
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: typo.fontSizeXs,
    gap: spacingVars.space1,
    lineHeight: typo.lineHeightNormal,
    overflowWrap: "anywhere",
    paddingBlockStart: spacingVars.space2,
  },
  tokenName: {
    color: colorVars.fgPrimary,
    fontWeight: typo.fontWeightMedium,
  },
  usage: {
    color: colorVars.fgSecondary,
  },
  value: {
    color: colorVars.fgSecondary,
    fontFamily: "var(--bolerish-font-code)",
  },
});
type TokenCardProps = {
  children: ReactNode;
  name: string;
  usage?: string;
  value?: string;
};
function TokenCard({ children, name, usage, value }: TokenCardProps) {
  const locale = useLocale();
  return (
    <article>
      {children}
      <div {...stylex.props(styles.label)}>
        <span {...stylex.props(styles.tokenName)}>{name}</span>
        {usage ? (
          <span {...stylex.props(styles.usage)}>
            {locale === "ko" ? (translations[usage] ?? usage) : usage}
          </span>
        ) : null}
        {value ? <TokenValue token={value} /> : null}
      </div>
    </article>
  );
}
function TokenValue({ token }: { token: string }) {
  const globals = useDocumentationGlobals(useContext(DocsContext));
  const colorMode = useColorMode(globals.colorMode);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(token);
  useLayoutEffect(() => {
    const variableName = token.match(/var\((--[^,)]+)/)?.[1];
    const element = elementRef.current;
    const resolvedValue =
      variableName && element
        ? getComputedStyle(element).getPropertyValue(variableName).trim()
        : "";
    const nextValue = resolvedValue || token;
    setValue((currentValue) => (currentValue === nextValue ? currentValue : nextValue));
  }, [token, colorMode]);
  return (
    <span ref={elementRef} {...stylex.props(styles.value)}>
      {value}
    </span>
  );
}
function Section({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  const locale = useLocale();
  return (
    <section {...stylex.props(styles.section)}>
      <div>
        <h4 {...stylex.props(styles.sectionTitle)}>
          {locale === "ko" ? (translations[title] ?? title) : title}
        </h4>
        {description ? (
          <p {...stylex.props(styles.sectionDescription)}>
            {locale === "ko" ? (translations[description] ?? description) : description}
          </p>
        ) : null}
      </div>
      <div {...stylex.props(styles.grid)}>{children}</div>
    </section>
  );
}
export function Primitive() {
  return (
    <div {...stylex.props(styles.page)}>
      {Object.entries(colorPaletteGroups).map(([family, colors]) => (
        <Section key={family} title={family}>
          {Object.entries(colors).map(([step, value]) => (
            <TokenCard key={step} name={`${family}.${step}`} value={value}>
              <div {...stylex.props(styles.swatch(value))} />
            </TokenCard>
          ))}
        </Section>
      ))}
    </div>
  );
}
const backgroundTokens = [
  ["bgSelected", colorVars.bgSelected, colorVars.fgPrimary, "Flat persistent selection"],
  ["bgDropTarget", colorVars.bgDropTarget, colorVars.fgPrimary, "Drop receiving area"],
  ["bgInverse", colorVars.bgInverse, colorVars.fgInverse, "Inverse surface"],
  ["bgOverlay", colorVars.bgOverlay, colorVars.fgPrimary, "Modal backdrop"],
  ["bgCanvas", colorVars.bgCanvas, colorVars.fgPrimary, "Lowest screen background"],
  ["bgSurface", colorVars.bgSurface, colorVars.fgPrimary, "Default content background"],
  ["bgSurfacePressed", colorVars.bgSurfacePressed, colorVars.fgPrimary, "Pressed default surface"],
  ["bgSubtle", colorVars.bgSubtle, colorVars.fgPrimary, "Grouping and subtle fills"],
  ["bgRaised", colorVars.bgRaised, colorVars.fgPrimary, "Floating content background"],
  ["bgRaisedPressed", colorVars.bgRaisedPressed, colorVars.fgPrimary, "Pressed floating surface"],
  ["bgCurrent", colorVars.bgCurrent, colorVars.fgPrimary, "Current item indicator"],
  ["bgSkeleton", colorVars.bgSkeleton, colorVars.fgPrimary, "Loading placeholder"],
  [
    "bgActionPrimary",
    colorVars.bgActionPrimary,
    colorVars.fgOnActionPrimary,
    "Primary action background",
  ],
  [
    "bgActionPrimaryHover",
    colorVars.bgActionPrimaryHover,
    colorVars.fgOnActionPrimary,
    "Primary action hover",
  ],
  [
    "bgActionDestructive",
    colorVars.bgActionDestructive,
    colorVars.fgOnActionDestructive,
    "Destructive action background",
  ],
  ["bgFeedbackInfo", colorVars.bgFeedbackInfo, colorVars.fgFeedbackInfo, "Info message background"],
  [
    "bgFeedbackSuccess",
    colorVars.bgFeedbackSuccess,
    colorVars.fgFeedbackSuccess,
    "Success message background",
  ],
  [
    "bgFeedbackWarning",
    colorVars.bgFeedbackWarning,
    colorVars.fgFeedbackWarning,
    "Warning message background",
  ],
  [
    "bgFeedbackError",
    colorVars.bgFeedbackError,
    colorVars.fgFeedbackError,
    "Error message background",
  ],
] as const;
const foregroundTokens = [
  ["fgPrimary", colorVars.fgPrimary, colorVars.bgSurface, "Primary text and icons"],
  ["fgSecondary", colorVars.fgSecondary, colorVars.bgSurface, "Secondary text and icons"],
  ["fgTertiary", colorVars.fgTertiary, colorVars.bgSurface, "Placeholders and subtle information"],
  ["fgDisabled", colorVars.fgDisabled, colorVars.bgSurface, "Disabled content"],
  ["fgInverse", colorVars.fgInverse, colorVars.bgInverse, "Content on emphasized backgrounds"],
  [
    "fgOnActionPrimary",
    colorVars.fgOnActionPrimary,
    colorVars.bgActionPrimary,
    "Content on the primary action background",
  ],
  [
    "fgOnActionDestructive",
    colorVars.fgOnActionDestructive,
    colorVars.bgActionDestructive,
    "Content on destructive actions",
  ],
  ["fgAction", colorVars.fgAction, colorVars.bgSurface, "Actions and links"],
  ["fgFeedbackInfo", colorVars.fgFeedbackInfo, colorVars.bgFeedbackInfo, "Info message content"],
  [
    "fgFeedbackSuccess",
    colorVars.fgFeedbackSuccess,
    colorVars.bgFeedbackSuccess,
    "Success message content",
  ],
  [
    "fgFeedbackWarning",
    colorVars.fgFeedbackWarning,
    colorVars.bgFeedbackWarning,
    "Warning message content",
  ],
  [
    "fgFeedbackError",
    colorVars.fgFeedbackError,
    colorVars.bgFeedbackError,
    "Error message content",
  ],
] as const;
const strokeTokens = [
  ["strokeDropIndicator", colorVars.strokeDropIndicator, "Exact drop insertion position"],
  ["strokeDefault", colorVars.strokeDefault, "Default separator"],
  ["strokeStrong", colorVars.strokeStrong, "Emphasized separator"],
  ["strokeControl", colorVars.strokeControl, "Essential control boundary"],
  ["strokeFocus", colorVars.strokeFocus, "Focus ring"],
  ["strokeAction", colorVars.strokeAction, "Primary action border"],
  ["strokeFeedbackInfo", colorVars.strokeFeedbackInfo, "Info message border"],
  ["strokeFeedbackSuccess", colorVars.strokeFeedbackSuccess, "Success message border"],
  ["strokeFeedbackWarning", colorVars.strokeFeedbackWarning, "Warning message border"],
  ["strokeFeedbackError", colorVars.strokeFeedbackError, "Error message border"],
] as const;
const interactionTokens = [
  ["interactionDefault", colorVars.interactionDefault, colorVars.fgPrimary, "Default state"],
  ["interactionHover", colorVars.interactionHover, colorVars.fgPrimary, "Pointer hover state"],
  ["interactionPressed", colorVars.interactionPressed, colorVars.fgPrimary, "Pressed state"],
  [
    "interactionSolidHover",
    colorVars.interactionSolidHover,
    colorVars.fgPrimary,
    "Pointer hover state on filled surfaces",
  ],
  [
    "interactionSolidPressed",
    colorVars.interactionSolidPressed,
    colorVars.fgPrimary,
    "Pressed state on filled surfaces",
  ],
  [
    "interactionSelected",
    colorVars.interactionSelected,
    colorVars.fgPrimary,
    "Raised selection inside a group",
  ],
  ["interactionDisabled", colorVars.interactionDisabled, colorVars.fgPrimary, "Unavailable state"],
  [
    "interactionFocus",
    colorVars.interactionFocus,
    colorVars.fgOnActionPrimary,
    "Keyboard focus state",
  ],
] as const;
export function Semantic() {
  return (
    <div {...stylex.props(styles.page)}>
      <Section title="Background" description="Used for layers and message backgrounds.">
        {backgroundTokens.map(([name, token, foreground, usage]) => (
          <TokenCard key={name} name={name} usage={usage} value={token}>
            <div {...stylex.props(styles.semanticSwatch(token, foreground))}>Aa Bb</div>
          </TokenCard>
        ))}
      </Section>
      <Section title="Foreground" description="Used for text and icons.">
        {foregroundTokens.map(([name, token, background, usage]) => (
          <TokenCard key={name} name={name} usage={usage} value={token}>
            <div {...stylex.props(styles.semanticSwatch(background, token))}>Aa Bb</div>
          </TokenCard>
        ))}
      </Section>
      <Section title="Stroke" description="Indicates boundaries and focus.">
        {strokeTokens.map(([name, token, usage]) => (
          <TokenCard key={name} name={name} usage={usage} value={token}>
            <div {...stylex.props(styles.strokeSwatch(token))} />
          </TokenCard>
        ))}
      </Section>
      <Interaction />
    </div>
  );
}

export function Interaction() {
  return (
    <Section title="Interaction" description="Layers transient states caused by interaction.">
      {interactionTokens.map(([name, token, foreground, usage]) => (
        <TokenCard key={name} name={name} usage={usage} value={token}>
          <div
            {...stylex.props(
              styles.layerBase(
                name.startsWith("interactionSolid")
                  ? colorVars.bgActionPrimary
                  : colorVars.bgSurface,
              ),
            )}
          >
            <div {...stylex.props(styles.semanticSwatch(token, foreground))} />
          </div>
        </TokenCard>
      ))}
    </Section>
  );
}

export function FeedbackColors() {
  return (
    <div {...stylex.props(styles.page)}>
      <Section title="Background">
        {backgroundTokens
          .filter(([name]) => name.startsWith("bgFeedback"))
          .map(([name, token, foreground, usage]) => (
            <TokenCard key={name} name={name} usage={usage} value={token}>
              <div {...stylex.props(styles.semanticSwatch(token, foreground))}>Aa Bb</div>
            </TokenCard>
          ))}
      </Section>
      <Section title="Foreground">
        {foregroundTokens
          .filter(([name]) => name.startsWith("fgFeedback"))
          .map(([name, token, background, usage]) => (
            <TokenCard key={name} name={name} usage={usage} value={token}>
              <div {...stylex.props(styles.semanticSwatch(background, token))}>Aa Bb</div>
            </TokenCard>
          ))}
      </Section>
      <Section title="Stroke">
        {strokeTokens
          .filter(([name]) => name.startsWith("strokeFeedback"))
          .map(([name, token, usage]) => (
            <TokenCard key={name} name={name} usage={usage} value={token}>
              <div {...stylex.props(styles.strokeSwatch(token))} />
            </TokenCard>
          ))}
      </Section>
    </div>
  );
}
