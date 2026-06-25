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
    if (!json.success) return null;

    return (json.vendor || json.vendors?.[0]) as Vendor | null;
  } catch {
    return null;
  }
}

export async function getSellerIdByUserId(userId: string): Promise<string | null> {
  const baseUrl = process.env.SELLER_API_URL;
  const apiKey = process.env.SELLER_API_KEY;

  if (!baseUrl || !apiKey) return null;

  try {
    const res = await fetch(`${baseUrl}/api/vendors/${userId}`, {
      headers: { 'X-API-Key': apiKey },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const vendor = json.vendor || json.vendors?.[0];
    return vendor?.id ?? null;
  } catch {
    return null;
  }
}
