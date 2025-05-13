import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/firebase-admin';

export async function GET() {
  try {
    // Verify admin status
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch analytics from your backend
    const response = await fetch('http://localhost:8000/api/admin/analytics');
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
