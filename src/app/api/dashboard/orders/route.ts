import dbConnect from '@/src/config/dbConfig';
import { authMiddleware } from '@/src/lib/authMiddleware';
import Order from '@/src/models/Order';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return NextResponse.json({ error: 'Unauthorized', status: 401 });
    }

    await dbConnect();

    const url = new URL(req.nextUrl);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '7', 10);

    const sortField = url.searchParams.get('sort') || 'createdAt';
    const sortOrder = url.searchParams.get('order') === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find()
      .populate('items.product', 'name price image.url')
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      totalOrders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
