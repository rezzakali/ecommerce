'use client';

import { Button } from '@/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { useToast } from '@/src/hooks/use-toast';
import { categorySchema } from '@/src/lib/validations/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createCategory } from '../actions';

const AddCategory = () => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    startTransition(async () => {
      const res = await createCategory(values.name.toLocaleLowerCase());

      if (res?.error) {
        toast({
          title: 'Error',
          description: res.error || 'Something went wrong!',
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Success', description: 'Category added successfully!' });
      form.reset();
    });
  };

  return (
    <div className="p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Category Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Category'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddCategory;
