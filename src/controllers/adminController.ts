import { dbConnect } from '@/src/config/dbConfig';
import Admin, { IAdmin } from '@/src/models/Admin';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { adminSchema } from '../app/api/validators/admin.schema';
import { superAdminMiddleware } from '../lib/superAdminMiddleware';

export async function getAdmins(req: Request) {
  await dbConnect();
  try {
    // Authenticate and check if the user is a superadmin
    const authenticatedAdmin = await superAdminMiddleware(req);
    if (authenticatedAdmin instanceof NextResponse) return authenticatedAdmin;

    const admins: IAdmin[] = await Admin.find().select('-password -__v');
    return NextResponse.json({ data: admins }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching admins' },
      { status: 500 }
    );
  }
}

export async function getAdminById(req: Request, id: string) {
  await dbConnect();
  try {
    // Authenticate and check if the user is a superadmin
    const authenticatedAdmin = await superAdminMiddleware(req);
    if (authenticatedAdmin instanceof NextResponse) return authenticatedAdmin;

    const admin: IAdmin | null = await Admin.findById(id).select(
      '-password -__v'
    );
    if (!admin)
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    return NextResponse.json({ data: admin }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching admin' },
      { status: 500 }
    );
  }
}

export async function createAdmin(req: Request) {
  try {
    await dbConnect();
    // Authenticate and check if the user is a superadmin
    const authenticatedAdmin = await superAdminMiddleware(req);
    if (authenticatedAdmin instanceof NextResponse) return authenticatedAdmin;

    // Parse and validate request body
    const body = await req.json();
    const validatedData = adminSchema.safeParse(body);

    // If validation fails, return detailed error messages
    if (!validatedData.success) {
      const formattedErrors = validatedData.error.errors.map((err) => ({
        field: err.path.join('.'), // Field name
        message: err.message, // Error message
      }));

      return NextResponse.json(
        { message: 'Validation Error', errors: formattedErrors },
        { status: 400 }
      );
    }

    const { name, email, password, role } = validatedData.data;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin: IAdmin = await new Admin({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedAdmin = await newAdmin.save();
    return NextResponse.json({ data: savedAdmin }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function updateAdmin(req: Request, id: string) {
  await dbConnect();
  try {
    // Authenticate and check if the user is a superadmin
    const authenticatedAdmin = await superAdminMiddleware(req);
    if (authenticatedAdmin instanceof NextResponse) return authenticatedAdmin; // Return error if not authorized

    const updateData = await req.json();

    // Restrict updating email and password
    if ('password' in updateData || 'email' in updateData) {
      return NextResponse.json(
        { message: 'Cannot update email or password' },
        { status: 403 }
      );
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select('-password -__v');

    if (!updatedAdmin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updatedAdmin }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating admin' },
      { status: 500 }
    );
  }
}

export async function deleteAdmin(req: Request, id: string) {
  await dbConnect();
  try {
    // Authenticate and check if the user is a superadmin
    const authenticatedAdmin = await superAdminMiddleware(req);
    if (authenticatedAdmin instanceof NextResponse) return authenticatedAdmin; // Return error if not authorized

    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin)
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });

    return NextResponse.json(
      { message: 'Admin deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting admin' },
      { status: 500 }
    );
  }
}
