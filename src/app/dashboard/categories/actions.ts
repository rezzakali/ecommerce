'use server';

import dbConnect from '@/src/config/dbConfig';
import { authMiddleware } from '@/src/lib/authMiddleware';
import CategoryModel from '@/src/models/Category';
import { revalidatePath } from 'next/cache';
import { Category, CategoryResponse } from './category.interface';
/**  Create a new category */
export async function createCategory(name: string) {
  try {
    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    await dbConnect();

    // Convert name to lowercase and replace spaces with hyphens
    const formattedName = name.toLowerCase().replace(/\s+/g, '-');

    const alreadyExists = await CategoryModel.findOne({ name: formattedName });

    if (alreadyExists) {
      return { error: 'Category already exists!', status: 500 };
    }

    const category = await CategoryModel.create({
      name: formattedName,
    });

    const serializedCategory = {
      ...category.toObject(),
      _id: category._id.toString(),
      createdAt: category.createdAt.toString(),
      updatedAt: category.updatedAt.toString(),
    };

    revalidatePath('/dashboard/categories');

    return {
      success: true,
      message: 'Category created successfully',
      data: serializedCategory,
    };
  } catch (error: any) {
    return { error: error.message || 'Error creating category', status: 500 };
  }
}

/**  Get all categories */
export async function getCategories({
  search,
  sort,
  page,
  limit,
}: {
  search: string;
  sort: string;
  page: string;
  limit: string;
}) {
  try {
    await dbConnect();

    //  Pagination setup
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    //  Search filter (by product name)
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

    // Fetch products with filters, pagination, and sorting
    const categories = await CategoryModel.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(pageSize)
      .lean();

    //  Get total count for pagination info
    const totalCategories = await CategoryModel.countDocuments(query);

    // Convert _id to string for Next.js compatibility
    const serializedCategories: Category[] = categories.map(
      (category: any) => ({
        _id: category._id.toString(), // Convert ObjectId to string
        name: category.name, // Ensure name exists
        createdAt: category.createdAt.toISOString(), // Convert Date to string
        updatedAt: category.updatedAt.toISOString(), // Convert Date to string
        __v: category.__v, // Ensure __v exists
      })
    );

    const response: CategoryResponse = {
      message: 'Categories fetched successfully',
      data: serializedCategories,
      pagination: {
        totalCategories,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCategories / pageSize),
      },
    };

    return response;
  } catch (error: any) {
    return {
      error: error.message || 'Error fetching categories',
      status: 500,
    };
  }
}

/**  Update a category */
export async function updateCategory(data: {
  categoryId: string;
  name: string;
}) {
  try {
    if (!data.name) {
      return { error: 'Category name is required!', status: 400 };
    }
    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Convert name to lowercase and replace spaces with hyphens
    const formattedName = data.name.toLowerCase().replace(/\s+/g, '-');

    await dbConnect();
    const category = await CategoryModel.findByIdAndUpdate(
      data.categoryId,
      { name: formattedName },
      {
        new: true,
      }
    );
    if (!category) return { error: 'Category not found', status: 404 };

    const serializedCategory = {
      ...category.toObject(),
      _id: category._id.toString(),
      createdAt: category.createdAt.toString(),
      updatedAt: category.updatedAt.toString(),
    };
    revalidatePath('/dashboard/categories');
    return {
      success: true,
      message: 'Category updated successfully',
      data: serializedCategory,
    };
  } catch (error: any) {
    return { error: error.message || 'Error updating category' };
  }
}

/**  Delete a category */
export async function deleteCategory(categoryId: string) {
  try {
    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    await dbConnect();
    const category = await CategoryModel.findById(categoryId);
    if (!category) return { error: 'Category not found', status: 400 };

    await CategoryModel.findByIdAndDelete(categoryId);
    revalidatePath('/dashboard/categories');
    return { success: true, message: 'Category deleted successfully' };
  } catch (error: any) {
    return { error: error.message || 'Error deleting category' };
  }
}
