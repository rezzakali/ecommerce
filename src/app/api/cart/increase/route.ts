import { CartItem } from '@/src/app/cart/cart.interface';
import dbConnect from '@/src/config/dbConfig';
import { decrypt } from '@/src/lib/session';
import Cart from '@/src/models/Cart';
import User from '@/src/models/User';
import { NextResponse, type NextRequest } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    // Check if session exists
    const authSession = req.cookies.get('session')?.value;
    if (!authSession) {
      return NextResponse.json({
        error: 'Unauthorized: No session found',
        status: 401,
      });
    }

    let session;
    try {
      session = await decrypt(authSession);
    } catch (error) {
      return NextResponse.json({
        error: 'Unauthorized: Invalid session data',
        status: 401,
      });
    }

    if (!session?.userId) {
      return NextResponse.json({
        error: 'Unauthorized: Missing user ID in session',
        status: 401,
      });
    }

    // Parse request body
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId', status: 400 });
    }

    // Connect to DB
    await dbConnect();

    // Fetch user and cart
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found', status: 404 });
    }

    const cart = await Cart.findOne({ user: user._id }).populate(
      'items.product'
    );
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found', status: 404 });
    }

    // Find item in cart and increase quantity
    const itemIndex = cart.items.findIndex(
      (item: CartItem) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return NextResponse.json({
        error: 'Item not found in cart',
        status: 404,
      });
    }

    cart.items[itemIndex].quantity += 1;
    await cart.save();

    return NextResponse.json({ data: cart, success: true });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Internal Server Error',
      status: 500,
    });
  }
}
