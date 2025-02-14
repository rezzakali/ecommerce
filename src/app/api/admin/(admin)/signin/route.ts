import { adminSignin } from '@/src/controllers/authController';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  return adminSignin(req);
}
