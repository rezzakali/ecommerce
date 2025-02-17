'use server';

import dbConnect from '@/src/config/dbConfig';
import { authMiddleware } from '@/src/lib/authMiddleware';
import User from '@/src/models/User';
import { Types } from 'mongoose';

export const fetchUserById = async () => {
  try {
    await dbConnect();

    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    const user = (await User.findById(authenticatedAdmin._id).lean()) as any;

    if (!user) return { message: 'User not found', status: 404 };

    return {
      message: 'User fetched successfully',
      data: {
        ...user,
        _id: Array.isArray(user)
          ? ''
          : user._id instanceof Types.ObjectId
          ? user._id.toString()
          : '',
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    return { message: error?.message || 'Error fetching user', status: 500 };
  }
};
