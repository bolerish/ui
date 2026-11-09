/* oxlint-disable bolerish-ui/color-tokens -- Preserve the Prism VS syntax palette; UI feedback tokens do not describe programming-language categories. */
import * as stylex from "@stylexjs/stylex";

import { documentMarker } from "../../shared/styles/document-marker.stylex";

// Prism's existing VS palette is local syntax coloring, not a UI feedback role.
export const syntaxStyles: Record<string, stylex.StyleXStyles> = stylex.create({
  comment: {
    color: {
      default: "rgb(0, 128, 0)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(106, 153, 85)",
    },
  },
  builtin: {
    color: {
      default: "rgb(0, 112, 193)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(86, 156, 214)",
    },
  },
  number: {
    color: {
      default: "rgb(9, 134, 88)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(181, 206, 168)",
    },
  },
  variable: {
    color: {
      default: "rgb(9, 134, 88)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(156, 220, 254)",
    },
  },
  inserted: {
    color: {
      default: "rgb(9, 134, 88)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(181, 206, 168)",
    },
  },
  operator: {
    color: {
      default: "rgb(0, 0, 0)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(212, 212, 212)",
    },
  },
  constant: {
    color: {
      default: "rgb(129, 31, 63)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(100, 102, 149)",
    },
  },
  char: {
    color: {
      default: "rgb(129, 31, 63)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(209, 105, 105)",
    },
  },
  tag: {
    color: {
      default: "rgb(128, 0, 0)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(86, 156, 214)",
    },
  },
  "attr-name": {
    color: {
      default: "rgb(255, 0, 0)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(156, 220, 254)",
    },
  },
  deleted: {
    color: {
      default: "rgb(163, 21, 21)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(206, 145, 120)",
    },
  },
  string: {
    color: {
      default: "rgb(163, 21, 21)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(206, 145, 120)",
    },
  },
  changed: {
    color: {
      default: "rgb(4, 81, 165)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(86, 156, 214)",
    },
  },
  punctuation: {
    color: {
      default: "rgb(4, 81, 165)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "#808080",
    },
  },
  function: {
    color: {
      default: "rgb(0, 0, 255)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(220, 220, 170)",
    },
  },
  keyword: {
    color: {
      default: "rgb(0, 0, 255)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(86, 156, 214)",
    },
  },
  "class-name": {
    color: {
      default: "rgb(38, 127, 153)",
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(78, 201, 176)",
    },
  },
  prolog: {
    color: {
      default: null,
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(0, 0, 128)",
    },
  },
  "interpolation-punctuation": {
    color: {
      default: null,
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(86, 156, 214)",
    },
  },
  "attr-value": {
    color: {
      default: null,
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(206, 145, 120)",
    },
  },
  "template-punctuation": {
    color: {
      default: null,
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(206, 145, 120)",
    },
  },
  selector: {
    color: {
      default: null,
      [stylex.when.ancestor('[data-bolerish-theme="dark"]', documentMarker)]: "rgb(215, 186, 125)",
    },
  },
});
