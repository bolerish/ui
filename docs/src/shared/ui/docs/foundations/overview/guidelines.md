# @bolerish/ui Foundations

@bolerish/ui shares recurring interface decisions so people can predict what to do next. Compose components and tokens around a consistent view of task priority, information relationships, and recovery from failure.

## Work in this order

1. Describe the task the user needs to complete in one sentence.
2. Separate headings, content, and supporting information. Choose one primary action.
3. Check existing components and their supported props.
4. Choose tokens for color, size, spacing, and motion by their role.
5. Check empty, loading, success, and error states, long content, and keyboard use.

## Start with a settings screen

For notification preferences, first decide when a change takes effect. Consider `Switch` for an immediate setting and `Checkbox` for a choice submitted later. Then use `Field` to connect names and descriptions, and preserve choices if saving fails.

## Choose a guideline

| Decision                                          | Read                               |
| ------------------------------------------------- | ---------------------------------- |
| Values and names                                  | Design Token, Color, Typography    |
| Grouping information                              | Layout, Spacing, Radius, Elevation |
| Interaction and results                           | State, Motion, Feedback            |
| Access with different abilities and input methods | Accessibility                      |
| Interface wording                                 | Voice and Tone, Writing            |

## Resolve competing priorities

Keep the task possible before reducing visual density. If labels or actions no longer fit, reflow the layout before shrinking text or hiding the main action. Prefer proximity and spacing to extra containers; add a border or surface only when the grouping remains unclear.

Emphasis follows the task, not the number of available controls. A page can have many actions while giving the next useful step the strongest treatment. Do not communicate an error with color alone: name the problem and provide a way forward.

## Guidelines and implementation

These recommendations are starting points for new screens. Preserve the typography and alignment already defined by components. Document the reason and scope of any exception.

Start with the [State role composition contracts](/docs/foundations/state) when choosing visual hierarchy and states. They define selection surfaces, drop areas, insertion positions and overlapping states in one place.

## Consumer styles

Styled components accept `xstyle`, string `className`, and a React CSS properties
object in `style`. Use `xstyle` when the app already compiles StyleX; its existing
placement/layout restrictions remain intact. Plain CSS, CSS modules and inline
styles do not require a consumer StyleX compiler.

All three target the same element. Internal StyleX and `xstyle` are merged in one
call, consumer classes are preserved, and inline properties are merged after
internal dynamic inline values. Class string order alone does not determine CSS
precedence: selectors, layers, source order and important declarations still apply.

Containers allow broad `xstyle`; controls retain their placement and width
contracts. `className` and `style` provide an appearance escape hatch, so check
error, disabled, selected and keyboard-focus states and contrast after overriding.
Context-only roots, providers and portals do not gain a styling target.

Styling follows the component's documented target. AccordionContent styles its
inner content rather than its animated panel. NativeSelect styles the wrapper,
including the icon, and DrawerContent styles the element directly around children.
