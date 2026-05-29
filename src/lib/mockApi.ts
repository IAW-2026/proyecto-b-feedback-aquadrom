// src/lib/mockApi.ts

// Simulamos que llamamos a la API de la Seller App para obtener detalles del pedido
export async function getExternalPedido(id_pedido: string) {
  // Simulamos un delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Datos mockeados que simulan lo que nos devolvería la otra App
  return {
    id_pedido: id_pedido,
    id_vendedor: "vend_789", // ID simulado
    id_comprador: "user_clerk_1",
    snapshot_producto_nombre: "Agua Mineral 20L Premium",
    snapshot_producto_precio: 4500.0,
    estado: "Entregado",
    fecha: new Date(),
    monto: 9000.0,
  };
}
