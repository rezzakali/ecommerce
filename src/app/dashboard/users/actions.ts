'use server';

import dbConnect from '@/src/config/dbConfig';
import { authMiddleware } from '@/src/lib/authMiddleware';
import User from '@/src/models/User';
import { Types } from 'mongoose';
import { revalidatePath } from 'next/cache';
import { UserInterface, UserResponse, UserUpdateForm } from './user.interface';

// Fetch All Users with Pagination
export const fetchUsers = async ({
  search,
  page,
  limit,
  sort,
}: {
  search: string;
  page: string;
  limit: string;
  sort: string;
}) => {
  try {
    await dbConnect();

    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    //  Pagination setup
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    //   search filter
    let query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    //  Sorting logic
    let sortQuery: any = {};
    if (sort) {
      const sortFields = ['name', 'createdAt'];
      const [field, order] = sort.split('_');
      if (sortFields.includes(field)) {
        sortQuery[field] = order === 'desc' ? -1 : 1;
      }
    }

    const users = await User.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(pageSize)
      .select('-__v')
      .lean();

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / pageSize);

    // Convert _id to string for Next.js compatibility
    const serializedUsers: UserInterface[] = users.map((user: any) => ({
      _id: user._id.toString(), // Convert ObjectId to string
      name: user.name, // Ensure name exists
      email: user.email, // Ensure email exists
      phone: user.phone, // Ensure phone exists
      address: user.address, // Ensure address exists
      role: user.role, // Ensure role exists
      authProvider: user.authProvider, // Ensure authProvider exists
      createdAt: user.createdAt.toISOString(), // Convert Date to string
      updatedAt: user.updatedAt.toISOString(), // Convert Date to string
      __v: user.__v, // Ensure __v exists
    }));

    const response: UserResponse = {
      message: 'Categories fetched successfully',
      data: serializedUsers,
      pagination: {
        totalUsers,
        currentPage: pageNumber,
        totalPages,
      },
    };

    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      message: 'Error fetching users',
      data: [],
      pagination: {
        totalUsers: 0,
        currentPage: 0,
        totalPages: 0,
      },
    };
  }
};

// Update User
export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: UserUpdateForm;
}) => {
  try {
    await dbConnect();

    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) return { message: 'User not found', status: 404 };

    if (Array.isArray(updatedUser)) {
      return { message: 'User updated successfully', data: updatedUser };
    }

    revalidatePath('/dashboard/users');

    return {
      message: 'User updated successfully',
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

// Delete User
export const deleteUser = async (id: string) => {
  try {
    await dbConnect();

    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Prevent an admin from deleting themselves
    if (authenticatedAdmin._id.toString() === id) {
      return {
        message: 'You do not have permission to delete yourself!',
        status: 403,
      };
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return { message: 'User not found', status: 404 };

    return { message: 'User deleted successfully', status: 200 };
  } catch (error: any) {
    return { message: error?.message || 'Error deleting user', status: 500 };
  }
};
