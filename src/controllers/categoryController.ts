import CategoryModel from '@/src/models/Category';
import { NextResponse } from 'next/server';
import dbConnect from '../config/dbConfig';

/**  Get all categories */
export async function getCategories(req: Request) {
  try {
    await dbConnect();

    // Extract query parameters
    const {
      search,
      sort,
      page = '1',
      limit = '10',
    } = Object.fromEntries(new URL(req.url).searchParams);

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

    return NextResponse.json({
      message: 'Categories fetched successfully',
      data: categories,
      pagination: {
        totalCategories,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCategories / pageSize),
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Error fetching categories',
      status: 500,
    });
  }
}
