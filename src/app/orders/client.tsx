'use client';

import { Badge } from '@/src/components/ui/badge';
import { Skeleton } from '@/src/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { useEffect, useState } from 'react';

interface OrderItem {
  product: { _id: string; name: string; price: number };
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data.data);
        } else {
          setError(data.error || 'Failed to fetch orders');
        }
      } catch (error) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 my-10">
      <h1 className="text-xl font-bold mb-4 text-center">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-center text-red-500">{error}</p>
        </div>
      ) : orders?.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-center">No orders found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id.slice(-6)}</TableCell>
                <TableCell>
                  {order.items.map((item) => (
                    <p key={item.product._id} className="text-sm">
                      {item.product.name} × {item.quantity}
                    </p>
                  ))}
                </TableCell>
                <TableCell>${order.totalAmount?.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.paymentStatus === 'Paid' ? 'default' : 'destructive'
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
