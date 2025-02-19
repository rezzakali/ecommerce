import { getCarts } from '@/src/controllers/cartController';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return getCarts(request);
}
