export const registryItems = {
  p: {
    files: ["p.tsx"],
    dependencies: [],
    registryDependencies: ["paragraph"],
  },
  paragraph: {
    files: ["paragraph.tsx", "typography.ts", "styles/control-layout.ts", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  heading: {
    files: ["heading.tsx", "typography.ts", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  accordion: {
    files: ["accordion.tsx", "styles/merge-styles.ts"],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: [],
  },
  "alert-dialog": {
    files: ["alert-dialog.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: ["button"],
  },
  "aspect-ratio": {
    files: ["aspect-ratio.tsx", "styles/merge-styles.ts"],
    dependencies: ["@stylexjs/stylex"],
    registryDependencies: [],
  },
  attachment: {
    files: ["attachment.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: ["button"],
  },
  avatar: {
    files: ["avatar.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  badge: {
    files: ["badge.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  banner: {
    files: ["banner.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  breadcrumb: {
    files: ["breadcrumb.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@phosphor-icons/react", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  button: {
    files: ["button.tsx", "styles/control-layout.ts", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  "button-group": {
    files: ["button-group.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: ["separator"],
  },
  card: {
    files: ["card.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  calendar: {
    files: ["calendar.tsx", "styles/merge-styles.ts"],
    dependencies: ["@daypicker/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  carousel: {
    files: ["carousel.tsx", "styles/merge-styles.ts"],
    dependencies: [
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
      "embla-carousel-react",
    ],
    registryDependencies: ["button"],
  },
  checkbox: {
    files: ["checkbox.tsx", "styles/merge-styles.ts"],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: [],
  },
  collapsible: {
    files: ["collapsible.tsx", "styles/merge-styles.ts"],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: [],
  },
  combobox: {
    files: ["combobox.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: [],
  },
  "context-menu": {
    files: ["context-menu.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react"],
    registryDependencies: ["dropdown-menu"],
  },
  dialog: {
    files: ["dialog.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: [],
  },
  "date-picker": {
    files: ["date-picker.tsx"],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: ["calendar", "popover"],
  },
  drawer: {
    files: ["drawer.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  "dropdown-menu": {
    files: ["dropdown-menu.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: [],
  },
  empty: {
    files: ["empty.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  field: {
    files: ["field.tsx", "typography.ts", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: ["checkbox", "input"],
  },
  "hover-card": {
    files: ["hover-card.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  input: {
    files: ["input.tsx", "styles/control-layout.ts", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  "input-group": {
    files: ["input-group.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: ["button", "input", "textarea"],
  },
  "input-otp": {
    files: ["input-otp.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  "content-row": {
    files: ["content-row.tsx", "typography.ts", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  kbd: {
    files: ["kbd.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  label: {
    files: ["label.tsx", "typography.ts", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  link: {
    files: ["link.tsx", "styles/merge-styles.ts"],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: [],
  },
  marker: {
    files: ["marker.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  menubar: {
    files: ["menubar.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: ["dropdown-menu"],
  },
  "native-select": {
    files: ["native-select.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@phosphor-icons/react", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  "navigation-menu": {
    files: ["navigation-menu.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: [],
  },
  pagination: {
    files: ["pagination.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@phosphor-icons/react", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  popover: {
    files: ["popover.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  progress: {
    files: ["progress.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  "radio-group": {
    files: ["radio-group.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  "scroll-area": {
    files: ["scroll-area.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  select: {
    files: ["select.tsx", "styles/merge-styles.ts", "styles/surface.ts"],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: [],
  },
  separator: {
    files: ["separator.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  skeleton: {
    files: ["skeleton.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  slider: {
    files: ["slider.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  spinner: {
    files: ["spinner.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  switch: {
    files: ["switch.tsx", "styles/control-layout.ts", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  timeline: {
    files: ["timeline.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  table: {
    files: ["table.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  tabs: {
    files: ["tabs.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  textarea: {
    files: ["textarea.tsx", "styles/merge-styles.ts"],
    dependencies: ["@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  toast: {
    files: [
      "toast.tsx",
      "toast.stylex.ts",
      "typography.ts",
      "styles/merge-styles.ts",
      "styles/surface.ts",
    ],
    dependencies: [
      "@base-ui/react",
      "@bolerish/tokens",
      "@phosphor-icons/react",
      "@stylexjs/stylex",
    ],
    registryDependencies: [],
  },
  toggle: {
    files: ["toggle.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
  "toggle-group": {
    files: ["toggle-group.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: ["toggle"],
  },
  tooltip: {
    files: ["tooltip.tsx", "styles/merge-styles.ts"],
    dependencies: ["@base-ui/react", "@bolerish/tokens", "@stylexjs/stylex"],
    registryDependencies: [],
  },
};
