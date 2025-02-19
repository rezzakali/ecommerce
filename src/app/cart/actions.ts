'use server';

import { decrypt } from '@/src/lib/session';
import Cart from '@/src/models/Cart';
import Product from '@/src/models/Product';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { CartItem } from './cart.interface';

// export async function getCartItems() {
//   try {
//     await dbConnect();

//     // Get session from cookies
//     const cookieStore = await cookies();
//     const sessionCookie = cookieStore.get('session')?.value;

//     if (!sessionCookie) {
//       return { error: 'Unauthorized: No session found', status: 401 };
//     }

//     let session;
//     try {
//       session = await decrypt(sessionCookie);
//     } catch (error) {
//       return { error: 'Unauthorized: Invalid session data', status: 401 };
//     }

//     if (!session?.userId) {
//       return { error: 'Unauthorized: Missing user ID in session', status: 401 };
//     }

//     // Fetch user from database
//     const user = await User.findById(session.userId);

//     if (!user) {
//       return { error: 'Unauthorized: User not found', status: 401 };
//     }

//     if (user.role !== 'Customer') {
//       return { error: 'Unauthorized: Insufficient permissions', status: 403 };
//     }

//     // Find user's cart
//     const cart = await Cart.findOne({ user: user._id }).populate(
//       'items.product'
//     );
//     if (!cart) {
//       return { error: 'Cart not found', status: 404 };
//     }

//     return { success: true, data: cart };
//   } catch (error: any) {
//     return { error: error?.message || 'Internal Server Error', status: 500 };
//   }
// }

export async function addToCart(itemId: string) {
  try {
    // Get session from cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return { error: 'Unauthorized: No session found', status: 401 };
    }

    let session;
    try {
      session = await decrypt(sessionCookie);
    } catch (error) {
      return { error: 'Unauthorized: Invalid session data', status: 401 };
    }

    if (!session?.userId) {
      return { error: 'Unauthorized: Missing user ID in session', status: 401 };
    }

    // Retrieve the user's cart
    let cart = await Cart.findOne({ user: session.userId });
    if (!cart) {
      // If the cart doesn't exist, create a new cart
      cart = new Cart({ user: session.userId, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item: CartItem) =>
        item.product._id.toString() === new ObjectId(itemId).toString()
    );

    if (existingItemIndex !== -1) {
      // If item exists, update the quantity
      cart.items[existingItemIndex].quantity += 1;
    } else {
      // If the item doesn't exist, add it to the cart
      const product = await Product.findById(itemId);
      if (!product) {
        return { error: 'Product not found', status: 404 };
      }

      cart.items.push({ product, quantity: 1 });
    }

    // Save the cart after adding the item or updating the quantity
    await cart.save();

    // Optionally revalidate the cart page if needed (e.g., Next.js)
    revalidatePath('/cart');

    return { success: true, message: 'Item added to cart!' };
  } catch (error: any) {
    return {
      error: error?.message || 'Failed to add item to cart!',
      status: 500,
    };
  }
}
