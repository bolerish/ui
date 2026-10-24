import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { AccordionTrigger } from "./dist/accordion.js";
import type { Avatar } from "./dist/avatar.js";
import type { Badge } from "./dist/badge.js";
import type { BannerProps } from "./dist/banner.js";
import type { Button } from "./dist/button.js";
import type { Calendar } from "./dist/calendar.js";
import type { Card } from "./dist/card.js";
import type { Carousel } from "./dist/carousel.js";
import type { Checkbox } from "./dist/checkbox.js";
import { gradient } from "./dist/gradient.js";
// @ts-expect-error ContentRow types were removed with the public rename.
import type { ContentRowProps } from "./dist/index.js";
import type { InputGroupButton } from "./dist/input-group.js";
import type { InputOTP } from "./dist/input-otp.js";
import type { Input } from "./dist/input.js";
import type { Item } from "./dist/item.js";
import type { Kbd } from "./dist/kbd.js";
import type { Label } from "./dist/label.js";
import type { Link } from "./dist/link.js";
import type { NativeSelect } from "./dist/native-select.js";
import type { Progress } from "./dist/progress.js";
import type { SelectTrigger } from "./dist/select.js";
import type { Slider } from "./dist/slider.js";
import type { Spinner } from "./dist/spinner.js";
import type { Switch } from "./dist/switch.js";
import type { Table } from "./dist/table.js";
import type { Textarea } from "./dist/textarea.js";
import type { Timeline, TimelineItem } from "./dist/timeline.js";
import type { ToggleGroupItem } from "./dist/toggle-group.js";
import type { Toggle } from "./dist/toggle.js";

type Assert<Value extends true> = Value;
export type ItemContract = Assert<HasStylingProps<ComponentProps<typeof Item>>>;
export type RemovedContentRowContract = ContentRowProps;
type HasStylingProps<Props> = "className" | "style" extends keyof Props ? true : false;
type HasXstyle<Props> = "xstyle" extends keyof Props ? true : false;
export type ButtonContract = Assert<HasStylingProps<ComponentProps<typeof Button>>>;
export type CardContract = Assert<HasStylingProps<ComponentProps<typeof Card>>>;
export type AccordionContract = Assert<HasStylingProps<ComponentProps<typeof AccordionTrigger>>>;
export type SelectContract = Assert<HasStylingProps<ComponentProps<typeof SelectTrigger>>>;
export type ToggleGroupContract = Assert<HasStylingProps<ComponentProps<typeof ToggleGroupItem>>>;
export type InputContract = Assert<HasStylingProps<ComponentProps<typeof Input>>>;
export type TableContract = Assert<HasStylingProps<ComponentProps<typeof Table>>>;
export type CarouselContract = Assert<HasStylingProps<ComponentProps<typeof Carousel>>>;
export type CalendarContract = Assert<HasStylingProps<ComponentProps<typeof Calendar>>>;
export type BannerContract = Assert<HasStylingProps<BannerProps>>;
export type LabelContract = Assert<HasXstyle<ComponentProps<typeof Label>>>;
export type BadgeContract = Assert<HasXstyle<ComponentProps<typeof Badge>>>;
export type KbdContract = Assert<HasXstyle<ComponentProps<typeof Kbd>>>;
export type SpinnerContract = Assert<HasXstyle<ComponentProps<typeof Spinner>>>;
export type AvatarContract = Assert<HasXstyle<ComponentProps<typeof Avatar>>>;
export type LinkContract = Assert<HasXstyle<ComponentProps<typeof Link>>>;
export type AvatarStylingContract = Assert<HasStylingProps<ComponentProps<typeof Avatar>>>;
export type LinkStylingContract = Assert<HasStylingProps<ComponentProps<typeof Link>>>;
export type TimelineContract = Assert<HasStylingProps<ComponentProps<typeof Timeline>>>;
export type TimelineItemContract = Assert<HasStylingProps<ComponentProps<typeof TimelineItem>>>;
export const bannerWithReactChildren: BannerProps = { children: <strong>Notice</strong> };

const styles = stylex.create({
  layout: { width: "100%", marginBlockStart: 8 },
  placement: { alignSelf: "center", marginInlineStart: 8 },
  paint: { backgroundColor: "red" },
  dimensions: { height: 80, padding: 24 },
  fieldDimensions: { height: 80, minHeight: 48 },
  focus: { ":focus-visible": { outline: "none" } },
  motion: { transitionDuration: "5s" },
  responsive: { width: { default: "100%", "@media (min-width: 800px)": 320 } },
});

export const buttonLayout: ComponentProps<typeof Button> = {
  children: "Save",
  xstyle: [styles.layout, styles.responsive],
};
export const inputLayout: ComponentProps<typeof Input> = { xstyle: styles.layout };
export const switchPlacement: ComponentProps<typeof Switch> = { xstyle: styles.placement };
export const checkboxPlacement: ComponentProps<typeof Checkbox> = { xstyle: styles.placement };
export const progressLayout: ComponentProps<typeof Progress> = { value: 64, xstyle: styles.layout };
export const sliderLayout: ComponentProps<typeof Slider> = {
  defaultValue: 50,
  xstyle: styles.layout,
};
export const textareaLayout: ComponentProps<typeof Textarea> = { xstyle: styles.fieldDimensions };
export const nativeSelectLayout: ComponentProps<typeof NativeSelect> = { xstyle: styles.layout };
export const toggleLayout: ComponentProps<typeof Toggle> = { xstyle: styles.layout };
export const inputOTPLayout: ComponentProps<typeof InputOTP> = { length: 6, xstyle: styles.layout };
export const timelineLayout: ComponentProps<typeof Timeline> = { xstyle: styles.layout };
export const timelineItemLayout: ComponentProps<typeof TimelineItem> = { xstyle: styles.layout };
export const labelLayout: ComponentProps<typeof Label> = { xstyle: styles.placement };
export const badgeLayout: ComponentProps<typeof Badge> = { xstyle: styles.placement };
export const kbdLayout: ComponentProps<typeof Kbd> = { xstyle: styles.placement };
export const spinnerLayout: ComponentProps<typeof Spinner> = { xstyle: styles.placement };
export const avatarLayout: ComponentProps<typeof Avatar> = { xstyle: styles.placement };
export const linkLayout: ComponentProps<typeof Link> = { xstyle: styles.placement };
export const buttonPaint: ComponentProps<typeof Button> = {
  children: "Save",
  // @ts-expect-error Button colors are selected with variant or a theme.
  xstyle: styles.paint,
};
export const buttonDimensions: ComponentProps<typeof Button> = {
  children: "Save",
  // @ts-expect-error Button dimensions are selected with size and shape.
  xstyle: styles.dimensions,
};
// @ts-expect-error State styles remain owned by Input, including nested selectors.
export const inputFocus: ComponentProps<typeof Input> = { xstyle: styles.focus };
// @ts-expect-error Switch width must match its thumb travel.
export const switchWidth: ComponentProps<typeof Switch> = { xstyle: styles.layout };
// @ts-expect-error Checkbox dimensions remain owned by the control.
export const checkboxWidth: ComponentProps<typeof Checkbox> = { xstyle: styles.layout };
export const nativeSelectHeight: ComponentProps<typeof NativeSelect> = {
  // @ts-expect-error NativeSelect height is selected with its size.
  xstyle: styles.dimensions,
};
// @ts-expect-error Toggle appearance is selected with its variant.
export const togglePaint: ComponentProps<typeof Toggle> = { xstyle: styles.paint };
export const buttonMotion: ComponentProps<typeof Button> = {
  children: "Save",
  // @ts-expect-error Motion cannot be replaced through a layout extension.
  xstyle: styles.motion,
};
export const translucentCard: ComponentProps<typeof Card> = { variant: "translucent" };
export const invalidCardVariant: ComponentProps<typeof Card> = {
  // @ts-expect-error Card supports only its documented surface treatments.
  variant: "glass",
};
export const cardPaint: ComponentProps<typeof Card> = { xstyle: styles.paint };

export const circleButton: ComponentProps<typeof Button> = {
  children: "×",
  shape: "circle",
  size: "icon",
  "aria-label": "Close",
};
export const iconButton: ComponentProps<typeof Button> = {
  children: "×",
  size: "icon",
  "aria-label": "Close",
};
export const invalidButtonShape: ComponentProps<typeof Button> = {
  children: "Save",
  // @ts-expect-error Shapes are a closed set of supported control treatments.
  shape: "oval",
};

export const toasterWithCustomClearContent: import("./dist/toast.js").ToasterProps = {
  clearAllProps: { children: <span>모두 지우기</span>, "aria-label": "Clear all" },
};

export const headingSection: import("./dist/heading.js").HeadingProps = {
  level: 2,
  size: "section",
};
// @ts-expect-error A heading must declare its document level.
export const headingWithoutLevel: import("./dist/heading.js").HeadingProps = { size: "page" };
// @ts-expect-error HTML has six heading levels.
export const headingInvalidLevel: import("./dist/heading.js").HeadingProps = { level: 7 };
export const headingInvalidSize: import("./dist/heading.js").HeadingProps = {
  level: 2,
  // @ts-expect-error Heading sizes are role names, not free-form token sizes.
  size: "xl",
};
export const headingLineHeight: import("./dist/heading.js").HeadingProps = {
  level: 2,
  // @ts-expect-error Individual line-height overrides bypass the typography contract.
  lineHeight: 2,
};

// @ts-expect-error Avatar size remains controlled by its size prop.
export const avatarWidth: ComponentProps<typeof Avatar> = { xstyle: styles.layout };
// @ts-expect-error Label typography and paint remain owned by the component.
export const labelPaint: ComponentProps<typeof Label> = { xstyle: styles.paint };
export const accordionLayout: ComponentProps<typeof AccordionTrigger> = { xstyle: styles.layout };
// @ts-expect-error Accordion interaction colors remain owned by the component.
export const accordionPaint: ComponentProps<typeof AccordionTrigger> = { xstyle: styles.paint };
export const selectLayout: ComponentProps<typeof SelectTrigger> = { xstyle: styles.layout };

export const drawerContentPaint: import("react").ComponentProps<
  typeof import("./dist/drawer.js").DrawerContent
> = { xstyle: styles.paint };
export const drawerContentStyle: import("react").ComponentProps<
  typeof import("./dist/drawer.js").DrawerContent
> = { xstyle: styles.layout };
export const removedContentStyle: import("react").ComponentProps<
  typeof import("./dist/drawer.js").DrawerContent
> = {
  // @ts-expect-error Each part accepts its own xstyle.
  contentXstyle: styles.layout,
};
export const removedContainerStyle: ComponentProps<typeof Table> = {
  // @ts-expect-error The container is a separate component.
  containerXstyle: styles.layout,
};

export const buttonCss: ComponentProps<typeof Button> = {
  children: "Save",
  className: "consumer-button",
  style: { maxWidth: 320, opacity: 0.9 },
};

export const gradientStyleX = gradient.props({ colors: ["red", "blue"] }, styles.layout);
export const gradientConvertedProps = gradient.props(
  { colors: ["red", "blue"] },
  // @ts-expect-error Pass source StyleX styles, not the already converted DOM props.
  stylex.props(styles.layout),
);
// @ts-expect-error The public API requires exactly two colors.
export const gradientMissingColor = gradient.props({ colors: ["red"] });

const removedButtonSizes = ["icon-xs", "icon-sm", "icon-md", "icon-lg", "icon-xl"] as const;
for (const size of removedButtonSizes) {
  // @ts-expect-error Icon buttons now have one size; visual variants remain independent.
  const props: ComponentProps<typeof Button> = { children: "+", size };
  void props;
}

export const namedIconButton: ComponentProps<typeof Button> = {
  size: "icon",
  children: "×",
  "aria-labelledby": "close-label",
};
// @ts-expect-error Icon-only buttons require an accessible name.
export const unnamedIconButton: ComponentProps<typeof Button> = { size: "icon", children: "×" };
// @ts-expect-error Undefined is not an accessible name.
export const undefinedIconName: ComponentProps<typeof Button> = {
  size: "icon",
  children: "×",
  "aria-label": undefined,
};
declare const responsiveButtonSize: "sm" | "icon";
export const dynamicNamedButton: ComponentProps<typeof Button> = {
  size: responsiveButtonSize,
  children: "×",
  "aria-label": "Close",
};
// @ts-expect-error A size that may be icon also requires an accessible name.
export const dynamicUnnamedButton: ComponentProps<typeof Button> = {
  size: responsiveButtonSize,
  children: "×",
};

// @ts-expect-error InputGroupButton preserves the icon-name requirement.
export const unnamedGroupIcon: ComponentProps<typeof InputGroupButton> = {
  size: "icon",
  children: "×",
};
export const namedGroupIcon: ComponentProps<typeof InputGroupButton> = {
  size: "icon",
  children: "×",
  "aria-labelledby": "close-label",
};

export const unborderedInput: ComponentProps<typeof Input> = { variant: "none" };
export const underlinedInput: ComponentProps<typeof Input> = { variant: "underline" };
// @ts-expect-error The documented lower-edge variant is named underline.
export const unknownInputVariant: ComponentProps<typeof Input> = { variant: "bottom-line" };
