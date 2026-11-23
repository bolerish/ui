import type { Catalog, Spec, StateModel, StateStore } from "@json-render/core";
import type { ComponentRegistry, JSONUIProviderProps } from "@json-render/react";
import { z } from "zod";

export const draftSchema = z.strictObject({
  designSystem: z.string().min(1),
  state: z.record(z.string(), z.unknown()).default({}),
  example: z.string().min(1).optional(),
  spec: z.unknown(),
});

export function parseDraft(source: string) {
  return draftSchema.parse(JSON.parse(source));
}

export type PreviewAdapter = {
  catalog: Catalog;
  registry: ComponentRegistry;
  parse(spec: unknown, state: StateModel, example?: string): Spec;
  createHandlers(store: StateStore, example?: string): NonNullable<JSONUIProviderProps["handlers"]>;
  applyTheme(document: Document, theme: string): void;
};

export type DesignSystemRegistration = {
  label: string;
  themes: readonly { id: string; label: string }[];
  load(): Promise<PreviewAdapter>;
};

export const canvasReadySchema = z.strictObject({ type: z.literal("preview:ready") });
export const renderRequestSchema = z.strictObject({
  type: z.literal("preview:render"),
  revision: z.number().int().nonnegative(),
  fileId: z.string(),
  source: z.string(),
  theme: z.string(),
});
export const canvasStatusSchema = z.discriminatedUnion("status", [
  z.strictObject({
    type: z.literal("preview:status"),
    revision: z.number().int().nonnegative(),
    status: z.literal("ready"),
  }),
  z.strictObject({
    type: z.literal("preview:status"),
    revision: z.number().int().nonnegative(),
    status: z.literal("error"),
    message: z.string(),
  }),
]);
export type RenderRequest = z.infer<typeof renderRequestSchema>;
