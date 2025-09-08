"use client";

import { useRouter } from "next/navigation";
import ParameterList from "./parameter-list";

export default function SystemParameterAdmin({
  initialData,
  initialMeta,
  initialPage,
}) {
  const router = useRouter();

  const handlePageChange = (newPage) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage System Parameters
        </h2>
      </div>

      <ParameterList
        data={initialData}
        meta={initialMeta}
        page={initialPage}
        setPage={handlePageChange}
      />
    </div>
  );
}
