import dbConnect from '@/src/config/dbConfig';
import Product from '@/src/models/Product';
import { NextResponse } from 'next/server';

export async function getAllProducts(req: Request) {
  try {
    await dbConnect();

    // Extract query parameters
    const {
      search,
      category,
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

    //  Filter by category
    if (category) {
      query.category = category;
    }

    // Sorting logic
    let sortQuery: any = {};

    if (sort) {
      const sortFields = ['name', 'createdAt', 'price', 'category', 'stock'];
      const [field, order] = sort.split('_');

      if (sortFields.includes(field)) {
        sortQuery[field] = order === 'desc' ? -1 : 1;
      }
    }

    // Fetch products with filters, pagination, and sorting
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(pageSize)
      .select('-__v')
      .lean();

    //  Get total count for pagination info
    const totalProducts = await Product.countDocuments(query);

    return NextResponse.json({
      message: 'Products fetched successfully',
      data: products,
      pagination: {
        totalProducts,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / pageSize),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function getProductById(req: Request, id: string) {
  try {
    await dbConnect();
    const product = await Product.findById(id).select('-__v');

    if (!product)
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );

    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
