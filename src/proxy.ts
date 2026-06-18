import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definimos qué rutas son públicas (como las FAQs) y cuáles requieren autenticación (como las rutas de feedback)
const isPublicRoute = createRouteMatcher(['/api/faqs', '/api/webhooks/pedidos', '/api/feedback/reviews(.*)', '/sign-in(.*)', '/sign-up(.*)', '/', '/resenas(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect(); // Protege todas las rutas de feedback
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};