// src/lib/mockApi.ts

export interface Vendor {
  id: string;
  name: string;
  description: string | null;
  address: string;
  image: string | null;
  isActive: boolean;
}

export async function getVendorDetails(sellerId: string): Promise<Vendor | null> {
  const baseUrl = process.env.SELLER_API_URL;
  const apiKey = process.env.SELLER_API_KEY;

  if (!baseUrl || !apiKey) return null;

  try {
    const res = await fetch(`${baseUrl}/api/vendors/${sellerId}`, {
      headers: { 'X-API-Key': apiKey },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (!json.success || !json.vendors?.length) return null;

    return json.vendors[0] as Vendor;
  } catch {
    return null;
  }
}
