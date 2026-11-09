import { PaginationLink } from "@bolerish/ui/pagination";

export default function Sizes() {
  return (
    <>
      <PaginationLink href="#" size="icon" aria-label="Previous page">
        1
      </PaginationLink>
      <PaginationLink href="#" size="default">
        Page 1
      </PaginationLink>
    </>
  );
}
