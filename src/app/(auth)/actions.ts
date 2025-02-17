'use server';

import dbConnect from '@/src/config/dbConfig';
import { createSession } from '@/src/lib/session';
import User from '@/src/models/User';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignupInterface } from './signup/signup.interface';

export const signup = async (formData: SignupInterface) => {
  try {
    await dbConnect();

    const { email, name, password, phone } = formData;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Email already in use!' };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    await User.create({
      name: name || 'User',
      email,
      phone,
      address: '',
      role: 'Customer',
      authProvider: 'Email',
      password: hashedPassword,
    });

    return { message: 'Signup successful! Please log in now!' };
  } catch (error: any) {
    return {
      error: error?.message || 'Something went wrong during signup!',
    };
  }
};

export async function signin(credentials: { email: string; password: string }) {
  const { email, password } = credentials;

  if (!email || !password) {
    return { error: 'Invalid email or password!' };
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Invalid email or password!' };
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid email or password' };
    }

    await createSession(user._id, user.role);

    // Convert _id
    const serializedUser = {
      ...user.toObject(),
      _id: user._id.toString(),
    };

    return {
      message: 'Signin successful',
      data: serializedUser,
    };
  } catch (error: any) {
    return { error: error?.message || 'Internal Server Error' };
  }
}

export async function signout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/');
}
