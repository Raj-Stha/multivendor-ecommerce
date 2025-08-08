import EditCategoryForm from "./EditCategoryForm";
import { Button } from "@/components/ui/button";

export default function CategoryList({ data, page, setPage, hasNextPage }) {
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
                  <img
                    className="w-12 h-12 object-cover rounded border"
                    src={d?.category_image || "/placeholder.svg"}
                    alt={d.category_name}
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-800">
                      {d.category_name}
                    </h3>
                  </div>
                </div>
                <EditCategoryForm data={d} />
              </div>
            </div>
          ))}

          {/* ✅ Pagination using hasNextPage */}
          <div className="flex justify-center mt-6 gap-4">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 self-center">
              Page {page}
            </span>
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasNextPage}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full text-center py-8">
          <p className="text-gray-500">
            No categories found. Add a new category to get started.
          </p>
        </div>
      )}
    </div>
  );
}
