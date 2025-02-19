import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '../config/dbConfig';
import { decrypt } from '../lib/session';
import Cart from '../models/Cart';
import User from '../models/User';

export async function getCarts(req: NextRequest) {
  try {
    const authSession = req.cookies.get('session')?.value;

    if (!authSession) {
      return NextResponse.json(
        { error: 'Unauthorized: No session found', status: 401 },
        { status: 401 }
      );
    }

    let session;
    try {
      session = await decrypt(authSession);
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid session data', status: 401 },
        { status: 401 }
      );
    }

    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing user ID in session', status: 401 },
        { status: 401 }
      );
    }

    await dbConnect();

    // Fetch user from database
    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: User not found', status: 401 },
        { status: 401 }
      );
    }

    if (user.role !== 'Customer') {
      return NextResponse.json(
        { error: 'Unauthorized: Insufficient permissions', status: 403 },
        { status: 403 }
      );
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: user._id }).populate(
      'items.product'
    );

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found', status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 200, data: cart }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error', status: 500 },
      { status: 500 }
    );
  }
}
