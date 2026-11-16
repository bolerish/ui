import { bolerishRegistry } from "@bolerish/json-render";
import { parseBolerishSpec } from "@bolerish/json-render/catalog";
import { Button } from "@bolerish/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@bolerish/ui/field";
import { Paragraph } from "@bolerish/ui/paragraph";
import { Textarea } from "@bolerish/ui/textarea";
import { createStateStore } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { useHydrated } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

const initialState = {
  email: "",
  notifications: false,
  error: "",
  pending: false,
  status: "Demo only. Nothing is sent or stored on a server.",
};
const initialSpec = {
  root: "card",
  elements: {
    card: {
      type: "Card",
      props: {
        title: "Profile settings",
        description: "Edit the JSON, then apply it to start a new session.",
      },
      children: ["fields"],
    },
    fields: {
      type: "FieldGroup",
      props: {},
      children: ["email", "notifications", "save", "status"],
    },
    email: {
      type: "Input",
      props: {
        label: "Email",
        type: "email",
        value: { $bindState: "/email" },
        error: { $state: "/error" },
        disabled: { $state: "/pending" },
      },
      on: { change: { action: "validate" }, blur: { action: "validate" } },
    },
    notifications: {
      type: "Switch",
      props: {
        label: "Demo notifications",
        description: "Updates the demo preference immediately.",
        checked: { $bindState: "/notifications" },
      },
      on: { change: { action: "preference" } },
    },
    save: {
      type: "Button",
      props: { label: "Save email", pending: { $state: "/pending" } },
      on: { press: { action: "save" } },
    },
    status: { type: "Paragraph", props: { text: { $state: "/status" } } },
  },
};
const emailSchema = z.email();

export default function Playground() {
  const ready = useHydrated();
  const [draft, setDraft] = useState(JSON.stringify(initialSpec, null, 2));
  const [error, setError] = useState("");
  const [session, setSession] = useState(() => ({
    spec: parseBolerishSpec(initialSpec, initialState),
    id: 0,
  }));
  return (
    <FieldSet disabled={!ready}>
      <FieldLegend>JSON playground</FieldLegend>
      <FieldGroup>
        <Field invalid={Boolean(error)}>
          <FieldLabel htmlFor="json-render-spec">JSON specification</FieldLabel>
          <Textarea
            id="json-render-spec"
            rows={12}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-invalid={Boolean(error)}
            spellCheck={false}
          />
          {error ? <FieldError match>{error}</FieldError> : null}
        </Field>
        <Button
          variant="secondary"
          onClick={() => {
            try {
              const spec = parseBolerishSpec(JSON.parse(draft), initialState);
              for (const element of Object.values(spec.elements)) {
                for (const binding of Object.values(element.on ?? {})) {
                  if (!["validate", "save", "preference"].includes(binding.action))
                    throw new Error(`Unknown demo action: ${binding.action}`);
                }
              }
              setSession({ spec, id: session.id + 1 });
              setError("");
            } catch {
              setError(
                "Could not apply this specification. Check JSON, supported props, bindings, actions and tree references. The previous preview is preserved.",
              );
            }
          }}
        >
          Apply JSON
        </Button>
        <DemoSession key={session.id} spec={session.spec} />
      </FieldGroup>
    </FieldSet>
  );
}

function DemoSession({ spec }: { spec: ReturnType<typeof parseBolerishSpec> }) {
  const [store] = useState(() => createStateStore({ ...initialState }));
  const [failNext, setFailNext] = useState(false);
  const validate = () => {
    const valid = emailSchema.safeParse(store.get("/email")).success;
    store.set("/error", valid ? "" : "Enter a valid email address.");
    return valid;
  };
  return (
    <>
      <Paragraph>Saving is simulated locally. Applying JSON resets the preview values.</Paragraph>
      <Button
        variant="outline"
        onClick={() => {
          store.set("/failNext", true);
          setFailNext(true);
        }}
        disabled={failNext}
      >
        Fail next save
      </Button>
      <div aria-live="polite">
        <JSONUIProvider
          registry={bolerishRegistry}
          store={store}
          handlers={{
            validate,
            preference: () =>
              store.set(
                "/status",
                store.get("/notifications")
                  ? "Demo notifications enabled."
                  : "Demo notifications disabled.",
              ),
            save: async () => {
              if (store.get("/pending") || !validate()) return;
              const email = store.get("/email");
              const shouldFail = store.get("/failNext");
              store.update({ "/pending": true, "/status": "Saving demo email…" });
              try {
                await new Promise<void>((resolve, reject) =>
                  setTimeout(
                    () => (shouldFail ? reject(new Error("Demo failure")) : resolve()),
                    1500,
                  ),
                );
                store.set("/status", `Demo email saved: ${email}`);
              } catch {
                store.set("/status", "Demo save failed. Your email is preserved. Try again.");
              } finally {
                store.set("/failNext", false);
                setFailNext(false);
                store.set("/pending", false);
              }
            },
          }}
        >
          <Renderer spec={spec} registry={bolerishRegistry} />
        </JSONUIProvider>
      </div>
    </>
  );
}
