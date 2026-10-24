# Documentation translations

Document prose and reference descriptions support Korean and English. Navigation,
controls, and example code stay in English. English is the default locale.

- `content.ko.json`: Korean translations keyed by the Markdown passed to
  `LocalizedMarkdown`. Update the key and translation when the source changes.
- `reference.ko.json`: descriptions in token reference tables.
- Component and pattern `docs.mdx`: overview and usage text in `LocaleContent`
  blocks for `ko` and `en`. The same blocks supply AI exports.
- Foundation `guidelines.md` (English) and `guidelines.kr.md` (Korean): paired guidance shared by
  user documentation and AI exports.

## Terminology

| English      | Korean         |
| ------------ | -------------- |
| Foundations  | 기본 원칙      |
| Design token | 디자인 토큰    |
| Spacing      | 간격           |
| Radius       | 모서리         |
| Motion       | 움직임         |
| Disabled     | 사용할 수 없음 |

## Editing guidance

Keep Foundations focused on shared decisions, component pages on choosing and
using the component, and Patterns on a working combination with explicit tradeoffs.
Put a rule in one place and link to it when another page needs the detail.

In Korean, use direct sentences with a clear subject or action. Prefer concrete
conditions over general advice, and explain a restriction only when it affects a
choice. Use “초점” consistently for focus and preserve API identifiers verbatim.
Keep the meaning aligned between languages; sentence structure need not match.
