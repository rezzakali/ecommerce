'use server';

import dbConnect from '@/src/config/dbConfig';
import { decrypt } from '@/src/lib/session';
import User from '@/src/models/User';
import { Types } from 'mongoose';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { UserUpdateForm } from '../dashboard/users/user.interface';

export const fetchProfile = async () => {
  try {
    // Get session from cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return { error: 'Unauthorized: No session found', status: 401 };
    }

    let session;
    try {
      session = await decrypt(sessionCookie);
    } catch (error) {
      return { error: 'Unauthorized: Invalid session data', status: 401 };
    }

    if (!session?.userId) {
      return { error: 'Unauthorized: Missing user ID in session', status: 401 };
    }

    await dbConnect();

    const user = await User.findOne({
      _id: session.userId,
    });

    if (!user) return { message: 'User not found', status: 404 };

    return {
      message: 'Profile fetched successfully',
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

// Update User
export const updateProfile = async ({
  id,
  data,
}: {
  id: string;
  data: UserUpdateForm;
}) => {
  try {
    // Get session from cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return { error: 'Unauthorized: No session found', status: 401 };
    }

    let session;
    try {
      session = await decrypt(sessionCookie);
    } catch (error) {
      return { error: 'Unauthorized: Invalid session data', status: 401 };
    }

    if (!session?.userId) {
      return { error: 'Unauthorized: Missing user ID in session', status: 401 };
    }

    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) return { message: 'User not found', status: 404 };

    if (Array.isArray(updatedUser)) {
      return { message: 'User updated successfully', data: updatedUser };
    }

    revalidatePath('/account');

    return {
      message: 'Profile updated successfully',
      data: {
        ...updatedUser,
        _id:
          updatedUser._id instanceof Types.ObjectId
            ? updatedUser._id.toString()
            : '',
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    return { message: error?.message || 'Error updating user', status: 500 };
  }
};
