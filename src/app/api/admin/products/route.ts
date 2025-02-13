import dbConnect from '@/src/config/dbConfig';
// import { verifyAdmin } from '@/src/lib/authMiddleware';
import Product, { IProduct } from '@/src/models/Product';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await dbConnect();

  // const isAdmin = await verifyAdmin(req);
  // if (!isAdmin) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const products: IProduct[] = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log('🚀 ~ GET ~ error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
