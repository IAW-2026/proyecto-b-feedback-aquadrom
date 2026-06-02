# AguaYa Feedback

🚀 Deploy de Producción  
https://proyecto-b-feedback-aquadrom.vercel.app/

👥 Usuarios de Prueba  
Usuario buyer:  
    -email: buyerfb+clerk\_test@iaw.com  
    -contraseña: iawuser\#

Usuario seller:(Usuario de vendedor VEND\_1)  
    -email: sellerfb+clerk\_test@iaw.com  
    -contraseña: iawuser\#

Usuario Admin:  
    -email: adminfb+clerk\_test@iaw.com  
    -contraseña: iawuser\#

En el caso de no tener acceso al mail, usar el código de verificación 424242\.

📖 Instrucciones de Uso

Para Clientes:  
Acceder a /resenas para ver las valoraciones públicas.  
Acceder a /review/[id\_pedido] (ej: /review/PED-123) para calificar un pedido. Es necesario estar logueado.

Para Sellers:  
Iniciar sesión con un usuario con rol seller.  
Acceder al panel en /seller para ver estadísticas de desempeño y el detalle de sus reseñas.

Para Administradores:  
Iniciar sesión con un usuario con rol admin.  
Acceder a /admin/resenas para moderar y eliminar valoraciones inapropiadas.

📝 Descripción del Proyecto  
AguaYa Feedback es una plataforma especializada en la gestión de valoraciones y feedback para el servicio de entrega de agua AguaYa. El sistema actúa como puente entre el cliente final, el proveedor y la administración, permitiendo un control de calidad transparente y eficiente sobre la logística de entrega.

La aplicación permite a los usuarios calificar sus pedidos mediante un sistema de estrellas y comentarios, integrando la carga de fotografías con Cloudinary para evidenciar el estado de la entrega. Los vendedores cuentan con un tablero de métricas donde pueden monitorear su promedio de satisfacción, mientras que los administradores disponen de herramientas de moderación para mantener la integridad de la plataforma.

Técnicamente, el proyecto está construido con Next.js 16 (App Router), utilizando Prisma 7 y Neon (PostgreSQL) para la persistencia de datos. La autenticación y gestión de roles se maneja a través de Clerk, implementando un sistema de control de acceso basado en roles mediante publicMetadata.

⚙️ Instalación y Despliegue Local

Seguí estos pasos para ejecutar el proyecto en tu máquina local:  
Clonar el repositorio:  
git clone [https://github.com/IAW-2026/proyecto-b-feedback-aquadrom.git]  
cd feedback-app

Instalar dependencias:  
npm install  
Configurar variables de entorno:   
Crea un archivo .env en la raíz del proyecto basándote en el ejemplo proporcionado:  
cp .env.example .env  
Rellena las variables necesarias:  
Clerk: NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY y CLERK\_SECRET\_KEY.  
Neon/Postgres: DATABASE\_URL.  
Cloudinary: (Si se utiliza para las imágenes de las reseñas).  
Sincronizar la base de datos:   
Genera el cliente de Prisma y sincroniza el esquema con la base de datos:  
npx prisma generate  
npx prisma db push  
Ejecutar la aplicación:  
npm run dev  
La aplicación estará disponible en http://localhost:3000.

🛠️ Notas para la Corrección  
Arquitectura de Datos: Se implementó un Driver Adapter (@prisma/adapter-pg) para optimizar la conexión con Neon, asegurando la compatibilidad con el entorno Serverless de Vercel.  
Control de Acceso (RBAC): La protección de rutas se gestiona mediante un middleware personalizado (src/proxy.ts), validando los roles de admin y seller directamente desde la metadata de Clerk para evitar peticiones innecesarias a la base de datos.  
Optimización de Accesibilidad: Se realizó un trabajo exhaustivo de contraste de colores (estándares WCAG) y se añadieron etiquetas aria-label en componentes críticos para asegurar que la aplicación sea usable mediante lectores de pantalla.  
Simulación de API Externa: Dado que los pedidos provienen de un sistema externo(DeliveryApp), se implementó una capa de simulación en la lógica de negocio para validar la existencia de pedidos antes de permitir la creación de una reseña.  
Rendimiento y SEO: Se optimizó el puntaje de Lighthouse alcanzando un 100 en SEO mediante la implementación de un archivo robots.txt y la correcta gestión de metadatos.
Noté que falto agregar la característica que, al ver las reseñas en el panel de vendedores, no podes ver las imágenes asociadas(si existen) a tal reseña. Solo se pueden ver desde los “ver reseña”.