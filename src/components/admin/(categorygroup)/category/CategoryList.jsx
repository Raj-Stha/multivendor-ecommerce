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
  categoryNotes,
  meta,
  page,
  setPage,
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
                <div className="flex items-center justify-between w-full px-4 py-2 ">
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

                    {d.category_details &&
                    Object.keys(d.category_details).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-md shadow-sm border">
                          {Object.entries(d.category_details).map(
                            ([key, value]) =>
                              value !== null &&
                              key !== "category_image" &&
                              key !== "category_id" ? (
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
                              ) : null
                          )}

                          <div className="mt-4 flex justify-end">
                            <EditCategoryDetailsForm
                              data={d}
                              category={data}
                              categoryNotes={categoryNotes}
                            />
                          </div>
                        </div>
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
          <div className="flex justify-center gap-[2%] mt-6">
            <Button
              variant="default"
              className="cursor-pointer"
              onClick={() => setPage((p) => p - 1)}
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
              onClick={() => setPage((p) => p + 1)}
              disabled={meta.page_number >= meta.total_pages}
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
