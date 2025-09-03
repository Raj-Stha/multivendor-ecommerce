export function ProductGrid({ products }) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {products.map((product) => {
          const firstVariant = product.variants?.[0];
          const price = firstVariant?.product_price || 0;
          const image =
            firstVariant?.featured_image ||
            firstVariant?.product_image?.[0]?.image;

          return (
            <div
              key={product?.product_id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                {image ? (
                  <img
                    src={image || "/placeholder.svg"}
                    alt={product?.product_name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
                {firstVariant?.product_discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    -{firstVariant.product_discount}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {product?.product_name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-blue-600">
                    ${price?.toFixed(2)}
                  </p>
                  {firstVariant?.available_count && (
                    <span className="text-xs text-gray-500">
                      Stock: {firstVariant.available_count}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <p>Category: {product?.category_name}</p>
                  <p>Vendor: {product?.vendor_name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
