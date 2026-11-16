import { Link } from "@bolerish/ui/link";

export const propExamples = {
  variant: {
    current: (
      <Link href="#" variant="current">
        Project details
      </Link>
    ),
    inline: (
      <Link href="#" variant="inline">
        Project details
      </Link>
    ),
    plain: (
      <Link href="#" variant="plain">
        Project details
      </Link>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["variant"]["current"]
    /* @example-end */
  );
}
