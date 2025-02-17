import { z } from 'zod';

export const signupFormSchema = z
  .object({
    name: z.string().nonempty('Name is required!'),
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
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(
        /[^a-zA-Z0-9]/,
        'Password must contain at least one special character.'
      ),
    confirmPassword: z
      .string()
      .min(8, 'Confirm Password must be at least 8 characters.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

export const signinFormSchema = z.object({
  email: z.string().nonempty('Email is required.').email({
    message: 'Invalid email address.',
  }),
  password: z
    .string()
    .nonempty('Password is required.')
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character.'
    ),
});
