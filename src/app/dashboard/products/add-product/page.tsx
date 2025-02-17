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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { useToast } from '@/src/hooks/use-toast';
import { productSchema } from '@/src/lib/validations/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getCategories } from '../../categories/actions';
import { Category } from '../../categories/category.interface';
import { createProduct } from '../actions';

export default function AddProduct() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0, // Updated to number
      category: '',
      stock: 0, // Updated to number
      file: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price.toString()); // Now it's always a number
      formData.append('category', values.category);
      formData.append('stock', values.stock.toString());

      if (values.file) {
        formData.append('image', values.file);
      }

      const res = await createProduct(formData);

      if (res?.error) {
        toast({
          title: 'Error',
          description: res.error || 'Something went wrong!',
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Success', description: 'Product added successfully!' });
      form.reset();
    });
  };

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories({
          search: '',
          sort: 'latest',
          page: '1',
          limit: '100',
        });
        if ('data' in response && response.data) {
          setCategories(response?.data);
        }
      } catch (error) {
        console.log('🚀 ~ fetchCategories ~ error:', error);
      }
    };
    fetchCategories();
  }, []);

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
                  <Input placeholder="Product Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Product Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category, index) => {
                        return (
                          <SelectItem key={index} value={category.name}>
                            {category.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stock */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Stock" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="file"
            render={({
              field: { onChange },
            }: {
              field: { onChange: (file: File | undefined) => void };
            }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Product'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
