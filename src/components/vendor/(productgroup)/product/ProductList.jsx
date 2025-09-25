"use client";

import EditProductForm from "./form/EditProductForm";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EditVariantsForm from "./form/EditVariantsForm";
import AddVariantsForm from "./form/AddVariantsForm";
import { useRouter } from "next/navigation";

export default function ProductList({ data, meta }) {
  const router = useRouter();
  return (
    <div>
      {data && data.length > 0 ? (
        <>
          {data.map((d) => (
            <Accordion
              key={d.vendor_product_id}
              type="single"
              collapsible
              className="w-full mb-4"
            >
              <AccordionItem
                value={`item-${d.vendor_product_id}`}
                className="border rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
              >
                <AccordionTrigger className="w-full px-4 py-5 cursor-pointer  flex items-center gap-4 flex-grow text-left hover:no-underline">
                  <div className="flex flex-col items-start space-y-3 gap-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {d.vendor_product_name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm ">
                      {d.tax1_rate && (
                        <span className="px-3 shadow-sm py-2 rounded-sm">
                          Tax rate 1: {d.tax1_rate}
                        </span>
                      )}

                      {d.tax2_rate && (
                        <span className="px-3 shadow-sm py-2 rounded-sm">
                          Tax rate 2: {d.tax2_rate}
                        </span>
                      )}

                      {d.tax1_rate && (
                        <span className="px-3 shadow-sm py-2 rounded-sm">
                          Tax rate 3: {d.tax3_rate}
                        </span>
                      )}

                      <span
                        className={`px-3 shadow-sm py-2 rounded-sm ${
                          d.restricted
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {d.restricted ? "Restricted" : "Non Restricted"}
                      </span>
                      <span
                        className={`px-3 shadow-sm py-2 rounded-sm ${
                          d.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {d.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="p-4 border-t bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Essential Product Information */}
                      <div className="bg-white p-4 rounded-md shadow-sm border">
                        <h4 className="font-semibold text-md mb-3 text-gray-700">
                          Product Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-1 border-b">
                            <span className="font-medium text-gray-600 capitalize">
                              Product Name
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {d.vendor_product_name}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-1 border-b">
                            <span className="font-medium text-gray-600 capitalize">
                              Tax rate 1
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {d.tax1_rate}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-1 border-b">
                            <span className="font-medium text-gray-600 capitalize">
                              Tax rate 2
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {d.tax2_rate}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-1 border-b">
                            <span className="font-medium text-gray-600 capitalize">
                              Tax rate 3
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {d.tax3_rate}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-1 border-b">
                            <span className="font-medium text-gray-600 capitalize">
                              Restricted
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {String(d?.restricted)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-1 border-b">
                            <span className="font-medium text-gray-600 capitalize">
                              Active
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {String(d?.active)}
                            </span>
                          </div>

                          <div className="mt-4 flex justify-end">
                            {d && <EditProductForm data={d} />}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-md shadow-sm border">
                        <div className="flex justify-between pb-3  items-center">
                          <h4 className="font-semibold text-md  text-gray-700">
                            Product Variants ({d.variant.length})
                          </h4>
                          {d.vendor_product_id && (
                            <AddVariantsForm productID={d.vendor_product_id} />
                          )}
                        </div>
                        <div className="space-y-4">
                          {d.variant.map((variant, index) => (
                            <div
                              key={variant.vendor_variant_id}
                              className={`p-3 rounded-lg border-l-4 bg-gray-50 ${
                                index % 4 === 0
                                  ? " border-l-blue-400"
                                  : index % 4 === 1
                                  ? " border-l-green-400"
                                  : index % 4 === 2
                                  ? " border-l-purple-400"
                                  : " border-l-orange-400"
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-gray-700">
                                    Variant #{index + 1}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ID: {variant.vendor_variant_id}
                                  </span>
                                </div>

                                {variant.vendor_variant_description && (
                                  <>
                                    <div className="flex justify-between items-center py-1 border-b">
                                      <span className="font-medium text-gray-600 capitalize">
                                        Stock:
                                      </span>
                                      <span className="text-gray-800 font-semibold">
                                        {variant.available_count}
                                      </span>
                                    </div>

                                    <div className="flex justify-between items-center py-1 border-b">
                                      <span className="font-medium text-gray-600 capitalize">
                                        Price:
                                      </span>
                                      <span className="text-green-600 font-semibold">
                                        ${variant.product_price}
                                      </span>
                                    </div>

                                    <div className="flex justify-between items-center py-1 border-b">
                                      <span className="font-medium text-gray-600 capitalize">
                                        Discount Price:
                                      </span>
                                      <span className="text-red-800 font-semibold">
                                        ${variant.product_discount}
                                      </span>
                                    </div>

                                    <div className="flex justify-between items-end">
                                      <div className=" pt-2 border-b border-gray-200">
                                        <h5 className="font-medium text-gray-700 mb-1">
                                          Variant Description:
                                        </h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                          {variant.vendor_variant_description}
                                        </p>
                                      </div>
                                      <div className="">
                                        <EditVariantsForm
                                          data={variant}
                                          productID={d.vendor_product_id}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}

          <div className="flex justify-center gap-[2%] mt-6">
            <Button
              variant="default"
              className="cursor-pointer"
              onClick={() => router.push(`?page=${meta.page_number - 1}`)}
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
              onClick={() => router.push(`?page=${meta.page_number + 1}`)}
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
