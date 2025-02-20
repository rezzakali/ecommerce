import dbConnect from '@/src/config/dbConfig';
import { verifySession } from '@/src/lib/verifySession';
import Cart from '@/src/models/Cart';
import Order from '@/src/models/Order';
import User from '@/src/models/User';
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '../../cart/cart.interface';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia',
});

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

    const cartItems = await Cart.findOne({ user: user._id }).populate(
      'items.product'
    );
    if (!cartItems || cartItems.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty!', status: 404 });
    }

    const lineItems = cartItems.items.map((item: CartItem) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.product.name },
        unit_amount: item.product.price * 100, // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }));

    const totalAmount = cartItems.items.reduce(
      (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
      0
    );

    //   Save Order in DB (Before Payment)
    const newOrder = await Order.create({
      user: user._id,
      items: cartItems.items.map((item: CartItem) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${newOrder._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: { orderId: newOrder._id.toString() }, // Store order ID in metadata
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message, status: 500 });
  }
}
