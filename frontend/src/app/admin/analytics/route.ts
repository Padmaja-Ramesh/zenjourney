import { NextResponse } from 'next/server';
import { adminAuth } from '@/app/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get the session cookie from the request headers
    const cookieHeader = request.headers.get('cookie');
    const sessionCookie = cookieHeader
      ?.split(';')
      .find(c => c.trim().startsWith('session='))
      ?.split('=')[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the session cookie
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
    
    // Check if user is admin
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Your analytics logic here
    const analytics = {
      total_calls: 150,
      average_duration: 5.5,
      common_questions: [
        { question: "How do I reset my password?", count: 45 },
        { question: "What are your business hours?", count: 32 },
        // ... more questions
      ]
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error in analytics route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
