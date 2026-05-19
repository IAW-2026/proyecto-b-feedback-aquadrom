import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Limpiar base de datos (opcional, cuidado con producción)
  await prisma.valoracion.deleteMany({});
  await prisma.adminFeedback.deleteMany({});

 

  // Crear una Valoración de prueba
  await prisma.valoracion.create({
    data: {
      id_pedido: 'pedido_123',
      id_usuario: 'user_clerk_1',
      id_vendedor: 'vendedor_clerk_1',
      estrellas: 5,
      comentario: '¡Excelente servicio!',
    },
  });

  // Crear Admin de prueba
  await prisma.adminFeedback.create({
    data: {
      id_usuario: 'admin_clerk_1',
      nombre: 'Administrador Principal',
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
