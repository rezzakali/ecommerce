import { z } from 'zod';

// Zod schema for validation
export const adminSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z
    .string()
    .min(1, 'Email must be required!')
    .email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z
    .enum(['admin', 'superadmin'])
    .refine((val) => val === 'admin' || val === 'superadmin', {
      message: 'Invalid role',
    }), // Only "admin" role allowed
});
