import UserAdmin from "@/components/admin/(usergroup)/user-notes/usernotes-admin";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

async function getUserNotes(page = 1, limit = 10) {
  try {
    const res = await fetch(`${baseUrl}/getusernotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_number: page, limit }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch user notes");
    const result = await res.json();
    return {
      data: result?.details || [],
      meta: result?.hint || { page_number: page, total_pages: 1 },
    };
  } catch (err) {
    console.error("Error fetching:", err);
    return { data: [], meta: { page_number: 1, total_pages: 1 } };
  }
}

export default async function UserNotes({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const { data, meta } = await getUserNotes(page);

  return <UserAdmin initialData={data} initialMeta={meta} initialPage={page} />;
}
