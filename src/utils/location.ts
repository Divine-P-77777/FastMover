// utils/location.ts

export async function getAddressFromCoords(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
      headers: { 'User-Agent': 'FastMover/1.0 (support@fastmover.com)' },
    });
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();
    return data.display_name || null;
  } catch {
    return null;
  }
}

export async function getCoordsFromAddress(query: string): Promise<{ lat: number; lon: number }[]> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=5`);
    const data = await res.json();
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch {
    return [];
  }
}
