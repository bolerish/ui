import { PaginationLink } from "@bolerish/ui/pagination";

export default function States() {
  return (
    <>
      <PaginationLink href="#">1</PaginationLink>
      <PaginationLink href="#" isActive>
        2
      </PaginationLink>
    </>
  );
}
