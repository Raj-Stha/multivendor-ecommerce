import CategoryList from "../../../../../components/admin/(categorygroup)/category/CategoryList";
import AddCatgeoryForm from "../../../../../components/admin/(categorygroup)/category/form/AddCategoryForm";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

async function getData(url, formData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      cache: "no-store", // always fresh SSR
    });

    if (!res.ok) {
      console.error("Failed to fetch categories");
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function CategoryAdmin({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const limit = 10;

  const categoriesRes = await getData(`${baseUrl}/getcategory`, {
    page_number: page,
    limit,
  });

  const notesRes = await getData(`${baseUrl}/getcategorynotes`, {
    page_number: page,
    limit: 0,
  });

  const data = categoriesRes?.details || [];
  const meta = categoriesRes?.hint || { page_number: page, total_pages: 1 };
  const categoryNotes = notesRes?.details || [];

  return (
    <div className="container max-w-7xl mx-auto px-[2%] py-[2%]">
      <div className="flex items-center justify-between mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Categories
        </h2>
        <div className="flex gap-2">
          <AddCatgeoryForm />
        </div>
      </div>

      <CategoryList
        data={data}
        categoryNotes={categoryNotes}
        meta={meta}
        page={page}
      />
    </div>
  );
}
