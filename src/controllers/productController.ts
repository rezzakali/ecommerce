import dbConnect from '@/src/config/dbConfig';
import Product from '@/src/models/Product';
import { NextResponse } from 'next/server';
import { productSchema } from '../app/api/validators/proudct.schema';
import { authMiddleware } from '../lib/authMiddleware';
import { superAdminMiddleware } from '../lib/superAdminMiddleware';
import { uploadImage } from '../lib/uploadImage';

export async function createProduct(req: Request) {
  try {
    await dbConnect();

    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware(req);
    if (authenticatedAdmin instanceof NextResponse) return authenticatedAdmin;

    // Parse form data
    const formData = await req.formData();

    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'Image is required' },
        { status: 400 }
      );
    }

    // Convert other form data to an object
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      category: formData.get('category'),
      stock: Number(formData.get('stock')),
    };

    // Validate the product data
    const validatedData = productSchema.safeParse(data);

    if (!validatedData.success) {
      const formattedErrors = validatedData.error.errors.reduce((acc, err) => {
        acc[err.path.join('.')] = err.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json(
        { message: 'Validation Error', errors: formattedErrors },
        { status: 400 }
      );
    }

    // Upload the image and get a URL
    const imageUrl = await uploadImage(file);
    if (!imageUrl) {
      return NextResponse.json(
        { message: 'Image upload failed' },
        { status: 500 }
      );
    }

    // Create the product with the image URL
    const newProduct = await Product.create({
      ...validatedData.data,
      imageUrl,
      createdBy: authenticatedAdmin._id,
    });

    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

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

    //  Sorting logic
    let sortQuery: any = {};
    if (sort === 'latest') {
      sortQuery.createdAt = -1; // Sort by latest
    } else if (sort === 'price_asc') {
      sortQuery.price = 1; // Sort price low to high
    } else if (sort === 'price_desc') {
      sortQuery.price = -1; // Sort price high to low
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

export async function updateProduct(req: Request, id: string) {
  try {
    await dbConnect();

    const authenticatedAdmin = await authMiddleware(req);
    if (authenticatedAdmin instanceof NextResponse) return authenticatedAdmin;

    const body = await req.json();
    const validatedData = productSchema.safeParse(body);

    if (!validatedData.success) {
      const formattedErrors = validatedData.error.errors.reduce((acc, err) => {
        acc[err.path.join('.')] = err.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json(
        { message: 'Validation Error', errors: formattedErrors },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      validatedData.data,
      { new: true }
    );
    if (!updatedProduct)
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );

    return NextResponse.json({ data: updatedProduct }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function deleteProduct(req: Request, id: string) {
  try {
    await dbConnect();

    const authenticatedAdmin = await superAdminMiddleware(req);
    if (authenticatedAdmin instanceof NextResponse) return authenticatedAdmin;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
