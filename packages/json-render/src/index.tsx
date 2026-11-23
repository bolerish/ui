"use client";

import { Button } from "@bolerish/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bolerish/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@bolerish/ui/field";
import { Heading } from "@bolerish/ui/heading";
import { Input } from "@bolerish/ui/input";
import { Paragraph } from "@bolerish/ui/paragraph";
import { Spinner } from "@bolerish/ui/spinner";
import { Switch } from "@bolerish/ui/switch";
import { defineRegistry, useBoundProp } from "@json-render/react";
import type { Components } from "@json-render/react";
import { useId } from "react";

import { bolerishCatalog, bolerishComponentDefinitions } from "./catalog.js";

export const bolerishComponents = {
  Card: ({ props, children }) => {
    const value = bolerishComponentDefinitions.Card.props.parse(props);
    return (
      <Card>
        <CardHeader>
          <CardTitle>{value.title}</CardTitle>
          {value.description ? <CardDescription>{value.description}</CardDescription> : null}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    );
  },
  FieldGroup: ({ children }) => <FieldGroup>{children}</FieldGroup>,
  Heading: ({ props }) => {
    const value = bolerishComponentDefinitions.Heading.props.parse(props);
    return <Heading level={value.level}>{value.text}</Heading>;
  },
  Paragraph: ({ props }) => (
    <Paragraph>{bolerishComponentDefinitions.Paragraph.props.parse(props).text}</Paragraph>
  ),
  Input: function BoundInput({ props, bindings, emit }) {
    const parsed = bolerishComponentDefinitions.Input.props.parse(props);
    const [value, setValue] = useBoundProp(parsed.value, bindings?.value);
    const id = useId();
    return (
      <Field invalid={Boolean(parsed.error)}>
        <FieldLabel htmlFor={id}>{parsed.label}</FieldLabel>
        <Input
          id={id}
          value={value ?? ""}
          type={parsed.type}
          disabled={parsed.disabled}
          aria-invalid={Boolean(parsed.error)}
          onValueChange={(next) => {
            setValue(next);
            emit("change");
          }}
          onBlur={() => emit("blur")}
        />
        {parsed.description ? <FieldDescription>{parsed.description}</FieldDescription> : null}
        {parsed.error ? <FieldError match>{parsed.error}</FieldError> : null}
      </Field>
    );
  },
  Switch: function BoundSwitch({ props, bindings, emit }) {
    const parsed = bolerishComponentDefinitions.Switch.props.parse(props);
    const [checked, setChecked] = useBoundProp(parsed.checked, bindings?.checked);
    const id = useId();
    return (
      <Field>
        <FieldLabel htmlFor={id}>{parsed.label}</FieldLabel>
        <Switch
          id={id}
          checked={checked ?? false}
          disabled={parsed.disabled}
          onCheckedChange={(next) => {
            setChecked(next);
            emit("change");
          }}
        />
        {parsed.description ? <FieldDescription>{parsed.description}</FieldDescription> : null}
      </Field>
    );
  },
  Button: ({ props, emit }) => {
    const value = bolerishComponentDefinitions.Button.props.parse(props);
    return (
      <Button
        type="button"
        variant={value.variant}
        disabled={value.disabled || value.pending}
        aria-busy={value.pending}
        onClick={() => emit("press")}
      >
        {value.pending ? <Spinner aria-hidden="true" /> : null}
        {value.label}
      </Button>
    );
  },
} satisfies Components<typeof bolerishCatalog>;

export const { registry: bolerishRegistry } = defineRegistry(bolerishCatalog, {
  components: bolerishComponents,
});
