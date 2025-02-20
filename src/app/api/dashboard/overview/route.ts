import dbConnect from '@/src/config/dbConfig';
import { authMiddleware } from '@/src/lib/authMiddleware';
import Category from '@/src/models/Category';
import Order from '@/src/models/Order';
import Product from '@/src/models/Product';
import User from '@/src/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return NextResponse.json({ error: 'Unauthorized', status: 401 });
    }

    await dbConnect();

    // Fetch counts
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Fetch latest 5 orders
    const latestOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      message: 'Dashboard overview fetched successfully',
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalCategories,
        latestOrders,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
