export default function Loading({ count = 6 }) {
  return (
    <div className="w-full">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="mb-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all animate-pulse"
        >
          <div className="flex items-center justify-between w-full px-4 py-6">
            <div className="flex items-center gap-4 flex-grow">
              <div className="w-12 h-12 rounded border bg-gray-300" />
              <div className="h-4 w-40 bg-gray-300 rounded" />
            </div>
            <div className="ml-4 h-8 w-24 bg-gray-300 rounded" />
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-6 gap-4">
        <div className="h-8 w-20 bg-gray-300 rounded" />
        <div className="h-6 w-16 bg-gray-200 rounded self-center" />
        <div className="h-8 w-20 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
