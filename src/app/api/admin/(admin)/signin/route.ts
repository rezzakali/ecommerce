import { adminSignin } from '@/src/controllers/authController';

export async function POST(req: Request) {
  return adminSignin(req);
}
