import { decrypt } from '@/src/lib/session';
import { NextRequest, NextResponse } from 'next/server';

// type SessionData = { userId: string } | NextResponse;

export async function verifySession(req: NextRequest) {
  const authSession = req.cookies.get('session')?.value;

  if (!authSession) {
    return NextResponse.json(
      { error: 'Unauthorized: Session not found' },
      { status: 401 }
    );
  }

  let session;
  try {
    session = await decrypt(authSession);
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing user ID in session' },
        { status: 401 }
      );
    }

    return session;
  } catch (error) {
    console.log('🚀 ~ verifySession ~ error:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid session data' },
      { status: 401 }
    );
  }
}
