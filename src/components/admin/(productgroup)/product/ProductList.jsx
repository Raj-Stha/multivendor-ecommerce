"use client";

import EditProductForm from "./form/EditProductForm";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EditProductDetailsForm from "./form/EditProductDetailsForm";
import EditVariantsForm from "./form/EditVariantsForm";
import AddVariantsForm from "./form/AddVariantsForm";

export default function ProductList({
  data,
  productNotes,
  meta,
  category,
  manu,
  page,
  setPage,
}) {
  console.log(data);
  return (
    <div>
      {data && data.length > 0 ? (
        <>
          {data.map((d) => (
            <Accordion
              key={d.product_id}
              type="single"
              collapsible
              className="w-full mb-4"
            >
              <AccordionItem
                value={`item-${d.product_id}`}
                className="border rounded-lg shadow-sm bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between w-full px-4 py-2">
                  <AccordionTrigger className="flex items-center gap-4 flex-grow text-left hover:no-underline">
                    <div className="flex flex-col items-start gap-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {d.product_name}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm ">
                        {d.category_name && (
                          <span className="px-3 shadow-sm py-2 rounded-sm">
                            Category: {d.category_name}
                          </span>
                        )}
                        {d.manufacturer_name && (
                          <span className="px-3 shadow-sm py-2 rounded-sm">
                            Manufacturer: {d.manufacturer_name}
                          </span>
                        )}

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

                  <div className="ml-4">
                    {d && category && (
                      <EditProductForm
                        data={d}
                        category={category}
                        manu={manu}
                      />
                    )}
                  </div>
                </div>

                <AccordionContent>
                  <div className="p-4 border-t bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Essential Product Information */}
                      <div className="bg-white p-4 rounded-md shadow-sm border">
                        <h4 className="font-semibold text-md mb-3 text-gray-700">
                          Product Description
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(d.product_details || {}).map(
                            ([key, value], i) => {
                              if (!value) return null;
                              return (
                                <div
                                  key={i}
                                  className="flex justify-between items-center py-1 border-b"
                                >
                                  <span className="font-medium text-gray-600 capitalize">
                                    {key.replace(/_/g, " ")}:
                                  </span>
                                  <span className="text-gray-800 font-semibold">
                                    {value}
                                  </span>
                                </div>
                              );
                            }
                          )}

                          <div className="mt-4 flex justify-end">
                            <EditProductDetailsForm
                              data={d}
                              product={data}
                              productNotes={productNotes}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Variants Information */}
                      {d.variants && d.variants.length > 0 ? (
                        <div className="bg-white p-4 rounded-md shadow-sm border">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-md mb-3 text-gray-700">
                              Product Variants ({d.variants.length})
                            </h4>
                            {d.product_id && (
                              <AddVariantsForm productID={d.product_id} />
                            )}
                          </div>
                          <div className="space-y-4">
                            {d.variants.map((variant, index) => (
                              <div
                                key={variant.variant_id}
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
                                      ID: {variant.variant_id}
                                    </span>
                                  </div>

                                  {variant.variant_description && (
                                    <div className="flex justify-between items-end">
                                      <div className="mt-3 pt-2 border-t border-gray-200">
                                        <h5 className="font-medium text-gray-700 mb-1">
                                          Variant Description:
                                        </h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                          {variant.variant_description}
                                        </p>
                                      </div>
                                      <div className="">
                                        <EditVariantsForm
                                          data={variant}
                                          productID={d.product_id}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-md shadow-sm border">
                          <h4 className="font-semibold text-md mb-3 text-gray-700">
                            Product Variants
                          </h4>
                          <p className="text-sm text-gray-500">
                            No variants available for this product.
                          </p>
                        </div>
                      )}
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
            No product found. Add a new product to get started.
          </p>
        </div>
      )}
    </div>
  );
}
