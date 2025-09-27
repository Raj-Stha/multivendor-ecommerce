"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EditManufacturerForm from "./form/EditManufacturerForm";
import EditManufacturerDetailsForm from "./form/EditManufacturerDetailsForm";

export default function ManufacturerList({ data, categoryNotes, meta, page }) {
  const goToPage = (newPage) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage);
    window.location.search = params.toString();
  };

  return (
    <div>
      {data && data.length > 0 ? (
        <>
          <Accordion type="single" collapsible className="w-full">
            {data.map((d) => (
              <AccordionItem
                key={d.manufacturer_id}
                value={`item-${d.manufacturer_id}`}
                className="mb-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between w-full px-4 py-2 ">
                  <AccordionTrigger className="flex items-center gap-4 flex-grow text-left hover:no-underline ">
                    <h3 className="text-lg font-bold text-gray-800">
                      {d.manufacturer_name}
                    </h3>
                  </AccordionTrigger>
                  <div className="ml-4">
                    <EditManufacturerForm data={d} />
                  </div>
                </div>

                <AccordionContent>
                  <div className="p-4 border-t bg-gray-50">
                    <h4 className="font-semibold text-md mb-3 text-gray-700">
                      Manufacturer Specifics:
                    </h4>

                    {d.manufacturer_details &&
                    Object.keys(d.manufacturer_details).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-md shadow-sm border">
                          {Object.entries(d.manufacturer_details).map(
                            ([key, value]) =>
                              value !== null &&
                              key !== "manufacturer_image" &&
                              key !== "manufacturer_id" ? (
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
                            <EditManufacturerDetailsForm
                              data={d}
                              manufacturer={data}
                              categoryNotes={categoryNotes}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No additional details available for this manufacturer.
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Pagination */}
          <div className="flex justify-center gap-[2%] mt-6">
            <Button
              onClick={() => goToPage(page - 1)}
              disabled={meta.page_number <= 1}
            >
              Previous
            </Button>
            <span className="self-center text-sm text-gray-600">
              Page {meta.page_number} of {meta.total_pages}
            </span>
            <Button
              onClick={() => goToPage(page + 1)}
              disabled={meta.page_number >= meta.total_pages}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full text-center py-8">
          <p className="text-gray-500">
            No Manufacturer found. Add a new manufacturer to get started.
          </p>
        </div>
      )}
    </div>
  );
}
