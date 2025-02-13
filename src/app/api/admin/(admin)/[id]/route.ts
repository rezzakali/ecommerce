import {
  deleteAdmin,
  getAdminById,
  updateAdmin,
} from '@/src/controllers/adminController';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  return getAdminById(req, params.id);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  return updateAdmin(req, params.id);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  return deleteAdmin(req, params.id);
}
