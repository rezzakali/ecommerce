import dbConnect from '@/src/config/dbConfig';
import { verifySession } from '@/src/lib/verifySession';
import Cart from '@/src/models/Cart';
import User from '@/src/models/User';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 🔹 Call `verifySession`
    const sessionData = await verifySession(req);

    // 🔹 If it returns a NextResponse (error case), return immediately
    if (sessionData instanceof NextResponse) return sessionData;

    //  Safe to access `userId`
    const { userId } = sessionData;

    // Connect to DB
    await dbConnect();

    // Fetch user and cart
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found', status: 404 });
    }

    await Cart.findOneAndUpdate({ user: user?._id }, { items: [] });

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message, status: 500 });
  }
}
