'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { signinFormSchema } from '@/src/lib/validations/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { signin } from '../actions';

const Signin = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signinFormSchema>) => {
    startTransition(async () => {
      const res = await signin(values);
      localStorage.setItem('user', JSON.stringify(res.data));

      if (res?.error) {
        toast({
          title: 'Error',
          description: res.error || 'Something went wrong!',
          variant: 'destructive', // Optional: Use error styling
        });
        return; // Stop execution if there's an error
      }

      toast({
        title: 'Success',
        description: res.message || 'Logged in!',
      });
      if (res && res.data && res.data.role === 'Customer') {
        router.replace('/');
        router.refresh();
      } else {
        router.replace('/dashboard');
        router.refresh();
      }
    });
  };

  return (
    <div className="container flex items-center justify-center flex-col max-h-screen space-y-3 mt-20 p-6">
      <h1 className="text-lg">Signin</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full max-w-lg"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    autoComplete="on" //  Fix incorrect attribute
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Loading...' : 'Submit'}
          </Button>
        </form>
      </Form>
      <div className="flex items-center gap-1">
        <p>Don&apos;t have an account?</p>
        <Link href={'/signup'} prefetch>
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Signin;
