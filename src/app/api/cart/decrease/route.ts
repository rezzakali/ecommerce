import { CartItem } from '@/src/app/cart/cart.interface';
import dbConnect from '@/src/config/dbConfig';
import { verifySession } from '@/src/lib/verifySession';
import Cart from '@/src/models/Cart';
import Product from '@/src/models/Product';
import User from '@/src/models/User';
import { NextResponse, type NextRequest } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    // 🔹 Call `verifySession`
    const sessionData = await verifySession(req);

    // 🔹 If it returns a NextResponse (error case), return immediately
    if (sessionData instanceof NextResponse) return sessionData;

    //  Safe to access `userId`
    const { userId } = sessionData;

    // Parse request body
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId', status: 400 });
    }

    // Connect to DB
    await dbConnect();

    // Fetch user and cart
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found', status: 404 });
    }

    const cart = await Cart.findOne({ user: user._id }).populate(
      'items.product'
    );
    if (!cart) {
      return NextResponse.json({ error: 'Cart is empty', status: 404 });
    }

    // Find item in cart and decrease quantity
    const itemIndex = cart.items.findIndex(
      (item: CartItem) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return NextResponse.json({
        error: 'Item not found in cart!',
        status: 404,
      });
    }

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1); // Remove item
    }

    await cart.save();

    // Restore stock
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product)
      NextResponse.json({ error: 'Product not found', status: 404 });

    product.stock += 1;
    await product.save();

    return NextResponse.json({ data: cart, success: true });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Internal Server Error',
      status: 500,
    });
  }
}
