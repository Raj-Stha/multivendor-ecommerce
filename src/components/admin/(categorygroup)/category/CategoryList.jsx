import EditCategoryForm from "./form/EditCategoryForm";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import EditCategoryDetailsForm from "./form/EditCategoryDetailsForm";

export default function CategoryList({
  data,
  page,
  setPage,
  categoryNotes,
  hasNextPage,
}) {
  return (
    <div>
      {data && data.length > 0 ? (
        <>
          <Accordion type="single" collapsible className="w-full">
            {data.map((d) => (
              <AccordionItem
                key={d.category_id}
                value={`item-${d.category_id}`}
                className="mb-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between w-full p-4">
                  <AccordionTrigger className="flex items-center gap-4 flex-grow text-left hover:no-underline ">
                    <Image
                      className="w-12 h-12 object-cover rounded border"
                      src={d?.category_image || "/placeholder.svg"}
                      alt={d.category_name}
                      width={48}
                      height={48}
                    />
                    <h3 className="text-lg font-bold text-gray-800">
                      {d.category_name}
                    </h3>
                  </AccordionTrigger>

                  {/* Move the button outside AccordionTrigger */}
                  <div className="ml-4">
                    <EditCategoryForm data={d} />
                  </div>
                </div>

                <AccordionContent>
                  <div className="p-4 border-t bg-gray-50">
                    <h4 className="font-semibold text-md mb-3 text-gray-700">
                      Category Specifics:
                    </h4>
                    {d.details && d.details.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {d.details.map((detailItem, detailIndex) => (
                          <div
                            key={detailIndex}
                            className="bg-white p-3 rounded-md shadow-sm border"
                          >
                            {Object.entries(detailItem).map(
                              ([key, value]) =>
                                value !== null &&
                                key !== "category_image" &&
                                key !== "category_id" && (
                                  <>
                                    <div
                                      key={key}
                                      className="flex justify-between items-center py-1 border-b last:border-b-0"
                                    >
                                      <span className="font-medium text-gray-600 capitalize">
                                        {key.replace(/_/g, " ")}:
                                      </span>
                                      <span className="text-gray-800 font-semibold">
                                        {String(value)}
                                      </span>
                                    </div>
                                  </>
                                )
                            )}
                            <div className="mt-4 flex justify-end">
                              <EditCategoryDetailsForm
                                data={d}
                                category={data}
                                categoryNotes={categoryNotes}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No additional details available for this category.
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Pagination using hasNextPage */}
          <div className="flex justify-center mt-6 gap-4">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 self-center">
              {" "}
              Page {page}{" "}
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
            {" "}
            No categories found. Add a new category to get started.{" "}
          </p>
        </div>
      )}
    </div>
  );
}
