import { Badge } from '@/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
// import { List, ListItem } from "@/src/components/ui/list";
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Lock, LogIn, User } from 'lucide-react';

export const metadata = {
  title: 'How to Use QuickKart Dashboard',
  description:
    'Step-by-step guide on how to log in and efficiently use the QuickKart Dashboard for managing products, orders, categories, and users.',
};

export default function DashboardInstructions() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>How to Use QuickKart Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">1. Login to Dashboard</h2>
          <p>Use the following credentials to log in:</p>
          <div className="flex items-center space-x-2">
            <User size={18} />
            <Input value="rezzak.dev@gmail.com" readOnly className="w-full" />
          </div>
          <div className="flex items-center space-x-2">
            <Lock size={18} />
            <Input value="P@ssw0rd" type="text" readOnly className="w-full" />
          </div>
          <Button className="w-full mt-2">
            <LogIn size={16} className="mr-2" /> Signin
          </Button>
          <Separator />
          <h2 className="text-lg font-semibold">2. Dashboard Features</h2>
          <ul className="space-y-3">
            <li>
              <Badge variant="outline">Products</Badge> - View, add, edit, and
              delete products.
            </li>
            <li>
              <Badge variant="outline">Categories</Badge> - Manage product
              categories.
            </li>
            <li>
              <Badge variant="outline">Orders</Badge> - Track and manage
              customer orders.
            </li>
            <li>
              <Badge variant="outline">Users</Badge> - Manage user accounts and
              roles.
            </li>
            <li>
              <Badge variant="outline">Analytics</Badge> - View revenue and
              visitor statistics.
            </li>
          </ul>
          <Separator />
          <h2 className="text-lg font-semibold">3. Sign Out</h2>
          <p>
            To log out, click on your profile icon and select <b>Logout</b>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
