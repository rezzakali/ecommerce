'use server';

import dbConnect from '@/src/config/dbConfig';
import imagekit from '@/src/config/imageKitConfig';
import { authMiddleware } from '@/src/lib/authMiddleware';
import { uploadImage } from '@/src/lib/uploadImage';
import { productSchema } from '@/src/lib/validations/product';
import Product from '@/src/models/Product';
import { revalidatePath } from 'next/cache';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const getProducts = async ({
  search,
  page,
  limit,
  sort,
}: {
  search: string;
  page: number;
  limit: number;
  sort: string;
}) => {
  const res = await fetch(
    `${BASE_PATH}/api/products?page=${page}&limit=${limit}${
      search !== '' ? `&search=${search}` : ''
    }${sort !== '' ? `&sort=${sort}` : ''}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json(); // Parse error response
    throw new Error(
      JSON.stringify({ status: errorData.status, message: errorData.message })
    );
  }

  return await res.json(); // Return the successful response data
};

export async function createProduct(formData: FormData) {
  try {
    await dbConnect();

    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Extract form data
    const file = formData.get('image') as File | null;
    if (!file) {
      return { error: 'Image is required', status: 400 };
    }

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
      return {
        error: 'Validation Error',
        details: validatedData.error.format(),
        status: 400,
      };
    }

    // Upload the image
    const imageUploadedData = await uploadImage(file);
    if (!imageUploadedData) {
      return { error: 'Image upload failed', status: 500 };
    }

    // Create the product
    const newProduct = await Product.create({
      ...validatedData.data,
      image: imageUploadedData,
      createdBy: authenticatedAdmin._id,
    });

    // Convert _id and createdBy to strings
    const serializedProduct = {
      ...newProduct.toObject(),
      _id: newProduct._id.toString(),
      createdBy: newProduct.createdBy.toString(),
    };
    // Revalidate cache to update UI
    revalidatePath('/dashboard/products');

    return { success: true, data: serializedProduct };
  } catch (error: any) {
    return { error: error?.message || 'Internal Server Error', status: 500 };
  }
}

export async function editProduct(formData: FormData) {
  try {
    await dbConnect();

    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    const data = {
      id: formData.get('id'),
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      category: formData.get('category'),
      stock: Number(formData.get('stock')),
    };

    // Validate the product data
    const validatedData = productSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        error: 'Validation Error',
        details: validatedData.error.format(),
        status: 400,
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      data.id,
      validatedData.data,
      { new: true }
    );

    // Convert _id and createdBy to strings
    const serializedProduct = {
      ...updatedProduct.toObject(),
      _id: updatedProduct._id.toString(),
      createdBy: updatedProduct.createdBy.toString(),
    };
    // Revalidate cache to update UI
    revalidatePath('/dashboard/products');

    return { success: true, data: serializedProduct };
  } catch (error: any) {
    return { error: error?.message || 'Internal Server Error', status: 500 };
  }
}

export async function updateProductImage(productId: string, file: File) {
  try {
    await dbConnect();

    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Find product by ID
    const product = await Product.findById(productId);
    if (!product) return { error: 'Product not found' };

    // Delete the existing image from ImageKit (if exists)
    if (product.image?.fileId) {
      await imagekit.deleteFile(product.image.fileId);
    }

    // Upload the image
    const imageUploadedData = await uploadImage(file);
    if (!imageUploadedData) {
      return { error: 'Image upload failed', status: 500 };
    }

    await product.save();

    // Revalidate cache to update UI
    revalidatePath('/dashboard/products');

    return {
      success: true,
      message: 'Image updated successfully',
    };
  } catch (error: any) {
    return { error: error.message || 'Something went wrong' };
  }
}

export async function deleteProduct(id: string, fileId: string) {
  try {
    if (!id || !fileId) {
      return { message: 'Product Id or File Id is required!', status: 400 };
    }
    await dbConnect();

    // Authenticate Admin/Super Admin
    const authenticatedAdmin = await authMiddleware();
    if (!authenticatedAdmin) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Delete the existing image from ImageKit (if exists)
    if (fileId) {
      try {
        await imagekit.deleteFile(fileId);
      } catch (error: any) {
        return {
          message: error?.message || 'Failed to delete image!',
          status: 500,
        };
      }
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return {
        message: 'Product not found',
        status: 404,
      };

    return { message: 'Product deleted successfully', status: 200 };
  } catch (error: any) {
    console.log('🚀 ~ deleteProduct ~ error:', error);
    return { message: error?.message || 'Internal Server Error', status: 500 };
  }
}
