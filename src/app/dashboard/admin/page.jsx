import AdminDashboardList from "../../../components/admin/dashboard/AdminDashboardList";

async function getDetails(url, data) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store", // always fresh
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (err) {
    console.error(`Error fetching: ${url}`, err);
    return null;
  }
}

export default async function AdminDashboard({ searchParams }) {
  const search = await searchParams;
  const dateFrom = search?.date_from || "2025-01-01";
  const dateTo = search?.date_to || "2026-01-01";

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  const requestBody = { date_from: dateFrom, date_to: dateTo };

  const adminDetails = await getDetails(`${baseUrl}/getdash`, requestBody);

  return (
    <>
      {adminDetails && (
        <AdminDashboardList
          initialData={adminDetails?.details}
          initialDateFrom={dateFrom}
          initialDateTo={dateTo}
        />
      )}
    </>
  );
}
