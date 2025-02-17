'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ProductInterface } from '@/src/@types';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { useToast } from '@/src/hooks/use-toast';
import { productImageSchema } from '@/src/lib/validations/product';

import Image from 'next/image';
import React, { useTransition } from 'react';
import { updateProductImage } from './actions';

type ProductFormValues = z.infer<typeof productImageSchema>;

const UpdateImageDialog = ({
  open,
  setOpen,
  product,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: ProductInterface;
}) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productImageSchema),
  });

  //  Form Submission Handler
  const onSubmit = async (values: z.infer<typeof productImageSchema>) => {
    startTransition(async () => {
      const res = await updateProductImage(product._id, values.file);

      if (res?.error) {
        toast({
          title: 'Error',
          description: res.error || 'Something went wrong!',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Product image updated successfully!',
      });
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[30rem] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Edit Product Image</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              {product && (
                <Image
                  src={
                    product.image.url ||
                    'https://placehold.co/600x400/000000/FFFFFF/png'
                  }
                  alt={product.name}
                  width={100}
                  height={100}
                  className="object-cover"
                />
              )}
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

            <DialogFooter>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Loading...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateImageDialog;
