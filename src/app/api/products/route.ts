import dbConnect from '@/src/config/dbConfig';
import { getAllProducts } from '@/src/controllers/productController';
import { generateSlug } from '@/src/lib/utils';
import Product from '@/src/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return getAllProducts(req);
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();

    if (!id)
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );

    // Fetch the product
    const product = await Product.findById(id);
    if (!product)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Generate slug
    const slug = generateSlug(product.name);

    // Update slug in the database
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { slug: slug },
      { new: true, runValidators: true } // Ensures the new slug is returned
    );
    return NextResponse.json({
      message: 'Slug updated',
      slug: updatedProduct.slug, // Ensure it returns the updated slug
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
