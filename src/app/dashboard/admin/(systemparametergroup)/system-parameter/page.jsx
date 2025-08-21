"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CategoryListSkeleton from "../../../../../components/admin/Skeleton/CategooryListSkeleton";
import ParameterList from "../../../../../components/admin/(systemparametergroup)/system/ParameterList";

async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      console.error("Failed to fetch parameter");
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default function SystemParameter() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page_number: 1, total_pages: 1 });
  const [page, setPage] = useState(1);
  const limit = 10;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";

  const getParameters = async () => {
    try {
      setIsLoading(true);
      let url = `${baseUrl}/getparameters`;
      const parameterRes = await getData(url, { page_number: page, limit });

      if (parameterRes) {
        setData(parameterRes.details || []);
        setMeta(parameterRes.hint || { page_number: page, total_pages: 1 });
      }
    } catch (error) {
      console.error("Error fetching parameter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getParameters();
  }, [page]);

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Manage System</h2>
      </div>

      {isLoading ? (
        <CategoryListSkeleton count={6} />
      ) : (
        <>
          <ParameterList
            data={data}
            meta={meta}
            page={page}
            setPage={setPage}
          />
        </>
      )}
    </div>
  );
}
