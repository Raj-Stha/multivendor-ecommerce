"use client";

import { useRouter } from "next/navigation";
import ParameterList from "./parameter-list";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
    <>
      <header className="sticky top-0 z-50 w-full shadow py-5 px-3 bg-white">
        <div className="flex items-center justify-between ">
          <div className="flex space-x-2 items-center">
            <SidebarTrigger />
            <h2 className="lg:text-2xl md:text-xl font-semibold text-gray-800">
              Manage System Parameters
            </h2>
          </div>
        </div>
      </header>
      <div className="container  mx-auto px-[2%] py-[2%]">
        <ParameterList
          data={initialData}
          meta={initialMeta}
          page={initialPage}
          setPage={handlePageChange}
        />
      </div>
    </>
  );
}
