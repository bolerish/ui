import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectList,
  SelectItem,
} from "@bolerish/ui/select";

export const propExamples = {
  align: {
    start: (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup align="start">
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
    center: (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup align="center">
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
    end: (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup align="end">
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
  },
  disabled: {
    false: (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }} disabled={false}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
    true: (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }} disabled={true}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
  },
  side: {
    top: (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup side="top">
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
    right: (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup side="right">
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
    bottom: (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup side="bottom">
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
    left: (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup side="left">
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
    "inline-start": (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup side="inline-start">
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
    "inline-end": (
      <Select defaultValue="light" items={{ light: "Light", dark: "Dark" }}>
        <SelectTrigger aria-label="Theme">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup side="inline-end">
          <SelectList>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["align"]["start"]
    /* @example-end */
  );
}
