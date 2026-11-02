"use client";

import { sizeVars, spacingRoleVars } from "@bolerish/tokens/semantic.stylex";
import { CaretLeftIcon, CaretRightIcon, CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import useEmblaCarousel from "embla-carousel-react";
import {
  createContext,
  useLayoutEffect,
  useRef,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

import { Button } from "./button";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: { position: "relative", width: "100%" },
  viewport: { overflow: "hidden", width: "100%" },
  content: { display: "flex", gap: "var(--bolerish-carousel-gap, 0px)" },
  ratioRoot: { "--bolerish-carousel-gap": spacingRoleVars.inlineGap },
  ratioItem: (share: number) => ({
    "--bolerish-carousel-basis": `calc((100% - var(--bolerish-carousel-gap, 0px)) * ${share})`,
  }),
  item: {
    boxSizing: "border-box",
    flex: "0 0 100%",
    flexBasis: "var(--bolerish-carousel-basis, 100%)",
    minWidth: 0,
  },
  control: {
    position: "absolute",
    width: sizeVars.controlXs,
  },
  horizontalControl: { top: `calc(50% - ${sizeVars.controlXs} / 2)` },
  verticalControl: { left: `calc(50% - ${sizeVars.controlXs} / 2)` },
  verticalViewport: { height: "100%" },
  verticalContent: { flexDirection: "column", height: "100%" },
  verticalItem: { minHeight: 0 },
  previousVertical: { top: `calc(${sizeVars.controlSm} * -1.5)` },
  nextVertical: { bottom: `calc(${sizeVars.controlSm} * -1.5)` },
  previousInside: { insetInlineStart: spacingRoleVars.inlineGap },
  nextInside: { insetInlineEnd: spacingRoleVars.inlineGap },
  previousVerticalInside: { top: spacingRoleVars.inlineGap },
  nextVerticalInside: { bottom: spacingRoleVars.inlineGap },
  previous: { insetInlineStart: `calc(${sizeVars.controlSm} * -1.5)` },
  next: { insetInlineEnd: `calc(${sizeVars.controlSm} * -1.5)` },
});

type CarouselApi = ReturnType<typeof useEmblaCarousel>[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
type CarouselPlugins = Parameters<typeof useEmblaCarousel>[1];
type CarouselContextValue = {
  vertical: boolean;
  controlsPlacement: "outside" | "inside";
  slideShare?: number;
  canScrollNext: boolean;
  canScrollPrevious: boolean;
  scrollNext: () => void;
  scrollPrevious: () => void;
  viewportRef: ReturnType<typeof useEmblaCarousel>[0];
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("Carousel slots must be rendered inside Carousel.");
  return context;
}

export type { CarouselApi };

export type CarouselProps = StyledProps<ComponentProps<"section">> & {
  children: ReactNode;
  orientation?: "horizontal" | "vertical";
  controlsPlacement?: "outside" | "inside";
  onSelect?: (api: NonNullable<CarouselApi>) => void;
  options?: CarouselOptions;
  plugins?: CarouselPlugins;
  setApi?: (api: NonNullable<CarouselApi>) => void;
  /** Current slide : visible neighboring portion, e.g. [70, 20]. Gap is excluded. */
  slideRatio?: readonly [number, number];
  xstyle?: stylex.StyleXStyles;
};

export function Carousel({
  className,
  style,
  children,
  onSelect,
  orientation,
  controlsPlacement = "outside",
  options,
  plugins,
  setApi,
  slideRatio,
  xstyle,
  ...props
}: CarouselProps) {
  const axis = orientation ? (orientation === "vertical" ? "y" : "x") : (options?.axis ?? "x");
  const vertical = axis === "y";
  let slideShare: number | undefined;
  if (slideRatio !== undefined) {
    if (
      slideRatio.length !== 2 ||
      slideRatio.some((value) => !Number.isFinite(value) || value <= 0) ||
      !Number.isFinite(slideRatio[0] + slideRatio[1])
    ) {
      throw new Error("Carousel slideRatio requires two finite positive numbers.");
    }
    if (vertical) throw new Error("Carousel slideRatio currently supports horizontal carousels.");
    slideShare = slideRatio[0] / (slideRatio[0] + slideRatio[1]);
  }
  const [viewportRef, api] = useEmblaCarousel(
    { ...(slideRatio ? { align: "start" as const } : {}), ...options, axis },
    plugins,
  );
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelectRef = useRef(onSelect);
  useLayoutEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (api) setApi?.(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;
    function handleSelection(nextApi: NonNullable<CarouselApi>) {
      setCanScrollPrevious(nextApi.canScrollPrev());
      setCanScrollNext(nextApi.canScrollNext());
      onSelectRef.current?.(nextApi);
    }
    api.on("reInit", handleSelection).on("select", handleSelection);
    const frame = requestAnimationFrame(() => handleSelection(api));
    return () => {
      cancelAnimationFrame(frame);
      api.off("reInit", handleSelection).off("select", handleSelection);
    };
  }, [api]);

  function scrollPrevious() {
    api?.scrollPrev();
  }

  function scrollNext() {
    api?.scrollNext();
  }

  return (
    <CarouselContext.Provider
      value={{
        vertical,
        controlsPlacement,
        slideShare,
        canScrollNext,
        canScrollPrevious,
        scrollNext,
        scrollPrevious,
        viewportRef,
      }}
    >
      <section
        aria-roledescription="carousel"
        {...props}
        {...mergeStyles(
          stylex.props(styles.root, slideShare !== undefined && styles.ratioRoot, xstyle),
          className,
          style,
        )}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  );
}

export type CarouselContentProps = StyledProps<ComponentProps<"div">> & {
  xstyle?: stylex.StyleXStyles;
};

export function CarouselViewport({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<Omit<ComponentProps<"div">, "ref">> & { xstyle?: stylex.StyleXStyles }) {
  const { viewportRef, vertical } = useCarousel();
  return (
    <div
      ref={viewportRef}
      {...props}
      {...mergeStyles(
        stylex.props(styles.viewport, vertical && styles.verticalViewport, xstyle),
        className,
        style,
      )}
    />
  );
}

export function CarouselContent({ className, style, xstyle, ...props }: CarouselContentProps) {
  const { vertical } = useCarousel();
  return (
    <div
      {...props}
      {...mergeStyles(
        stylex.props(styles.content, vertical && styles.verticalContent, xstyle),
        className,
        style,
      )}
    />
  );
}

export type CarouselItemProps = StyledProps<ComponentProps<"div">> & {
  xstyle?: stylex.StyleXStyles;
};

export function CarouselItem({ className, style, xstyle, ...props }: CarouselItemProps) {
  const { slideShare, vertical } = useCarousel();
  return (
    <div
      {...props}
      {...mergeStyles(
        stylex.props(
          styles.item,
          vertical && styles.verticalItem,
          slideShare !== undefined && styles.ratioItem(slideShare),
          xstyle,
        ),
        className,
        style,
      )}
    />
  );
}

type CarouselControlProps = StyledProps<
  Omit<ComponentProps<typeof Button>, "children" | "onClick">
>;

export function CarouselPrevious({ disabled, style, xstyle, ...props }: CarouselControlProps) {
  const { canScrollPrevious, scrollPrevious, vertical, controlsPlacement } = useCarousel();
  const Icon = vertical ? CaretUpIcon : CaretLeftIcon;
  return (
    <Button
      aria-label="Previous slide"
      disabled={disabled ?? !canScrollPrevious}
      onClick={scrollPrevious}
      size="icon"
      shape="circle"
      style={{ aspectRatio: "1", height: "auto", ...style }}
      variant="secondary"
      xstyle={[
        styles.control,
        vertical ? styles.verticalControl : styles.horizontalControl,
        vertical ? styles.previousVertical : styles.previous,
        controlsPlacement === "inside" &&
          (vertical ? styles.previousVerticalInside : styles.previousInside),
        xstyle,
      ]}
      {...props}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}

export function CarouselNext({ disabled, style, xstyle, ...props }: CarouselControlProps) {
  const { canScrollNext, scrollNext, vertical, controlsPlacement } = useCarousel();
  const Icon = vertical ? CaretDownIcon : CaretRightIcon;
  return (
    <Button
      aria-label="Next slide"
      disabled={disabled ?? !canScrollNext}
      onClick={scrollNext}
      size="icon"
      shape="circle"
      style={{ aspectRatio: "1", height: "auto", ...style }}
      variant="secondary"
      xstyle={[
        styles.control,
        vertical ? styles.verticalControl : styles.horizontalControl,
        vertical ? styles.nextVertical : styles.next,
        controlsPlacement === "inside" &&
          (vertical ? styles.nextVerticalInside : styles.nextInside),
        xstyle,
      ]}
      {...props}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
