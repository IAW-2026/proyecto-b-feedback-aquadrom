# AguaYa Feedback

🚀 Deploy de Producción  
https://proyecto-b-feedback-aquadrom.vercel.app/

👥 Usuarios de Prueba  
Usuario buyer:  
    -email: buyerfb+clerk\_test@iaw.com  
    -contraseña: iawuser\#

Usuario seller:  
    -email: sellerfb+clerk\_test@iaw.com  
    -contraseña: iawuser\#

Usuario Admin:  
    -email: adminfb+clerk\_test@iaw.com  
    -contraseña: iawuser\#

En el caso de no tener acceso al mail, usar el código de verificación 424242.

📖 Instrucciones de Uso

Para Clientes:  
Acceder a /resenas para ver las valoraciones públicas.  
Acceder a /review/[id\_pedido] para calificar un pedido. Es necesario estar logueado.

Para Sellers:  
Iniciar sesión con un usuario con rol seller.  
Acceder al panel en /seller para ver estadísticas de desempeño y el detalle de sus reseñas.

Para Administradores:  
Iniciar sesión con un usuario con rol admin.  
Acceder a /admin/resenas para moderar y eliminar valoraciones inapropiadas.

📝 Descripción del Proyecto  
AguaYa Feedback es una plataforma especializada en la gestión de valoraciones y feedback para el servicio de entrega de agua AguaYa. El sistema actúa como puente entre el cliente final (Buyer App), el vendedor (Seller App), la logística (Delivery/Control Plane) y la administración (Analytics Dashboard), permitiendo un control de calidad transparente y eficiente sobre la logística de entrega.

La aplicación permite a los usuarios calificar sus pedidos mediante un sistema de estrellas y comentarios, integrando la carga de fotografías con Cloudinary para evidenciar el estado de la entrega. Los vendedores cuentan con un tablero de métricas donde pueden monitorear su promedio de satisfacción, mientras que los administradores disponen de herramientas de moderación para mantener la integridad de la plataforma.

Técnicamente, el proyecto está construido con Next.js 16 (App Router), utilizando Prisma 7 y Neon (PostgreSQL) para la persistencia de datos. La autenticación y gestión de roles se maneja a través de Clerk con un sistema de múltiples roles mediante publicMetadata.roles (array).

🔌 Conexiones con Otras Apps

Feedback App se integra con 3 aplicaciones externas a través de APIs REST:

**Buyer App** - `BUYER_API_URL` / `BUYER_API_KEY`
- **Webhook de pedidos:** Cuando Delivery App crea un pedido, envía un request a `POST /api/webhooks/pedidos` con `{ id_pedido }`. Feedback App consulta a Buyer App (`GET /api/orders/{id}`) para obtener los detalles completos del pedido (vendedor, comprador, items, estado) y los persiste localmente.
- Flujo: Delivery App → Feedback App (webhook) → Buyer App (fetch order) → DB local.

**Seller App** - `SELLER_API_URL` / `SELLER_API_KEY`
- **Resolución de vendedores:** Cuando un usuario con rol seller accede a su panel, Feedback App consulta a Seller App (`GET /api/vendors/{userId}`) para resolver el Clerk userId al vendor ID (Prisma cuid) y así filtrar sus reseñas. Este endpoint busca primero por id (cuid) y si no encuentra, por userId (Clerk ID).
- **Detalle de vendedor:** Al visualizar una reseña pública, se enriquece con datos del vendedor (nombre, dirección, imagen) obtenidos desde Seller App (`GET /api/vendors/{vendorId}`).
- **Estadísticas de reseñas:** Seller App puede consultar `GET /api/feedback/reviews/{sellerId}` para obtener el promedio y reseñas recientes de un vendedor.

**Analytics Dashboard / Control Plane** - `ANALYTICS_API_KEY`
- **Estadísticas:** 5 endpoints bajo `/api/analytics/` para obtener métricas generales, reseñas, valoraciones, y rankings de vendedores.
- **Control:** 2 endpoints bajo `/api/control/` para eliminar reseñas y valoraciones desde el panel de administración central.

Todas las API keys son distintas y se validan mediante el header `x-api-key`. Si las variables de entorno no están configuradas, los endpoints operan en modo desarrollo sin autenticación.

⚙️ Instalación y Despliegue Local

Seguí estos pasos para ejecutar el proyecto en tu máquina local:  
Clonar el repositorio:  
git clone https://github.com/IAW-2026/proyecto-b-feedback-aquadrom.git  
cd feedback-app

Instalar dependencias:  
npm install  
Configurar variables de entorno:   
Crea un archivo .env en la raíz del proyecto basándote en el ejemplo proporcionado:  
cp .env.example .env  
Rellena las variables necesarias:  
- Clerk: NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY y CLERK\_SECRET\_KEY.  
- Neon/Postgres: DATABASE\_URL.  
- Cloudinary: (Si se utiliza para las imágenes de las reseñas).  
- Buyer App: BUYER\_API\_URL y BUYER\_API\_KEY.  
- Seller App: SELLER\_API\_URL y SELLER\_API\_KEY.  
- Analytics/Control: ANALYTICS\_API\_KEY.  
- Webhook: WEBHOOK\_API\_KEY.  
Sincronizar la base de datos:   
Genera el cliente de Prisma y sincroniza el esquema con la base de datos:  
npx prisma generate  
npx prisma db push  
Ejecutar la aplicación:  
npm run dev  
La aplicación estará disponible en http://localhost:3000.

🛠️ Notas Técnicas

**Arquitectura de Datos:** Se implementó un Driver Adapter (@prisma/adapter-pg) para optimizar la conexión con Neon, asegurando la compatibilidad con el entorno Serverless de Vercel.

**Control de Acceso (RBAC):** La protección de rutas se gestiona mediante src/proxy.ts, validando roles desde publicMetadata.roles (array) de Clerk. Los usuarios pueden tener múltiples roles (ej: ["admin", "seller"]).

**Roles como Array:** El sistema de roles migró de un string único (`role`) a un array (`roles`). Un usuario puede ser admin y seller simultáneamente. El código es retrocompatible: si encuentra el campo `role` antiguo, lo trata como un array de un elemento.

**Webhook de Pedidos:** Delivery App solo necesita enviar el `id_pedido`. Feedback App consulta los detalles a Buyer App, evitando duplicar lógica y manteniendo la fuente de verdad de pedidos en Buyer App.

**Simulación de API Externa:** Se implementó una capa en mockApi.ts que consulta las APIs reales de Seller y Buyer Apps, con caché mediante `next.revalidate` para evitar llamadas innecesarias.

**Rendimiento y SEO:** Se optimizó el puntaje de Lighthouse alcanzando un 100 en SEO mediante la implementación de un archivo robots.txt y la correcta gestión de metadatos.
