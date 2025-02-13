import { IAdmin } from '@/src/models/Admin';
import { NextResponse } from 'next/server';
import { authMiddleware } from './authMiddleware';

export async function superAdminMiddleware(
  req: Request
): Promise<IAdmin | NextResponse> {
  const authenticatedAdmin = await authMiddleware(req);

  if (authenticatedAdmin instanceof NextResponse) {
    return authenticatedAdmin; // Return error if unauthorized
  }

  if (authenticatedAdmin.role !== 'superadmin') {
    return NextResponse.json(
      {
        message:
          'Forbidden: You do not have permission to perform this action!',
      },
      { status: 403 }
    );
  }

  return authenticatedAdmin; // Return admin if it's a superadmin
}
