import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().nonempty('Category name is required!'),
});
