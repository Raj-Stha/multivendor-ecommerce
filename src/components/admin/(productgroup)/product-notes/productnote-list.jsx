import EditProductNotesForm from "./form/EditProductNotesForm";
import { Button } from "@/components/ui/button";

export default function ProductNoteList({ data, page, setPage, meta }) {
  return (
    <div>
      {data && data.length > 0 ? (
        <>
          {data.map((d) => (
            <div
              key={d.category_id}
              className="w-full border rounded-lg shadow-sm bg-white hover:shadow-md transition-all mb-4"
            >
              <div className="flex items-center justify-between w-full p-4">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-800">
                      {d.detail_name}
                    </h3>
                  </div>
                </div>
                <EditProductNotesForm data={d} />
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-6 gap-4">
            <Button
              onClick={() => setPage(page - 1)}
              disabled={meta.page_number <= 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 self-center">
              Page {meta.page_number} of {meta.total_pages}
            </span>
            <Button
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
            No product notes found. Add a new product notes to get started.
          </p>
        </div>
      )}
    </div>
  );
}
