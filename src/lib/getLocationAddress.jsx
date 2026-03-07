export function parseLatLon(locationString) {
  if (!locationString) return null;

  const [lat, lon] = locationString.replace(/[()]/g, "").split(",").map(Number);

  return { lat, lon };
}

export async function getLocationAddress(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
    );

    if (!res.ok) return null;

    const data = await res.json();

    return data?.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}
