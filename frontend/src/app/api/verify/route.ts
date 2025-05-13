import { NextResponse } from 'next/server';
import { adminAuth } from '@/app/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    // Get the session cookie from the request headers
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ error: 'No session cookie found' }, { status: 401 });
    }

    // Parse the cookie string to get the session value
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const sessionCookie = cookies['session'];
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie found' }, { status: 401 });
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Check if user is admin (you can customize this based on your needs)
    const isAdmin = decodedClaims.email?.endsWith('@admin.com') || false;

    return NextResponse.json({
      authenticated: true,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        isAdmin,
      },
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    );
  }
}
