import type { Components } from "react-markdown";

import {
  MarkdownH1,
  MarkdownH2,
  MarkdownH3,
  MarkdownP,
  MarkdownUl,
  MarkdownOl,
  MarkdownLi,
  MarkdownA,
  MarkdownTable,
  MarkdownTh,
  MarkdownTd,
  MarkdownCode,
  MarkdownBlockquote,
  MarkdownPre,
} from "./MarkdownElements";

export const documentationComponents: Components = {
  h1: MarkdownH1,
  h2: MarkdownH2,
  h3: MarkdownH3,
  p: MarkdownP,
  ul: MarkdownUl,
  ol: MarkdownOl,
  li: MarkdownLi,
  a: MarkdownA,
  table: MarkdownTable,
  th: MarkdownTh,
  td: MarkdownTd,
  code: MarkdownCode,
  blockquote: MarkdownBlockquote,
  pre: MarkdownPre,
};
