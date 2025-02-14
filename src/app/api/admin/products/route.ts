import { createProduct } from '@/src/controllers/productController';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  return createProduct(req);
}
