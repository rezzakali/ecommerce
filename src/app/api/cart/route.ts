import dbConnect from '@/src/config/dbConfig';
import { verifySession } from '@/src/lib/verifySession';
import Cart from '@/src/models/Cart';
import User from '@/src/models/User';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await dbConnect(); //  Ensure database connection

    // 🔹 Call `verifySession`
    const sessionData = await verifySession(req);

    // 🔹 If it returns a NextResponse (error case), return immediately
    if (sessionData instanceof NextResponse) return sessionData;

    //  Safe to access `userId`
    const { userId } = sessionData;

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: User not found' },
        { status: 401 }
      );
    }

    // Check if user is a customer
    if (user.role !== 'Customer') {
      return NextResponse.json(
        { error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    // Find user's cart and populate products
    const cart = await Cart.findOne({ user: user._id }).populate(
      'items.product'
    );
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 200, data: cart }, { status: 200 });
  } catch (error: any) {
    console.error('🚀 ~ getCarts ~ error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
