import { getAllProducts } from '@/src/controllers/productController';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return getAllProducts(req);
}
