import { colorVars, sizeVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { Field, FieldLabel } from "@bolerish/ui/field";
import { Input } from "@bolerish/ui/input";
import {
  Select,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bolerish/ui/select";
import * as stylex from "@stylexjs/stylex";
import { useId, useState } from "react";

const projects = [
  { name: "Design system", status: "active" },
  { name: "Customer portal", status: "active" },
  { name: "Website redesign", status: "archived" },
  { name: "Mobile onboarding", status: "archived" },
];
const statuses = { all: "All statuses", active: "Active", archived: "Archived" };
type Status = keyof typeof statuses;

const styles = stylex.create({
  root: { display: "grid", gap: spacingVars.space4, width: "100%" },
  form: { display: "flex", flexWrap: "wrap", alignItems: "end", gap: spacingVars.space3 },
  field: { flexGrow: 1, flexBasis: sizeVars.contentXs, minWidth: 0 },
  actions: { display: "flex", flexWrap: "wrap", gap: spacingVars.space2 },
  text: {
    margin: 0,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
  },
  secondary: { color: colorVars.fgSecondary },
  list: { listStyle: "none", margin: 0, padding: 0 },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacingVars.space3,
    paddingBlock: spacingVars.space3,
    borderBottomWidth: sizeVars.stroke,
    borderBottomStyle: "solid",
    borderBottomColor: colorVars.strokeDefault,
  },
});

export default function ProjectSearch() {
  const id = useId();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [applied, setApplied] = useState<{ query: string; status: Status }>({
    query: "",
    status: "all",
  });
  const normalizedQuery = query.trim();
  const hasChanges = normalizedQuery !== applied.query || status !== applied.status;
  const results = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(applied.query.toLowerCase()) &&
      (applied.status === "all" || project.status === applied.status),
  );

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setApplied({ query: "", status: "all" });
  }

  return (
    <section aria-label="Project search" {...stylex.props(styles.root)}>
      <form
        {...stylex.props(styles.form)}
        onSubmit={(event) => {
          event.preventDefault();
          setApplied({ query: normalizedQuery, status });
        }}
      >
        <div {...stylex.props(styles.field)}>
          <Field>
            <FieldLabel htmlFor={`${id}-query`}>Project name</FieldLabel>
            <Input
              id={`${id}-query`}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </Field>
        </div>
        <div {...stylex.props(styles.field)}>
          <Field>
            <FieldLabel htmlFor={`${id}-status`}>Status</FieldLabel>
            <Select
              items={statuses}
              value={status}
              onValueChange={(value) => {
                if (value !== null) setStatus(value);
              }}
            >
              <SelectTrigger id={`${id}-status`}>
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                <SelectList>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectList>
              </SelectPopup>
            </Select>
          </Field>
        </div>
        <div {...stylex.props(styles.actions)}>
          <Button type="submit">Apply filters</Button>
          <Button type="button" variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      </form>
      <p {...stylex.props(styles.text, styles.secondary)}>
        {hasChanges
          ? "You have unapplied changes. Results still use the filters below."
          : "Changes take effect when you apply filters."}
      </p>
      <output aria-atomic="true" {...stylex.props(styles.text)}>
        {results.length} projects · {statuses[applied.status]} ·{" "}
        {applied.query ? `Name contains “${applied.query}”` : "Any name"}
      </output>
      {results.length ? (
        <ul {...stylex.props(styles.list)}>
          {results.map((project) => (
            <li key={project.name} {...stylex.props(styles.row, styles.text)}>
              <span>{project.name}</span>
              <span {...stylex.props(styles.secondary)}>
                {project.status === "active" ? "Active" : "Archived"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p {...stylex.props(styles.text)}>
          No projects match these filters. Change the name or status and apply again, or clear
          filters.
        </p>
      )}
    </section>
  );
}
