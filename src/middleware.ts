import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/',
  '/job-board',
  '/executive',
  '/financial',
  '/analytics',
  '/appointment(.*)',
  '/ecommerce(.*)',
  '/file(.*)',
  '/invoice(.*)',
  '/logistics(.*)',
  '/support(.*)',
  '/event-calendar',
  '/file-manager',
  '/point-of-sale',
  '/roles-permissions',
  '/search(.*)',
  '/widgets(.*)',
  '/forms(.*)',
  '/ask-question(.*)',
  '/collection(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
