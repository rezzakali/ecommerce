import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().min(0, 'Stock must be a non-negative integer'),
  file: z.instanceof(File).optional(),
});

export const productImageSchema = z.object({
  file: z.instanceof(File),
});
