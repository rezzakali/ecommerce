import { dbConnect } from '@/src/config/dbConfig';
import User from '@/src/models/User';
import { cookies } from 'next/headers';
import { decrypt } from './session';

export async function authMiddleware() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return { message: 'Unauthorized: No session found', status: 401 };
    }

    let session;
    try {
      session = await decrypt(sessionCookie);
    } catch (error) {
      return { message: 'Unauthorized: Invalid session data', status: 401 };
    }

    if (!session?.userId) {
      return {
        message: 'Unauthorized: Missing user ID in session',
        status: 401,
      };
    }

    // Fetch user from database
    const user = await User.findById(session.userId).select('-password');
    if (!user) {
      return { message: 'Unauthorized: User not found', status: 401 };
    }

    // Ensure user is an admin
    if (user.role !== 'Admin') {
      return { message: 'Unauthorized: Insufficient permissions', status: 403 };
    }

    return user; // Return authenticated user
  } catch (error: any) {
    return { message: error?.message || 'Internal Server Error', status: 500 };
  }
}
