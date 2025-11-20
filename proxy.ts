import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = ['en', 'vi'];

function validateContentType(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type');
  return (
    !contentType ||
    contentType.includes('application/json') ||
    contentType.includes('text/plain') ||
    contentType.includes('text/html')
  );
}

function getPreferredLocale(request: NextRequest): string {
  const languages = request.headers.get('Accept-Language');
  if (!languages) {
    return 'en';
  }

  const preferred = languages.split(',')[0].split(';')[0].split('-')[0];

  if (supportedLocales.includes(preferred)) {
    return preferred;
  }
  return 'en';
}

const protectedPaths: string[] = [];
const loginPath = '/auth';

export async function proxy(request: NextRequest) {
  if (request.headers.has('next-action')) {
    return NextResponse.next();
  }
  if (!validateContentType(request)) {
    return NextResponse.json(
      { error: 'Invalid Content-Type header' },
      { status: 400 }
    );
  }

  const { pathname } = request.nextUrl;

  // Skip locale redirect for static assets
  if (
    pathname.startsWith('/images/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff|woff2|ttf|eot)$/i.test(
      pathname
    )
  ) {
    return NextResponse.next();
  }

  const isLocaleInPathname = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const preferredLocale = getPreferredLocale(request);

  if (!isLocaleInPathname) {
    request.nextUrl.pathname = `/${preferredLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }
  const currentLocale = pathname.split('/')[1];
  const pathnameWithoutLocale =
    pathname.replace(`/${currentLocale}`, '') || '/';

  // Lấy token
  const token = await getToken({ req: request });

  const isProtected = protectedPaths.some((path) =>
    pathnameWithoutLocale.startsWith(path)
  );
  const isLoginPage =
    pathnameWithoutLocale === loginPath ||
    pathnameWithoutLocale.startsWith(loginPath);

  if (isLoginPage && token) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/user/home`, request.url)
    );
  }

  if (isLoginPage) {
    return NextResponse.next();
  }

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}${loginPath}`, request.url)
      );
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api|__NEXT_ACTIONS__|_next/static|_next/image|favicon.ico).*)',
  ],
};
