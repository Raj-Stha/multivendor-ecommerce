export function parseLatLon(locationString) {
  if (!locationString) return null;

  const [lon, lat] = locationString.replace(/[()]/g, "").split(",").map(Number);

  return { lat, lon };
}

export async function getLocationAddress(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
    );

    if (!res.ok) return null;

    const data = await res.json();

    const address = data?.address;

    return (
      address?.city ||
      address?.town ||
      address?.village ||
      address?.municipality ||
      address?.county ||
      address?.suburb ||
      address?.state ||
      data?.display_name?.split(",")[0] ||
      `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    );
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}
