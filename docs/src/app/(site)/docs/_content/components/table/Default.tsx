import {
  TableContainer,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@bolerish/ui/table";

const rows = [
  {
    name: "Brand guide",
    owner: "Minyeong",
    status: "Complete",
    updated: "Aug 28",
  },
  {
    name: "Mobile navigation",
    owner: "Jiwoo",
    status: "In review",
    updated: "Aug 27",
  },
  {
    name: "Payment screen",
    owner: "Seojun",
    status: "In progress",
    updated: "Aug 25",
  },
];
export default function Default() {
  return (
    <TableContainer>
      <Table style={{ tableLayout: "fixed" }}>
        <TableCaption>Three recently updated projects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
              Project
            </TableHead>
            <TableHead style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>Owner</TableHead>
            <TableHead style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>Status</TableHead>
            <TableHead style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
              Updated
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
                {row.name}
              </TableCell>
              <TableCell style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
                {row.owner}
              </TableCell>
              <TableCell style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
                {row.status}
              </TableCell>
              <TableCell style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
                {row.updated}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>All projects</TableCell>
            <TableCell style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>3</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
