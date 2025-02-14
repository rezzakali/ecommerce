import { getProductById } from '@/src/controllers/productController';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  return getProductById(req, id);
}
