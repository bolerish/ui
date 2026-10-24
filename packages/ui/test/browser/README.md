# Browser accessibility contracts

Run `pnpm --filter @bolerish/ui test:browser` after installing Chromium with
`pnpm --filter @bolerish/ui exec playwright install chromium`. CI runs this same
suite with the existing compiled-component keyboard tests. Its HTML report and
axe JSON attachments are uploaded as `browser-accessibility`.

## Actual scope

`example-coverage.ts` explicitly lists all 56 current component `Default.tsx`
files. The inventory test compares that list plus reasoned exclusions with the
filesystem; a new or removed Default requires a coverage decision. No Default
example is currently excluded. The harness directly imports those files and
builds a production Vite consumer using the compiled UI package, actual package CSS and the StyleX compiler for
example-owned styles. It supplies document language/title and a main landmark.

- All Defaults: light and dark, resting state.
- Opened state as well: AlertDialog, Dialog, Drawer (default down direction),
  Popover, Select, Combobox (matching results), DropdownMenu, ContextMenu,
  Menubar, NavigationMenu, DatePicker, Tooltip, HoverCard and Toast.
- Ocean: Button, Card, Input, Checkbox, Tabs, Select, Dialog and Toast, including
  the relevant opened states. The brand guide's actual precompiled/custom
  examples also receive axe checks and computed-color assertions.
- Tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`.
  All violations in this scope fail; no rule is globally disabled.
- Exception: only `[data-base-ui-focus-guard]` is excluded from axe. These hidden
  synthetic sentinels redirect focus and deliberately have tabindex=0. Their
  effect is exercised by the keyboard containment/return contracts, not treated
  as a user-visible unnamed control. The selector and reason are attached to
  the inventory report. Product controls and portal contents are not excluded.

Tabs checks use the actual Default example: one Tab stop enters the selected
tab, arrows move roving focus, Enter/Space select in the default manual mode,
and Tab/Shift+Tab enter/leave the panel and group. Menubar and existing overlays
also retain direct keyboard checks.

## Limits

This does not audit every prop combination, every non-Default documentation
example, all Drawer directions, all empty/error/loading states, every locale,
arbitrary image backgrounds or every browser/assistive technology. Axe
`incomplete` results are attached for manual review and are not silently counted
as an accessibility guarantee. Best-practice-only rules outside the listed WCAG
tags are not the automated release gate. Axe passing does not establish keyboard
behavior or complete WCAG conformance.
