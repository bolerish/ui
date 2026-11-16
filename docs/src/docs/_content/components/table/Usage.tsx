import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@bolerish/ui/table";

export default function Usage() {
  return (
    /* @example-start */
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Brand guide</TableCell>
          <TableCell>Jordan</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Mobile app</TableCell>
          <TableCell>Alex</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    /* @example-end */
  );
}
