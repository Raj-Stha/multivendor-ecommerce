import ManufacturerList from "../../../../../components/admin/(manufacturergroup)/manufacturer/ManufacturerList";
import AddManufacturerForm from "../../../../../components/admin/(manufacturergroup)/manufacturer/form/AddManufacturerForm";
import { SidebarTrigger } from "@/components/ui/sidebar";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      cache: "no-store", // ✅ always fresh data
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching:", error);
    return null;
  }
}

export default async function Manufacturer({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;

  // Fetch manufacturer list + notes on the server
  const [manufacturerRes, notesRes] = await Promise.all([
    getData(`${baseUrl}/getmanufacturer`, { page_number: page, limit }),
    getData(`${baseUrl}/getmanufacturernotes`, { page_number: page, limit: 0 }),
  ]);

  const data = manufacturerRes?.details || [];
  const meta = manufacturerRes?.hint || { page_number: page, total_pages: 1 };
  const categoryNotes = notesRes?.details || [];

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow py-5 px-3 bg-white">
        <div className="flex items-center justify-between ">
          <div className="flex space-x-2 items-center">
            <SidebarTrigger />
            <h2 className="lg:text-2xl md:text-xl text-base font-semibold text-gray-800">
              Manage Manufacturer
            </h2>
          </div>
          <div className="flex gap-2">
            <AddManufacturerForm />
          </div>
        </div>
      </header>
      <div className="container  mx-auto px-[2%] py-[2%]">
        <ManufacturerList
          data={data}
          categoryNotes={categoryNotes}
          meta={meta}
          page={page}
        />
      </div>
    </>
  );
}
