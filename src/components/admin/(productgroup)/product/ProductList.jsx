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

export default function ProductList({
  data,
  productNotes,
  meta,
  category,
  manu,
  page,
  setPage,
}) {
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
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        {d.category_name && (
                          <span className="bg-gray-50 text-blue-800 px-2 py-1 rounded-full">
                            {d.category_name}
                          </span>
                        )}
                        {d.manufacturer_name && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {d.manufacturer_name}
                          </span>
                        )}
                        {d.vendor_name && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {d.vendor_name}
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 rounded-full ${
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
                          Product Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-1 border-b">
                            <span className="font-medium text-gray-600">
                              Product ID:
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {d.product_id}
                            </span>
                          </div>
                          {d.category_name && (
                            <div className="flex justify-between items-center py-1 border-b">
                              <span className="font-medium text-gray-600">
                                Category:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {d.category_name}
                              </span>
                            </div>
                          )}
                          {d.manufacturer_name && (
                            <div className="flex justify-between items-center py-1 border-b">
                              <span className="font-medium text-gray-600">
                                Manufacturer:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {d.manufacturer_name}
                              </span>
                            </div>
                          )}
                          {d.vendor_name && (
                            <div className="flex justify-between items-center py-1 border-b">
                              <span className="font-medium text-gray-600">
                                Vendor:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {d.vendor_name}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center py-1 border-b">
                            <span className="font-medium text-gray-600">
                              Status:
                            </span>
                            <span
                              className={`font-semibold ${
                                d.active ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {d.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b">
                            <span className="font-medium text-gray-600">
                              Tax:
                            </span>
                            <span className="text-gray-800 font-semibold">
                              ${d.total_tax}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="font-medium text-gray-600">
                              Restricted:
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {d.restricted ? "Yes" : "No"}
                            </span>
                          </div>

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
                          <h4 className="font-semibold text-md mb-3 text-gray-700">
                            Product Variants ({d.variants.length})
                          </h4>
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

                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">
                                        Price:
                                      </span>
                                      <span className="text-gray-800 font-semibold">
                                        ${variant.product_price}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">
                                        Discount:
                                      </span>
                                      <span className="text-gray-800 font-semibold">
                                        {variant.product_discount}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">
                                        Available:
                                      </span>
                                      <span className="text-gray-800 font-semibold">
                                        {variant.available_count}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="font-medium text-gray-600">
                                        Short Code:
                                      </span>
                                      <span className="text-gray-800 font-semibold">
                                        {variant.short_code || "N/A"}
                                      </span>
                                    </div>
                                  </div>

                                  {variant.variant_description && (
                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                      <h5 className="font-medium text-gray-700 mb-1">
                                        Variant Description:
                                      </h5>
                                      <p className="text-sm text-gray-600 leading-relaxed">
                                        {variant.variant_description}
                                      </p>
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
