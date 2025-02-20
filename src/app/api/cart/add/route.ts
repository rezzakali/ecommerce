import { CartItem } from '@/src/app/cart/cart.interface';
import dbConnect from '@/src/config/dbConfig';
import { verifySession } from '@/src/lib/verifySession';
import Cart from '@/src/models/Cart';
import Product from '@/src/models/Product';
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

    const { itemId } = await req.json();

    // Retrieve the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // If the cart doesn't exist, create a new cart
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item: CartItem) => item.product._id.toString() === itemId.toString()
    );

    // Find product
    const product = await Product.findById(itemId);
    if (!product)
      return NextResponse.json({ error: 'Product not found', status: 404 });

    if (product.stock < 1) {
      return NextResponse.json({
        error: 'Not enough stock available',
        status: 400,
      });
    }

    if (existingItemIndex !== -1) {
      // If item exists, update the quantity
      cart.items[existingItemIndex].quantity += 1;
    } else {
      // If the item doesn't exist, add it to the cart
      const product = await Product.findById(itemId);
      if (!product) {
        return NextResponse.json({ error: 'Product not found', status: 404 });
      }

      cart.items.push({ product, quantity: 1 });
    }

    // Save the cart after adding the item or updating the quantity
    await cart.save();

    // Decrease stock
    product.stock -= 1;
    await product.save();

    return NextResponse.json({ data: cart, message: 'Item added to cart!' });
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || 'Failed to add item to cart!',
      status: 500,
    });
  }
}
