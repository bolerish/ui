# Voice and Tone

A consistent voice makes different screens feel like the same product. Adjust the tone and amount of explanation so routine tasks stay quick while loss or failure gets enough context for an informed decision.

## Writing guidelines

### Keep a consistent voice

Lead with confirmed facts. Describe the user's task rather than internal error names or implementation terms. Avoid blame and claims that exceed the actual result.

Follow the product's chosen formality and sentence style. Buttons can use short labels such as “Save” while descriptions use complete sentences. Different text roles do not need identical grammatical forms.

### Adapt to the situation

| Situation           | Include                                | Example                                                            |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| Routine guidance    | A condition or next step               | “Enter the email address to invite.”                               |
| Completion          | What actually finished                 | “Changes saved.”                                                   |
| Failure             | What failed and an available next step | “Could not save. Try again.”                                       |
| Irreversible action | The target and recovery limits         | “This deletes the project and its files. They cannot be restored.” |

Include the cause when it is known. Do not assume a connection problem or user mistake when the cause is unknown. Keep important consequences explicit, and do not delay the solution with a long apology.

## Examples

### The same save action in different situations

On success, “Changes saved.” briefly confirms the result. On failure, “Couldn't save changes. Try again.” adds a next step. A friendly voice should not minimize failure or invent its cause.

### Revise the message

| Before                              | After                             | Rationale                                     |
| ----------------------------------- | --------------------------------- | --------------------------------------------- |
| “You entered an invalid value.”     | “Include @ in the email address.” | Gives a correction instead of assigning blame |
| “Are you sure you want to proceed?” | “Delete this project?”            | Names the decision and target                 |
| “Everything worked perfectly!”      | “File uploaded.”                  | Reports only the confirmed result             |

Adapt examples to actual behavior. Do not promise retry or recovery when unavailable. See [Writing](/docs/foundations/writing) for button labels, errors, and empty states.
