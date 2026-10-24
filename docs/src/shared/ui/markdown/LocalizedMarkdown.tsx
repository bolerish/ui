import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import korean from "../../config/locales/content.ko.json";
import { useLocale } from "../../model/locale";
import { documentationComponents } from "./components";

const translations: Record<string, string> = korean;

export function LocalizedMarkdown({ text }: { text: string }) {
  const locale = useLocale();
  const content = locale === "ko" ? (translations[text] ?? text) : text;
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={documentationComponents}
    >
      {content}
    </Markdown>
  );
}
