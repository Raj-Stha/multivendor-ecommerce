"use client";

export function UserLoading() {
  const skeletonFields = Array(6).fill(0);

  return (
    <div className="animate-pulse space-y-5">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      {skeletonFields.map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
      <div className="w-full flex justify-center py-8">
        <div className="h-10 w-40 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
