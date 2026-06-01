// src/lib/mockApi.ts

export interface Vendor {
  id: string;
  name: string;
  description: string;
  address: string;
  image: string | null;
  isActive: boolean;
}

export async function getVendorDetails(sellerId: string): Promise<Vendor | null> {
  // Simulamos latencia de red para probar estados de carga
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Datos mockeados que cumplen con el contrato de mi compañero de SellerApp
  return {
    id: sellerId,
    name: "AguaYa Provider Example",
    description: "Distribuidor oficial de bidones premium",
    address: "Av. Principal 123",
    image: null,
    isActive: true,
  };
}