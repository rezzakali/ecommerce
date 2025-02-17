import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().nonempty('Name is required!'),
  role: z.string().nonempty('Role is required!'),
  address: z.string(),
  authProvider: z.string().nonempty('AuthProvider is required!'),
  email: z.string().nonempty('Email is required!').email({
    message: 'Invalid email address.',
  }),
  phone: z
    .string()
    .nonempty('Phone is required!')
    .min(10, {
      message: 'Phone must be at least 10 characters.',
    })
    .max(10, {
      message: 'Phone must be at least 10 characters.',
    }),
});
