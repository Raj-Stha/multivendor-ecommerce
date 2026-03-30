"use client";

import EditBannerForm from "./form/EditBannerForm";
import EditBannerDetailsForm from "./form/EditBannerDetailsForm";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

export default function PromoList({ data, promoNotes, meta, page }) {
  const router = useRouter();

  const goToPage = (newPage) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <>
      {data && data.length > 0 ? (
        <>
          <Accordion type="single" collapsible className="w-full">
            {data.map((d) => (
              <AccordionItem
                key={d.banner_id}
                value={`item-${d.banner_id}`}
                className="mb-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <AccordionTrigger className="flex items-center gap-4 flex-grow text-left hover:no-underline">
                    <div className="flex gap-4 cursor-pointer">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={d?.image_url || "/placeholder.svg"}
                          alt={d.banner_name}
                          className="w-full h-full object-cover rounded-md border"
                        />
                      </div>

                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {d.banner_name}
                        </h3>
                        <div className="flex gap-4 text-gray-600 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              d.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {d.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <div className="ml-4">
                    <EditBannerForm data={d} />
                  </div>
                </div>

                <AccordionContent>
                  <div className="p-4 border-t bg-gray-50">
                    <h4 className="font-semibold text-md mb-3 text-gray-700">
                      Banner Specifics:
                    </h4>

                    {d.banner_details &&
                    Object.keys(d.banner_details).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-md shadow-sm border">
                          {Object.entries(d.banner_details).map(
                            ([key, value]) =>
                              value !== null &&
                              key !== "banner_image" &&
                              key !== "banner_id" ? (
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
                              ) : null,
                          )}

                          <div className="mt-4 flex justify-end">
                            <EditBannerDetailsForm
                              data={d}
                              manufacturer={data}
                              bannerNotes={promoNotes}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No additional details available for this banner.
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
              className="bg-primary cursor-pointer text-white hover:bg-primary/90"
              onClick={() => goToPage(page - 1)}
              disabled={meta.page_number <= 1}
            >
              Previous
            </Button>

            <span className="self-center text-sm text-gray-600">
              Page {meta.page_number} of {meta.total_pages}
            </span>

            <Button
              className="bg-primary cursor-pointer text-white hover:bg-primary/90"
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
            No Banner found. Add a new banner to get started.
          </p>
        </div>
      )}
    </>
  );
}
