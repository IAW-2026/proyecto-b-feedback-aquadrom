<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project Overview
Feedback-app es una plataforma para gestionar valoraciones y feedback.
Tech Stack: Next.js 16 (App Router), Prisma 7, Neon (PostgreSQL), Tailwind CSS, Clerk (Auth).

## Core Conventions

### 1. Database (Prisma)
- **Singleton Client:** Siempre usa `src/lib/prisma.ts` para importar `prisma`. No instancies `PrismaClient` directamente en los archivos de rutas.
- **Driver Adapter:** Cuando se interactúe con la base de datos fuera de las Server Actions estándar, recuerda que usamos `@prisma/adapter-pg`.
- **Schema Changes:** Cada cambio en `schema.prisma` requiere obligatoriamente:
  1. `npx prisma generate`
  2. `npx prisma db push`
- **Seeding:** Los datos de prueba se manejan en `prisma/seed.ts` y se ejecutan con `npx prisma db seed`.

### 2. Backend & API (Server Actions)
- **Prefer Server Actions:** Toda operación que involucre base de datos debe hacerse mediante Server Actions ubicadas en `src/app/actions/`.
- **Authentication:** Toda acción debe verificar la sesión del usuario mediante `import { auth } from '@clerk/nextjs/server'`.
- **Validation:** Utiliza validaciones en los inputs de los formularios antes de realizar operaciones de escritura.

### 3. Frontend & UI
- **Styling:** Uso estricto de Tailwind CSS.
- **Client/Server Components:** Los archivos en `src/app` deben usar `'use client'` solo cuando sea necesario (eventos, hooks). Las Server Actions se importan directamente en componentes de servidor o componentes de cliente.
- **Rutas Dinámicas:** Uso de patrones `[id]` para contexto específico (ej: `src/app/value-us/[pedidoId]/page.tsx`).

### 4. Project Structure
- `src/app/`: UI y rutas (App Router).
- `src/app/actions/`: Server Actions (backend logic).
- `src/lib/`: Utilidades (ej: `prisma.ts`).
- `prisma/`: Esquema, migraciones y seed.

## Agent Guidelines
- **Conciseness:** Sé directo y profesional.
- **Safety:** Antes de modificar el esquema de base de datos, explica qué pasará.
- **Verification:** Si se añade una funcionalidad, verifica que los tipos de TypeScript coincidan con el `schema.prisma`.