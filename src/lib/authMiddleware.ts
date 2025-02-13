import Admin, { IAdmin } from '@/src/models/Admin';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import dbConnect from '../config/dbConfig';

export async function authMiddleware(
  req: Request
): Promise<IAdmin | NextResponse> {
  try {
    await dbConnect();

    let token: string | undefined;

    // Check token source based on environment variable
    const authSource = process.env.AUTH_SOURCE || 'header'; // Default to 'header'
    if (authSource === 'cookie') {
      // Fetch token from cookies
      const cookieStore = await cookies();
      const myCookie = cookieStore.get('authToken');
      token = myCookie?.value;
    } else {
      // Fetch token from Authorization header (default)
      const authHeader = req.headers.get('authorization');
      token = authHeader!;
    }

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: Missing token' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized: Admin not found' },
        { status: 401 }
      );
    }

    return admin;
  } catch (error) {
    return NextResponse.json(
      { message: 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }
}
