# Writing

Specific wording helps people predict an action's result and find a next step when something goes wrong. Connect labels, explanations, and messages around the same task.

## Writing guidelines

### Buttons and inputs

Use specific labels such as “Save,” “Send invitation,” and “Delete project” instead of repeating “Confirm.” Use one term for the same action. Keep input names in labels and use placeholders for examples.

### Message structure

| `Message`           | Include                                                |
| ------------------- | ------------------------------------------------------ |
| Error               | What failed and what the user can do next              |
| `Empty` state       | What is missing and how to get started                 |
| Delete confirmation | The target, whether it can be restored, and the action |
| Completion          | What actually finished                                 |

## Examples

### Connect the wording in an invitation flow

Use “Email address” for the field, “Send invitation” for the action, and “Invitation sent.” for completion. If it fails, say that the invitation was not sent and explain how to retry. Referring to the same object keeps the outcome easy to follow.

### Write an error message

“Include @ in the email address” explains the next step more clearly than “Invalid value.” Do not guess a cause that the API has not confirmed. If you cannot distinguish a connection failure from missing permission, report only what is known.

> Actions should be distinguishable from their labels alone. Keep essential conditions when shortening text. Use the same target name in headings, buttons, and notifications, and align accessible names with visible labels.
