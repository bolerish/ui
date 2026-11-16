import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@bolerish/ui/pagination";

export const propExamples = {
  isActive: {
    false: (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive={false}>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
    true: (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive={true}>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
  },
  size: {
    default: (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" size="default">
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
    icon: (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" size="icon">
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
  },
};
export default function Props() {
  return (
    /* @example-start */
    propExamples["isActive"]["false"]
    /* @example-end */
  );
}
