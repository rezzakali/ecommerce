'use client';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { ArrowUpDown } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ProductImage {
  url: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: ProductImage;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [sortField, setSortField] = useState<'createdAt' | 'totalAmount'>(
    'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const limit = 7; // Orders per page

  const toggleSort = (field: 'createdAt' | 'totalAmount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `/api/dashboard/orders?page=${page}&limit=${limit}&sort=${sortField}&order=${sortOrder}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
          setTotalPages(data.totalPages);
          setTotalOrders(data.totalOrders);
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
  }, [page, sortField, sortOrder, limit]);

  return (
    <div className="w-full mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold mb-4">Orders</h1>
        {!loading && <Badge>Total Orders : {totalOrders}</Badge>}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i: number) => {
            return <Skeleton key={i} className="h-10 w-full" />;
          })}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-center text-red-500">{error}</p>
        </div>
      ) : orders?.length === 0 ? (
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-center">Orders not found!</p>
        </div>
      ) : (
        <React.Fragment>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead
                  onClick={() => toggleSort('totalAmount')}
                  className="cursor-pointer"
                >
                  Total <ArrowUpDown className="inline ml-1 w-4 h-4" />
                </TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => toggleSort('createdAt')}
                >
                  Date
                  <ArrowUpDown className="inline ml-1 w-4 h-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id.slice(-6)}</TableCell>
                  <TableCell>
                    {order.items.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex items-center gap-3"
                      >
                        <Image
                          src={item.product.image.url}
                          alt={item.product.name}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} × ${item.product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.paymentStatus === 'Paid'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.orderStatus === 'Processing'
                          ? 'secondary'
                          : order.orderStatus === 'Shipped'
                          ? 'default'
                          : order.orderStatus === 'Delivered'
                          ? 'outline'
                          : 'destructive'
                      }
                    >
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{moment(order.createdAt).format('lll')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
