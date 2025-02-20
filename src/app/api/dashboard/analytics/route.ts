import dbConnect from '@/src/config/dbConfig';
import { authMiddleware } from '@/src/lib/authMiddleware';
import Order from '@/src/models/Order';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return NextResponse.json({ error: 'Unauthorized', status: 401 });
    }

    await dbConnect();

    // Calculate total revenue
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Count total orders
    const totalOrders = await Order.countDocuments();

    // Fetch last 7 days revenue
    const revenueTrends = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    return NextResponse.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      revenueTrends,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || 'Failed to fetch analytics',
      status: 500,
    });
  }
}
