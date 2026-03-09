import PromoList from "../../../../../components/admin/(promogroup)/promo/PromoList";
import AddPromoForm from "../../../../../components/admin/(promogroup)/promo/form/AddPromoForm";
import { SidebarTrigger } from "@/components/ui/sidebar";
export const dynamic = "force-dynamic"; // ensures fresh data on each request

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
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
}

export default async function Promo({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  // Fetch promos
  const promoRes = await getData(`${baseUrl}/getpromos`, {
    page_number: page,
    limit,
  });
  const data = promoRes?.details || [];
  const meta = promoRes?.hint || { page_number: page, total_pages: 1 };

  // Fetch promo notes
  const notesRes = await getData(`${baseUrl}/getpromosnotes`, {
    page_number: page,
    limit,
  });
  const promoNotes = notesRes?.details || [];

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow py-5 px-3 bg-white">
        <div className="flex items-center justify-between ">
          <div className="flex space-x-2 items-center">
            <SidebarTrigger />
            <h2 className="lg:text-2xl md:text-xl text-base font-semibold text-gray-800">
              Manage Promos
            </h2>
          </div>
          <div className="flex gap-2">
            <AddPromoForm />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-[2%] py-[2%]">
        <PromoList
          data={data}
          promoNotes={promoNotes}
          meta={meta}
          page={page}
        />
      </div>
    </>
  );
}
