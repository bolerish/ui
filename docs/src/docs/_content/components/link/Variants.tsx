import { Link } from "@bolerish/ui/link";

export default function Variants() {
  return (
    <>
      <Link href="#">Default link</Link>
      <span>
        Inherit the current color{" "}
        <Link href="#" variant="current">
          link
        </Link>
      </span>
      <Link href="#" variant="plain">
        Link without underline
      </Link>
    </>
  );
}
