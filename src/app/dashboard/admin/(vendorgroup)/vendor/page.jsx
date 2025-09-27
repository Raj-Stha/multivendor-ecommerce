import VendorList from "../../../../../components/admin/(vendorgroup)/vendor/VendorList";
import AddVendorForm from "../../../../../components/admin/(vendorgroup)/vendor/form/AddVendorForm";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching:", error);
    return null;
  }
}

export default async function Vendor({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;

  const [vendorRes, notesRes] = await Promise.all([
    getData(`${baseUrl}/getvendor`, { page_number: page, limit }),
    getData(`${baseUrl}/getvendornotes`, { page_number: page, limit: 0 }),
  ]);

  const data = vendorRes?.details || [];
  const meta = vendorRes?.hint || { page_number: page, total_pages: 1 };
  const categoryNotes = notesRes?.details || [];

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Vendor</h2>
        <div className="flex gap-2">
          <AddVendorForm />
        </div>
      </div>

      <VendorList
        data={data}
        categoryNotes={categoryNotes}
        meta={meta}
        page={page}
      />
    </div>
  );
}
