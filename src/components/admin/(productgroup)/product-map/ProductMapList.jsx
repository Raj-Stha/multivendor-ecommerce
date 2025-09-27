"use client";

import EditProductMapForm from "./form/EditProductMapForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProductMapList({ data, allProduct, meta, page }) {
  const router = useRouter();

  const goToPage = (newPage) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <div>
      {data && data.length > 0 ? (
        <>
          {data.map((d, i) => (
            <div key={i} className="w-full mb-4 ">
              <div
                value={`item-${d.vendor_product_id}`}
                className="border rounded-lg py-4 shadow-sm bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <div className="flex items-center gap-4 flex-grow text-left hover:no-underline">
                    <div className="flex flex-col items-start gap-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {d.vendor_product_name}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm ">
                        {d.vendor_name && (
                          <span className="px-3 shadow-sm py-2 rounded-sm">
                            Vendor: {d.vendor_name}
                          </span>
                        )}
                        {d.vendor_variant_description && (
                          <span className="px-3 shadow-sm py-2 rounded-sm">
                            Vendor Description: {d.vendor_variant_description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    {d && (
                      <EditProductMapForm data={d} allProduct={allProduct} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center gap-[2%] mt-6">
            <Button
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => goToPage(page - 1)}
              disabled={meta.page_number <= 1}
            >
              Previous
            </Button>
            <span className="self-center text-sm text-gray-600">
              Page {meta.page_number} of {meta.total_pages}
            </span>
            <Button
              className="bg-primary text-white hover:bg-primary/90"
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
            No product found. Add a new product to get started.
          </p>
        </div>
      )}
    </div>
  );
}
