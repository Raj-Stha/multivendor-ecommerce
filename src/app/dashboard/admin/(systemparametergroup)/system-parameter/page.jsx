import SystemParameterAdmin from "@/components/admin/(systemparametergroup)/system/parameter-admin";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

async function getParameters(page = 1, limit = 10) {
  try {
    const res = await fetch(`${baseUrl}/getparameters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_number: page, limit }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch parameters");
    const result = await res.json();
    return {
      data: result?.details || [],
      meta: result?.hint || { page_number: page, total_pages: 1 },
    };
  } catch (err) {
    console.error("Error fetching parameters:", err);
    return { data: [], meta: { page_number: 1, total_pages: 1 } };
  }
}

export default async function Page({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const { data, meta } = await getParameters(page);

  return (
    <SystemParameterAdmin
      initialData={data}
      initialMeta={meta}
      initialPage={page}
    />
  );
}
