import { Button } from "@/components/ui/button";
import EditParameterForm from "./form/EditParameterForm";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ParameterList({ data, meta, page, setPage }) {
  return (
    <div>
      {data && data.length > 0 ? (
        <>
          <Table className="w-full border-2 border-gray-200 rounded-2xl shadow-md ">
            <TableHeader className="bg-gray-50 ">
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>data Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d) => (
                <TableRow key={d.parameter_id}>
                  <TableCell className="py-3">
                    <Badge variant="outline">{d.parameter_id}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{d.parameter_name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{d.parameter_value}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground break-all">
                      {d.parameter_description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <EditParameterForm data={d} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-center gap-[2%] mt-6">
            <Button
              variant="default"
              className="cursor-pointer"
              onClick={() => setPage(page - 1)}
              disabled={meta.page_number <= 1}
            >
              Previous
            </Button>

            <span className="self-center text-sm text-gray-600">
              Page {meta.page_number} of {meta.total_pages}
            </span>

            <Button
              variant="default"
              className="cursor-pointer"
              onClick={() => setPage(page + 1)}
              disabled={meta.page_number >= meta.total_pages}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full text-center py-8">
          <p className="text-gray-500">
            No data found. Add a new data to get started.{" "}
          </p>
        </div>
      )}
    </div>
  );
}
