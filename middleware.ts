import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const USER = process.env.BASIC_AUTH_USER;
  const PASS = process.env.BASIC_AUTH_PASS;

  const authHeader = req.headers.get('authorization');

  if (authHeader && USER && PASS) {
    const base64 = authHeader.replace('Basic ', '');
    const decoded = atob(base64);
    const colonIndex = decoded.indexOf(':');
    const user = decoded.slice(0, colonIndex);
    const pass = decoded.slice(colonIndex + 1);
    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Watchmen Lite"',
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
