import { colorVars, radiusVars, sizeVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";

const styles = stylex.create({
  list: { display: "grid", gap: spacingVars.space2, listStyleType: "none", padding: 0 },
  item: {
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    borderRadius: radiusVars.sm,
    color: colorVars.fgPrimary,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacingVars.space2,
    padding: spacingVars.space3,
    position: "relative",
  },
  source: { borderStyle: "dashed", color: colorVars.fgSecondary },
  target: {
    backgroundColor: colorVars.bgDropTarget,
    borderColor: colorVars.strokeDropIndicator,
    "::before": {
      content: '""',
      position: "absolute",
      insetInline: 0,
      top: `calc(${spacingVars.space1} * -1)`,
      height: sizeVars.focusRing,
      backgroundColor: colorVars.strokeDropIndicator,
    },
  },
  message: { color: colorVars.fgSecondary },
});

export default function DragExample() {
  const movingControl = useRef<HTMLButtonElement>(null);
  const [items, setItems] = useState(["Inbox", "Reading", "Archive"]);
  const [moving, setMoving] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [target, setTarget] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "Choose Move or drag an item. The line marks insertion before a row.",
  );

  function clearDrag() {
    setDragging(false);
    setTarget(null);
  }

  function moveBefore(destination: string) {
    if (!moving || moving === destination) return;
    const next = items.filter((item) => item !== moving);
    next.splice(next.indexOf(destination), 0, moving);
    movingControl.current?.focus();
    setItems(next);
    setMessage(`${moving} moved before ${destination}. Order: ${next.join(", ")}.`);
    setMoving(null);
    clearDrag();
  }

  return (
    <section aria-label="Drag roles">
      <output {...stylex.props(styles.message)}>{message}</output>
      <ul {...stylex.props(styles.list)}>
        {items.map((item) => (
          // Native draggable list items retain list semantics; buttons provide equivalent keyboard actions.
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <li
            key={item}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("text/plain", item);
              event.dataTransfer.effectAllowed = "move";
              setMoving(item);
              setDragging(true);
              setMessage(`Moving ${item}. Drop before another row.`);
            }}
            onDragOver={(event) => {
              if (!dragging || !moving || moving === item) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              setTarget(item);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null))
                setTarget(null);
            }}
            onDrop={(event) => {
              if (!dragging || event.dataTransfer.getData("text/plain") !== moving) return;
              event.preventDefault();
              moveBefore(item);
            }}
            onDragEnd={(event) => {
              if (event.dataTransfer.dropEffect === "none")
                setMessage("Move cancelled. Order unchanged.");
              clearDrag();
              setMoving(null);
            }}
            {...stylex.props(
              styles.item,
              moving === item && styles.source,
              target === item && styles.target,
            )}
          >
            <span>
              {item}
              {moving === item ? " — Moving" : ""}
            </span>
            <Button
              size="sm"
              variant="ghost"
              ref={moving === item ? movingControl : undefined}
              aria-pressed={moving === item}
              onClick={() => {
                setMoving(item);
                setMessage(`Moving ${item}. Choose a destination or cancel.`);
              }}
            >
              Move {item}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!moving || moving === item}
              onClick={() => moveBefore(item)}
            >
              Before {item}
            </Button>
            {target === item ? <span>↓ Insert before {item}</span> : null}
          </li>
        ))}
      </ul>
      <Button
        size="sm"
        disabled={!moving}
        onClick={() => {
          movingControl.current?.focus();
          setMoving(null);
          clearDrag();
          setMessage("Move cancelled. Order unchanged.");
        }}
      >
        Cancel move
      </Button>
    </section>
  );
}
