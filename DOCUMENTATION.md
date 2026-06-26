# Documentación Técnica — AguaYa Feedback

## Índice

1. [Visión General](#1-visión-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Modelo de Datos](#3-modelo-de-datos)
4. [Autenticación y Autorización](#4-autenticación-y-autorización)
5. [Server Actions](#5-server-actions)
6. [API Routes](#6-api-routes)
7. [Componentes](#7-componentes)
8. [Rutas y Navegación](#8-rutas-y-navegación)
9. [Integración con Sistemas Externos](#9-integración-con-sistemas-externos)
10. [Seguridad](#10-seguridad)
11. [Flujo del Sistema](#11-flujo-del-sistema)
12. [Desarrollo y Despliegue](#12-desarrollo-y-despliegue)

---

## 1. Visión General

**AguaYa Feedback** es una plataforma de gestión de valoraciones y feedback para el servicio de delivery de agua AguaYa. Forma parte de un ecosistema de 5 microservicios (Buyer App, Seller App, Delivery App, Payments App, Feedback App) que componen una solución integral de e-commerce y logística.

### Propósito

- Permitir que los **compradores** califiquen sus pedidos de agua mediante reseñas con estrellas, comentarios y fotos.
- Proveer a los **vendedores** un tablero con métricas de satisfacción y detalle de reseñas recibidas.
- Brindar a los **administradores** herramientas de moderación para gestionar reseñas y valoraciones.
- Exponer **APIs públicas** para que otras apps (Seller App, Analytics Dashboard, Control Plane) consuman datos de feedback.

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Base de datos | Neon (PostgreSQL) + Prisma 7 |
| Autenticación | Clerk (con RBAC via publicMetadata) |
| Estilos | Tailwind CSS v4 |
| Imágenes | Cloudinary (subida de fotos en reseñas) |
| Fuentes | Montserrat (headlines), Inter (body) |
| Tema | next-themes (dark/light mode) |

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      FEEDBACK APP (Next.js 16)                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Pages   │  │ Actions  │  │ API      │  │  Components   │  │
│  │ (SSR/CSR)│  │(Server   │  │ (REST)   │  │  (UI/Shared)  │  │
│  │          │  │ Actions) │  │          │  │               │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬───────┘  │
│       └──────────────┴─────────────┴─────────────────┘          │
│                            │                                    │
│              ┌─────────────┴─────────────┐                      │
│              │        Prisma ORM         │                      │
│              │  (Neon PostgreSQL)        │                      │
│              └───────────────────────────┘                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Clerk Auth (Proxy + Middleware)              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
   ┌────────────┐    ┌──────────────┐    ┌──────────────────┐
   │  Buyer App │    │  Seller App  │    │ Analytics/Control │
   │ (Pedidos)  │    │ (Vendedores) │    │ (Dashboard)      │
   └────────────┘    └──────────────┘    └──────────────────┘
```

### Principios Arquitectónicos

- **Server Components por defecto**: Solo se usa `'use client'` cuando es estrictamente necesario (eventos, hooks, estado local).
- **Server Actions**: Toda operación de escritura en DB se hace mediante Server Actions. Nunca se expone lógica de base de datos al cliente.
- **Autenticación en cada acción**: Cada Server Action verifica la sesión mediante `auth()` de Clerk, incluso si el proxy ya protegió la ruta.
- **API Keys para integraciones externas**: Cada app externa tiene su propia API key. Si no hay key configurada, los endpoints operan en modo desarrollo sin autenticación.
- **Webhook delegado**: Feedback App no recibe datos completos del pedido. Delivery App envía solo el `id_pedido`, y Feedback App consulta los detalles a Buyer App.

---

## 3. Modelo de Datos

### Esquema Prisma (`prisma/schema.prisma`)

#### `Resena`
Reseñas de pedidos hechas por compradores.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_resena` | `Int @id @default(autoincrement())` | Clave primaria |
| `id_pedido` | `String @unique` | ID del pedido en Buyer App (relación 1:1 con Pedido) |
| `id_usuario` | `String` | Clerk User ID del comprador |
| `id_vendedor` | `String` | Vendor ID (Prisma cuid) del vendedor calificado |
| `estrellas` | `Int` | Calificación del 1 al 5 |
| `comentario` | `String?` | Comentario opcional |
| `foto` | `String?` | URL de imagen en Cloudinary |
| `fecha` | `DateTime @default(now())` | Fecha de creación |

**Relaciones**: `Resena.pedido → Pedido` (1:1 vía `id_pedido`)

#### `Valoracion`
Valoraciones generales de la aplicación (no vinculadas a un pedido específico).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_valoracion` | `Int @id @default(autoincrement())` | Clave primaria |
| `id_usuario` | `String` | Clerk User ID del usuario |
| `comentario` | `String` | Texto de la valoración |
| `estrellas` | `Int` | Calificación del 1 al 5 |
| `fecha` | `DateTime @default(now())` | Fecha de creación |

#### `Pedido`
Pedidos sincronizados desde Buyer App vía webhook.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_pedido` | `String @id` | ID del pedido (desde Buyer App) |
| `id_vendedor` | `String` | Vendor ID del vendedor |
| `id_comprador` | `String` | Clerk User ID del comprador |
| `snapshot_producto_nombre` | `String` | Nombre del producto al momento del pedido |
| `snapshot_producto_precio` | `Float` | Precio del producto al momento del pedido |
| `estado` | `String` | Estado del pedido (PENDING, READY, DELIVERED, etc.) |
| `fecha` | `DateTime @default(now())` | Fecha del pedido |
| `monto` | `Float` | Monto total |

**Relaciones**: `Pedido.resena → Resena` (1:1 opcional vía `id_pedido`)

#### `AdminFeedback`
Usuarios administradores registrados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_admin` | `Int @id @default(autoincrement())` | Clave primaria |
| `id_usuario` | `String @unique` | Clerk User ID del admin |
| `nombre` | `String` | Nombre del administrador |

> **Nota:** Este modelo está definido en el schema pero actualmente no se usa en las verificaciones de rol. El control de acceso admin se maneja exclusivamente mediante `publicMetadata.roles` de Clerk.

### Diagrama de Relaciones

```
┌──────────┐       ┌──────────┐
│  Pedido  │1──────1│  Resena  │
└──────────┘       └──────────┘

┌──────────────┐
│  Valoracion  │ (independiente)
└──────────────┘

┌────────────────┐
│  AdminFeedback │ (no usado activamente)
└────────────────┘
```

---

## 4. Autenticación y Autorización

### Clerk Proxy (`src/proxy.ts`)

Next.js 16 renombró Middleware a Proxy. El archivo `src/proxy.ts` es el punto de entrada para toda la lógica de autenticación previa a las rutas.

```typescript
// Rutas públicas (no requieren autenticación)
const isPublicRoute = createRouteMatcher([
  '/api/faqs',                 // FAQs
  '/api/webhooks/pedidos',     // Webhook de Delivery App
  '/api/feedback/reviews(.*)', // API para Seller App
  '/api/analytics(.*)',        // API para Analytics Dashboard
  '/api/control(.*)',          // API para Control Plane
  '/sign-in(.*)',              // Login Clerk
  '/sign-up(.*)',              // Registro Clerk
  '/',                         // Home
  '/resenas(.*)',              // Reseñas públicas
]);
```

- Las rutas **no públicas** requieren autenticación vía `auth.protect()`.
- Las rutas de API externas se validan con API keys **dentro de cada handler**, no en el proxy.
- El `matcher` del proxy excluye archivos estáticos pero incluye todas las rutas de API y páginas.

### Roles (RBAC)

Los roles se almacenan en `publicMetadata.roles` (array) de Clerk.

```typescript
// Lectura con retrocompatibilidad
const publicMetadata = (user as any)?.publicMetadata ?? {};
const roles: string[] = Array.isArray(publicMetadata.roles)
  ? publicMetadata.roles
  : publicMetadata.role
    ? [publicMetadata.role]   // Fallback: campo 'role' antiguo (string)
    : [];
```

**Roles disponibles:**
- `"admin"` — Acceso a `/admin/*` (moderación de reseñas y valoraciones)
- `"seller"` — Acceso a `/seller/*` (panel de vendedor con métricas)

**Un usuario puede tener múltiples roles:** `["admin", "seller"]`

### Verificación en Server Actions

Toda Server Action verifica la sesión explícitamente:

```typescript
const { userId } = await auth();
if (!userId) throw new Error('No autorizado');
```

### Verificación en API Routes

Las API routes externas usan API key:

```typescript
const apiKey = request.headers.get('x-api-key');
const expectedKey = process.env.WEBHOOK_API_KEY;
if (expectedKey && apiKey !== expectedKey) {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}
```

Si `expectedKey` no está definida (modo desarrollo), la autenticación se salta.

---

## 5. Server Actions

Las Server Actions están en `src/app/actions/`. Son funciones asíncronas que se ejecutan exclusivamente en el servidor y pueden ser invocadas desde componentes del cliente.

### `resenas.ts`
| Función | Auth | Descripción |
|---------|------|-------------|
| `createResena({ id_pedido, estrellas, comentario?, foto? })` | Sí | Crea una reseña. Busca el `id_vendedor` desde el `Pedido` asociado. Revalida `/review`. |
| `getResenasByUser()` | Sí | Devuelve todas las reseñas del usuario autenticado. |
| `getResenaById(id_resena: number)` | No | Obtiene una reseña por ID. Usada en páginas públicas. |

### `pedidos.ts`
| Función | Auth | Descripción |
|---------|------|-------------|
| `getPedidosByUser(page, limit)` | Sí | Devuelve pedidos paginados del usuario autenticado (filtrados por `id_comprador`). Retorna `{ pedidos, total, totalPages, currentPage }`. |
| `getPedidoById(id_pedido)` | Sí | Obtiene un pedido individual por ID. |

### `seller.ts`
| Función | Auth | Descripción |
|---------|------|-------------|
| `getSellerStats()` | Sí | Obtiene el Clerk `userId`, lo resuelve a un vendor ID via `getSellerIdByUserId()` (consulta a Seller App), y devuelve estadísticas de reseñas del vendedor. |
| `getSellerResenas()` | Sí | Mismo mecanismo de resolución de ID, devuelve todas las reseñas del vendedor ordenadas por fecha descendente. |

### `valoraciones.ts`
| Función | Auth | Descripción |
|---------|------|-------------|
| `createValoracion({ estrellas, comentario })` | Sí | Crea una valoración general de la app. Revalida `/value-us`. |
| `getValoraciones()` | No | Devuelve todas las valoraciones. |

### `moderacion.ts`
| Función | Auth | Descripción |
|---------|------|-------------|
| `deleteResena(id_resena: number)` | No (pero protegida por ruta admin) | Elimina una reseña por ID. Revalida `/admin/resenas`. |

### `resenaFilter.ts`
| Función | Auth | Descripción |
|---------|------|-------------|
| `handleFilter(formData)` | No | Redirige a `/resenas?sellerId=<value>` para filtrar reseñas públicas por vendedor. |

### `getResenas.ts`
| Función | Auth | Descripción |
|---------|------|-------------|
| `getResenasByUser()` | Sí | Duplicado funcional de `resenas.ts:getResenasByUser()`. Usado específicamente desde `review/page.tsx`. |

---

## 6. API Routes

Todas las rutas están en `src/app/api/`. Son endpoints REST que otras aplicaciones consumen.

### Autenticación

Cada endpoint valida la API key mediante el header `x-api-key`:

```typescript
const apiKey = req.headers.get('x-api-key');
const expectedKey = process.env.WEBHOOK_API_KEY;
if (expectedKey && apiKey !== expectedKey) {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}
```

### Webhook — `POST /api/webhooks/pedidos`

- **API Key:** `WEBHOOK_API_KEY`
- **Body:** `{ "id_pedido": "cmqt..." }`
- **Flujo:** Recibe el ID del pedido → consulta `GET /api/orders/{id}` en Buyer App → crea `Pedido` en DB local
- **Response:** `201 { success, pedido }` o `409 { error: "El pedido ya existe" }`

### Seller App — `GET /api/feedback/reviews/[sellerId]`

- **API Key:** `SELLER_API_KEY`
- **Response:** `{ promedio, total, ultimasResenas[] }`
- **Uso:** Seller App consume este endpoint para mostrar estadísticas de reseñas de un vendedor.

### Analytics — 5 Endpoints

Todas autenticadas con `ANALYTICS_API_KEY`.

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/analytics/stats` | Métricas aggregate: total reseñas, valoraciones, pedidos, promedio estrellas, distribución de estrellas (1-5), vendedores únicos. |
| `GET /api/analytics/reviews` | Reseñas paginadas con filtros opcionales: `page`, `limit`, `estrellas`, `startDate`, `endDate`. |
| `GET /api/analytics/valoraciones` | Valoraciones paginadas con mismos filtros. |
| `GET /api/analytics/vendors/top` | Top vendedores por promedio de estrellas (descendente). Parámetro opcional: `limit`. |
| `GET /api/analytics/vendors/bottom` | Peores vendedores por promedio de estrellas (ascendente). Parámetro opcional: `limit`. |

### Control Plane — 2 Endpoints

| Endpoint | Descripción |
|----------|-------------|
| `DELETE /api/control/reviews/[id]` | Elimina una reseña por ID. Verifica existencia antes de borrar. |
| `DELETE /api/control/valoraciones/[id]` | Elimina una valoración por ID. Verifica existencia antes de borrar. |

---

## 7. Componentes

Todos en `src/components/`. Organizados en:

### Navegación y Layout

| Componente | Tipo | Descripción |
|-----------|------|-------------|
| `Navbar.tsx` | Cliente | Navbar responsive con logo, hamburguesa mobile, ThemeToggle, SignInButton, UserButton. Muestra links a paneles admin/seller según `roles`. |
| `SellerLayoutClient.tsx` | Cliente | Wrapper del panel vendedor con sidebar y toggle mobile. |
| `SellerSidebar.tsx` | Cliente | Sidebar del vendedor: Dashboard, Mis Reseñas. |
| `AdminLayoutClient.tsx` | Cliente | Wrapper del panel admin con sidebar y toggle mobile. |
| `AdminSidebar.tsx` | Cliente | Sidebar del admin: Dashboard, Reseñas, Valoraciones. |
| `Providers.tsx` | Cliente | Envuelve la app con `ThemeProvider` de next-themes. |
| `ThemeToggle.tsx` | Cliente | Botón sol/luna para cambiar tema. |
| `ThemeScript.tsx` | Cliente | Script que aplica/remueve clase `dark` en `<html>`. |

### Feedback y Diálogos

| Componente | Tipo | Descripción |
|-----------|------|-------------|
| `ConfirmModal.tsx` | Cliente | Diálogo de confirmación reutilizable con título, mensaje y botones. Soporta variante `danger` (rojo) y `default`. |
| `AlertModal.tsx` | Cliente | Alerta con íconos (success/error/info), título, mensaje y botón "Aceptar". Cierra con Escape. |

### Visualización de Datos

| Componente | Tipo | Descripción |
|-----------|------|-------------|
| `Pagination.tsx` | Servidor | Links "Anterior"/"Siguiente" con indicador de página. Usa `buildHref` callback para generar URLs. Deshabilita en bordes. |
| `ReviewCard.tsx` | Servidor | Card de reseña reutilizable con estrella, comentario, fecha, y slot de acción. Usada en vistas mobile. |
| `ReviewDetail.tsx` | Servidor | Vista detalle de reseña: número de pedido, fecha, info del vendedor (si se provee), estrellas, comentario, foto (next/image). |
| `ImageLightbox.tsx` | Cliente | Botón "Ver imagen" → full-screen modal con la foto de la reseña. Cierra con backdrop click o botón cerrar. |

### Acciones

| Componente | Tipo | Descripción |
|-----------|------|-------------|
| `DeleteResenaButton.tsx` | Cliente | Botón basurero → `ConfirmModal` → llama a `deleteResena` server action. |

---

## 8. Rutas y Navegación

### Públicas (sin autenticación)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `page.tsx` | Home con hero, cards de navegación, banner CTA. |
| `/resenas` | `resenas/page.tsx` | Listado público de reseñas con filtro por vendedor. Vista mobile cards, desktop tabla. Paginado. |
| `/resenas/view/[id_resena]` | `resenas/view/[id_resena]/page.tsx` | Detalle de reseña con info del vendedor. |
| `/faqs` | `faqs/page.tsx` | Preguntas frecuentes en acordeón. |
| `/about-us` | `about-us/page.tsx` | Información del equipo y proyecto. |
| `/sign-in` | Clerk | Página de login de Clerk. |
| `/sign-up` | Clerk | Página de registro de Clerk. |
| `/value-us` | Cliente | Formulario de valoración de la app (requiere auth para enviar, pero la ruta es pública). |

### Protegidas (requieren autenticación)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/review` | `review/page.tsx` | Listado de pedidos del usuario con indicador de pendientes/reseñados. |
| `/review/[id_pedido]` | `review/[id_pedido]/page.tsx` | Formulario de creación de reseña con estrellas, comentario, foto Cloudinary. |
| `/review/view/[id_resena]` | `review/view/[id_resena]/page.tsx` | Detalle de reseña propia. |

### Admin (rol `admin`)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/admin` | `admin/page.tsx` | Dashboard con métricas: total reseñas, promedio estrellas, total valoraciones. |
| `/admin/resenas` | `admin/resenas/page.tsx` | Moderación: tabla de reseñas con búsqueda y eliminación. |
| `/admin/valoraciones` | `admin/valoraciones/page.tsx` | Listado de valoraciones con filtro por estrellas. |

### Seller (rol `seller`)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/seller` | `seller/page.tsx` | Dashboard con total reseñas y promedio de estrellas del vendedor. |
| `/seller/resenas` | `seller/resenas/page.tsx` | Lista detallada de reseñas recibidas con `ImageLightbox` para fotos. |

---

## 9. Integración con Sistemas Externos

### Buyer App (`BUYER_API_URL`, `BUYER_API_KEY`)

- **Propósito:** Obtener detalles de pedidos.
- **Endpoint consumido:** `GET {BUYER_API_URL}/api/orders/{id_pedido}`
- **Headers:** `x-api-key: BUYER_API_KEY`
- **Modelo esperado:**
  ```json
  {
    "order": {
      "order_id": "cmqt0jrhm...",
      "vendor_id": "cmpvxr5er...",
      "buyer_id": "...",
      "buyer_user_id": "user_3ExVhQU...",
      "status": "DELIVERED",
      "total": 110.0,
      "created_at": "2026-06-25T...",
      "items": [{ "name": "Bidon 20L" }]
    }
  }
  ```
- **Cache:** No cache (cada webhook es único).

### Seller App (`SELLER_API_URL`, `SELLER_API_KEY`)

- **Propósito:** Resolver Clerk userId a vendor ID y obtener detalles del vendedor.
- **Endpoint consumido:** `GET {SELLER_API_URL}/api/vendors/{id}`
- **Headers:** `X-API-Key: SELLER_API_KEY`
- **Comportamiento del endpoint:** Busca primero por `id` (Prisma cuid). Si no encuentra, busca por `userId` (Clerk ID).
- **Cache:** `next: { revalidate: 60 }` — 60 segundos de ISR cache.
- **Modelo esperado:**
  ```json
  {
    "vendor": {
      "id": "cmpvxr5er...",
      "name": "Distribuidora Norte",
      "description": "...",
      "address": "...",
      "image": "https://...",
      "isActive": true
    }
  }
  ```

#### Flujo de Resolución de Seller ID

```
1. Seller se loguea con Clerk → obtenemos userId = "user_abc123"
2. Llamamos GET /api/vendors/user_abc123 a Seller App
3. Seller App busca por id = "user_abc123" → no encuentra (es Clerk ID, no Prisma cuid)
4. Seller App busca por userId = "user_abc123" → encuentra vendor
5. Respuesta: { vendor: { id: "cmpvxr5er...", ... } }
6. Usamos "cmpvxr5er..." como sellerId para filtrar reseñas en nuestra DB
```

### Analytics Dashboard & Control Plane (`ANALYTICS_API_KEY`)

- **Propósito:** Proveer datos agregados y permitir moderación desde un panel central.
- **Feedback App expone:** 5 endpoints de analytics + 2 endpoints de control.
- **Autenticación:** Comparten la misma `ANALYTICS_API_KEY`.

### Delivery App (`WEBHOOK_API_KEY`)

- **Propósito:** Notificar nuevos pedidos.
- **Feedback App expone:** `POST /api/webhooks/pedidos`
- **Flujo:** Delivery App envía `{ id_pedido }` → Feedback App consulta Buyer App → crea `Pedido` en DB local.

### Diagrama de Integraciones

```
┌──────────────┐     Webhook (id_pedido)     ┌────────────────┐
│ Delivery App │ ──────────────────────────▶  │                │
└──────────────┘                              │   Feedback     │
                                              │     App        │
┌──────────────┐   GET /api/vendors/{id}      │                │
│  Seller App  │ ◀──────────────────────────  │                │
│              │   (resolver userId→vendorId)  │                │
│              │                              │                │
│              │   GET /api/feedback/          │                │
│              │     reviews/{sellerId}        │                │
│              │ ──────────────────────────▶   │                │
└──────────────┘                              │                │
                                              │                │
┌──────────────┐   GET /api/orders/{id}       │                │
│  Buyer App   │ ◀──────────────────────────  │                │
└──────────────┘   (fetch order details)      │                │
                                              │                │
┌──────────────────┐  GET /api/analytics/*    │                │
│ Analytics Dashbd.│ ──────────────────────▶  │                │
│                  │  DELETE /api/control/*   │                │
│ (Control Plane)  │ ──────────────────────▶  │                │
└──────────────────┘                          └────────────────┘
```

---

## 10. Seguridad

### API Keys

Se usan 3 API keys independientes para distintos propósitos:

| Variable | Propósito | Quién la usa |
|----------|-----------|-------------|
| `WEBHOOK_API_KEY` | Autenticar webhooks entrantes | Delivery App |
| `SELLER_API_KEY` | Autenticar llamadas a Seller App | Feedback App (outbound) + Seller App (inbound a `/api/feedback/reviews`) |
| `ANALYTICS_API_KEY` | Autenticar analytics y control | Analytics Dashboard, Control Plane |

**Comportamiento en desarrollo:** Si la variable de entorno no está definida, el endpoint omite la verificación y permite el acceso sin API key.

### Clerk Proxy

- Todas las rutas de páginas (excepto las públicas listadas) requieren autenticación.
- El proxy usa `createRouteMatcher` para declarar rutas públicas.
- Las rutas de API externas están en la lista de públicas, pero su seguridad se maneja internamente con API keys.

### Server Actions

- Cada Server Action verifica `auth().userId` antes de ejecutar.
- Las operaciones de escritura (`createResena`, `createValoracion`, `deleteResena`) siempre autentican.
- `deleteResena` no tiene verificación explícita de rol porque está protegida por el layout `/admin` que requiere rol `admin`.

### Protección de Rutas

- `/admin/*`: El layout `admin/layout.tsx` verifica que el usuario tenga rol `admin`. Si no, redirige a `/`.
- `/seller/*`: El layout `seller/layout.tsx` verifica que el usuario tenga rol `seller`. Si no, redirige a `/`.
- Las rutas protegidas por proxy pero sin layout específico redirigen a `/sign-in` si no hay sesión.

---

## 11. Flujo del Sistema

### 11.1 Creación de una Reseña

```
Usuario autenticado
       │
       ▼
  GET /review ──────────────────► getPedidosByUser() + getResenasByUser()
       │                              │
       │                         Muestra pedidos con estado de reseña
       ▼
  Click "Calificar Entrega"
       │
       ▼
  GET /review/[id_pedido] ──────► getPedidoById() → muestra formulario
       │
       ▼
  Formulario:
  1. Seleccionar estrellas (1-5)
  2. Escribir comentario (max 500)
  3. Subir foto a Cloudinary (opcional)
  4. Enviar
       │
       ▼
  createResena({ id_pedido, estrellas, comentario, foto }) ──► auth()
       │                                                          │
       │                                                   Verifica userId
       │                                                          │
       │                                                   prisma.pedido.findUnique()
       │                                                   (obtiene id_vendedor)
       │                                                          │
       │                                                   prisma.resena.create()
       │                                                          │
       │                                                   revalidatePath('/review')
       │                                                          │
       ▼                                                         ▼
  AlertModal("Reseña enviada")  ◄───── { success: true }
       │
       ▼
  Redirige a /review
```

### 11.2 Webhook de Pedido (Delivery → Feedback)

```
Delivery App (o quien corresponda)
       │
       ▼
  POST /api/webhooks/pedidos ────► Valida WEBHOOK_API_KEY
  { "id_pedido": "cmqt..." }            │
                                         ▼
                                  Fetch BUYER_API_URL/api/orders/{id_pedido}
                                         │
                                         ▼
                                  Si ok → prisma.pedido.create({ ... })
                                         │
                                         ▼
                                  Response: 201 { success, pedido }
```

### 11.3 Panel de Vendedor

```
Usuario con rol seller
       │
       ▼
  GET /seller ───────────────────► seller/layout.tsx
       │                              │
       │                         currentUser() → verifica role "seller"
       │                              │
       ▼                              ▼
  getSellerStats() ──────────────► auth().userId = "user_abc123"
       │                              │
       │                         getSellerIdByUserId("user_abc123")
       │                              │
       │                         GET {SELLER_API_URL}/api/vendors/user_abc123
       │                              │
       │                         Seller App busca por userId → devuelve vendor.id
       │                              │
       │                         sellerId = "cmpvxr5er..."
       │                              │
       │                         prisma.resena.findMany({ where: { id_vendedor: sellerId } })
       │                              │
       ▼                              ▼
  Muestra: Total reseñas | Promedio estrellas | Link a detalle
```

### 11.4 Analytics Dashboard

```
Analytics Dashboard (app externa)
       │
       ▼
  GET /api/analytics/stats ───────► Valida ANALYTICS_API_KEY
       │                              │
       │                         prisma.resena.aggregate(...)
       │                         prisma.valoracion.aggregate(...)
       │                         prisma.pedido.count(...)
       │                         prisma.resena.groupBy(...) [distribución estrellas]
       │                         prisma.resena.findMany({ distinct: ['id_vendedor'] })
       │                              │
       ▼                              ▼
  Response: { totalResenas, totalValoraciones, totalPedidos, avgStarsResenas, ... }
```

---

## 12. Desarrollo y Despliegue

### Variables de Entorno Requeridas

```env
# Database (Neon)
DATABASE_URL=postgresql://...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# API Keys
WEBHOOK_API_KEY=...
SELLER_API_KEY=...
ANALYTICS_API_KEY=...

# External Apps URLs
SELLER_API_URL=https://proyecto-b-seller-agua-ya.vercel.app
BUYER_API_URL=https://proyecto-b-buyer-agua-ya.vercel.app
BUYER_API_KEY=...
```

### Comandos Útiles

```bash
# Desarrollo
npm run dev

# Sincronizar DB (después de cambios en schema.prisma)
npx prisma generate
npx prisma db push

# Seed de datos
npx prisma db seed

# Prisma Studio (explorar DB)
npx prisma studio
```

### Scripts Disponibles (`package.json`)

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `next dev` | Servidor de desarrollo |
| `build` | `next build` | Build de producción |
| `start` | `next start` | Servidor de producción |
| `lint` | `next lint` | Linter |
| `seed` | `prisma db seed` | Poblar DB con datos de prueba |
| `db:push` | `prisma db push` | Sincronizar schema con DB |
| `db:generate` | `prisma generate` | Generar cliente Prisma |
| `db:studio` | `prisma studio` | Abrir Prisma Studio |

### Seed (`prisma/seed.ts`)

El seed crea:
- 5 pedidos de prueba con IDs reales de Seller App
- Reseñas asociadas a esos pedidos
- Valoraciones de prueba

```bash
npx prisma db seed
```

### Dark Mode

Implementado con `next-themes` y Tailwind CSS:
- El tema se persiste en localStorage.
- Clase `dark` en `<html>`.
- Todos los componentes usan `dark:` variantes de Tailwind.
- `ThemeToggle` alterna entre light, dark y system.
- `ThemeScript` previene el flash de tema incorrecto en la carga inicial.

---

## Apéndice: Estructura Completa de Archivos

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (ClerkProvider, Navbar, footer)
│   ├── page.tsx                      # Home page
│   ├── not-found.tsx                 # 404 page
│   ├── globals.css                   # Tailwind + CSS variables
│   ├── proxy.ts                      # Clerk Proxy (autenticación de rutas)
│   ├── actions/
│   │   ├── resenas.ts               # createResena, getResenasByUser, getResenaById
│   │   ├── pedidos.ts               # getPedidosByUser, getPedidoById
│   │   ├── seller.ts                # getSellerStats, getSellerResenas
│   │   ├── valoraciones.ts          # createValoracion, getValoraciones
│   │   ├── moderacion.ts            # deleteResena
│   │   ├── resenaFilter.ts          # handleFilter
│   │   └── getResenas.ts            # getResenasByUser (alias)
│   ├── api/
│   │   ├── webhooks/pedidos/route.ts
│   │   ├── faqs/route.ts            # (referenciado pero no existe)
│   │   ├── feedback/reviews/[sellerId]/route.ts
│   │   ├── analytics/
│   │   │   ├── stats/route.ts
│   │   │   ├── reviews/route.ts
│   │   │   ├── valoraciones/route.ts
│   │   │   └── vendors/
│   │   │       ├── top/route.ts
│   │   │       └── bottom/route.ts
│   │   └── control/
│   │       ├── reviews/[id]/route.ts
│   │       └── valoraciones/[id]/route.ts
│   ├── review/
│   │   ├── page.tsx                  # Listado de pedidos del usuario
│   │   ├── [id_pedido]/page.tsx      # Formulario de reseña
│   │   └── view/[id_resena]/page.tsx # Detalle de reseña propia
│   ├── resenas/
│   │   ├── page.tsx                  # Reseñas públicas
│   │   └── view/[id_resena]/page.tsx # Detalle público de reseña
│   ├── seller/
│   │   ├── layout.tsx               # Layout con verificación de rol seller
│   │   ├── page.tsx                  # Dashboard del vendedor
│   │   └── resenas/page.tsx         # Reseñas del vendedor
│   ├── admin/
│   │   ├── layout.tsx               # Layout con verificación de rol admin
│   │   ├── page.tsx                  # Dashboard admin
│   │   ├── resenas/page.tsx         # Moderación de reseñas
│   │   └── valoraciones/page.tsx    # Listado de valoraciones
│   ├── value-us/page.tsx            # Formulario de valoración de la app
│   ├── about-us/page.tsx            # Página del equipo
│   └── faqs/page.tsx                # Preguntas frecuentes
├── components/
│   ├── Navbar.tsx
│   ├── Pagination.tsx
│   ├── ReviewDetail.tsx
│   ├── ReviewCard.tsx
│   ├── ConfirmModal.tsx
│   ├── AlertModal.tsx
│   ├── ImageLightbox.tsx
│   ├── DeleteResenaButton.tsx
│   ├── AdminLayoutClient.tsx
│   ├── AdminSidebar.tsx
│   ├── SellerLayoutClient.tsx
│   ├── SellerSidebar.tsx
│   ├── Providers.tsx
│   ├── ThemeToggle.tsx
│   └── ThemeScript.tsx
└── lib/
    ├── prisma.ts                     # Singleton de Prisma Client
    └── mockApi.ts                    # Cliente API para Seller App
prisma/
├── schema.prisma
└── seed.ts
```
