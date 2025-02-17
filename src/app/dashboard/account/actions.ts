'use server';

import dbConnect from '@/src/config/dbConfig';
import { authMiddleware } from '@/src/lib/authMiddleware';
import User from '@/src/models/User';
export const fetchUserById = async () => {
  try {
    await dbConnect();

    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    const user = await User.findOne({
      _id: authenticatedAdmin._id,
    });

    if (!user) return { message: 'User not found', status: 404 };

    return {
      message: 'User fetched successfully',
      data: {
        ...user.toObject(),
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    return { message: error?.message || 'Error fetching user', status: 500 };
  }
};
