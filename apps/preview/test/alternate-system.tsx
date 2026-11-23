import { defineCatalog } from "@json-render/core";
import { defineRegistry } from "@json-render/react";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

import type { DesignSystemRegistration } from "../src/contracts";

const propsSchema = z.strictObject({ text: z.string() });
const catalog = defineCatalog(schema, {
  components: { FixtureText: { props: propsSchema } },
  actions: {},
});
const { registry } = defineRegistry(catalog, {
  components: {
    FixtureText: ({ props }) => <article data-testid="alternate-text">{props.text}</article>,
  },
});

export const alternateSystem: DesignSystemRegistration = {
  label: "테스트 디자인 시스템",
  themes: [{ id: "paper", label: "종이" }],
  load: async () => ({
    catalog,
    registry,
    parse(input) {
      const spec = catalog.validate(input);
      if (!spec.success || !spec.data) throw new Error("테스트 시안 형식을 확인하세요.");
      for (const element of Object.values(spec.data.elements)) propsSchema.parse(element.props);
      return spec.data;
    },
    createHandlers: () => ({}),
    applyTheme(document, theme) {
      document.documentElement.dataset.fixtureTheme = theme;
    },
  }),
};
