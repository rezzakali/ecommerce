import { CartItem } from '@/src/app/cart/cart.interface';
import dbConnect from '@/src/config/dbConfig';
import { verifySession } from '@/src/lib/verifySession';
import Cart from '@/src/models/Cart';
import Product from '@/src/models/Product';
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

    // 🔹 Fetch the cart with populated product details
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // 🔹 Find the item in the cart

    const itemIndex = cart.items.findIndex(
      (item: CartItem) => item._id.toString() === itemId
    );
    if (itemIndex === -1) {
      return NextResponse.json({
        error: 'Item not found in cart',
        status: 404,
      });
    }

    const cartItem = cart.items[itemIndex];
    const product = await Product.findById(cartItem.product);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 🔹 Ensure stock availability before increasing quantity
    if (product.stock <= 0) {
      return NextResponse.json(
        { error: 'Product is out of stock' },
        { status: 400 }
      );
    }

    if (cartItem.quantity >= product.stock) {
      return NextResponse.json(
        { error: `Only ${product.stock} items available in stock` },
        { status: 400 }
      );
    }

    cart.items[itemIndex].quantity += 1;
    await cart.save(); // Save updated cart

    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -1 } }); // Decrease stock safely

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Internal Server Error',
      status: 500,
    });
  }
}
