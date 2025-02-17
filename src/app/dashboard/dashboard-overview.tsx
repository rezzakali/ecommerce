'use client';

import { DashboardData } from '@/src/@types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Box, List, ShoppingCart, Users } from 'lucide-react';
import moment from 'moment';

export default function DashboardOverview({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Users',
            value: data?.totalUsers,
            icon: <Users className="w-6 h-6 text-blue-500" />,
          },
          {
            title: 'Total Orders',
            value: data?.totalOrders,
            icon: <ShoppingCart className="w-6 h-6 text-green-500" />,
          },
          {
            title: 'Total Products',
            value: data?.totalProducts,
            icon: <Box className="w-6 h-6 text-yellow-500" />,
          },
          {
            title: 'Total Categories',
            value: data?.totalCategories,
            icon: <List className="w-6 h-6 text-red-500" />,
          },
        ].map((item, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {item.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest Orders */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Latest Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.latestOrders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        order.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{moment(order.createdAt).format('lll')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
