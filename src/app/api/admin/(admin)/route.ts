import { createAdmin, getAdmins } from '@/src/controllers/adminController';
import { superAdminMiddleware } from '@/src/lib/superAdminMiddleware';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Authenticate and check if the user is a superadmin
  const authenticatedAdmin = await superAdminMiddleware(req);
  if (authenticatedAdmin instanceof NextResponse) return authenticatedAdmin; // Return error if not authorized

  return getAdmins(req);
}

export async function POST(req: Request) {
  // Authenticate and check if the user is a superadmin
  const authenticatedAdmin = await superAdminMiddleware(req);
  if (authenticatedAdmin instanceof NextResponse) return authenticatedAdmin; // Return error if not authorized

  return createAdmin(req);
}
