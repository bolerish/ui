import { PaginationLink } from "@bolerish/ui/pagination";

export default function States() {
  return (
    <>
      {/* @example-start */}
      <PaginationLink href="#" onClick={(event) => event.preventDefault()}>
        1
      </PaginationLink>
      <PaginationLink href="#" onClick={(event) => event.preventDefault()} isActive>
        2
      </PaginationLink>
      {/* @example-end */}
    </>
  );
}
