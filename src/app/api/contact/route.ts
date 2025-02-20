import Contact from '@/src/models/Contact';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters!')
    .max(300, 'Message must not be more than 300 characters!'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let validatedData;
    try {
      validatedData = contactSchema.parse(body);
    } catch (validationError: any) {
      return NextResponse.json(
        { success: false, error: validationError.errors },
        { status: 400 }
      );
    }

    await Contact.create(validatedData);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid request' },
      { status: 400 }
    );
  }
}
