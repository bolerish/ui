# Layout

When layout expresses relationships, people can see what to read and where to act. Group content by task, then choose a component that supports each group.

## Selection guidelines

| Situation                                              | Recommended choice       | Code                   |
| ------------------------------------------------------ | ------------------------ | ---------------------- |
| A row with a title, description, and supporting action | Item                     | `<Item>…</Item>`       |
| An input with a name, description, and error           | `Field`                  | `<Field>…</Field>`     |
| An independent information group                       | `Card`                   | `<Card>…</Card>`       |
| Short contextual choices                               | `Popover`, Dropdown Menu | `<Popover>…</Popover>` |
| A focused task                                         | `Dialog`, `Drawer`       | `<Dialog>…</Dialog>`   |
| Results and comparable values                          | `Table`                  | `<Table>…</Table>`     |

### Width and spacing

Consider `sizeVars.contentSm` for a short input group and `contentMd` for reading areas. Keep the layout within the available width on narrow screens. Follow Spacing for gaps that communicate relationships.

For page content, combine `width: 100%`, `maxWidth: layoutVars.contentMaxWidth`, and
`marginInline: auto`. Start with `space4` inline padding on narrow screens and `space6` on
wider screens. Reserve `sizeVars.content*` for component widths such as popovers, panels,
and dialogs instead of stretching them into page-width tokens.

### First-line alignment

Align Item titles and actions on their first baseline. Align `Checkbox` to the first title line when paired with `FieldContent`. A wrapping description should not require manual top or bottom padding.

### Narrow screens

Move secondary actions to the next row or a related menu when space is limited. Keep the primary action visible. Avoid fixed heights, overflowing widths, and horizontal scrolling as default solutions.

## Examples

### Compose a file list

Use Item to group a file name, modified time, and secondary action. Consider `Table` when people need to compare several values across items. The same data can need a different layout depending on whether the task is browsing or comparison.
