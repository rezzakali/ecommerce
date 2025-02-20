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
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function DashboardOverview({ data }: { data: DashboardData }) {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    revenueTrends: [],
  });

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await fetch('/api/dashboard/analytics', {
        credentials: 'include',
      });
      const data = await res.json();
      setAnalytics(data);
    }
    fetchAnalytics();
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue Trend Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.revenueTrends}>
                <XAxis dataKey="_id" stroke="#8884d8" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders vs Revenue Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders vs Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.revenueTrends}>
                <XAxis dataKey="_id" stroke="#8884d8" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSales" fill="#82ca9d" name="Revenue ($)" />
                <Bar dataKey="totalOrders" fill="#8884d8" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Latest Orders */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between w-full">
            <p>Latest Orders</p>
            <Link
              href={'/dashboard/orders'}
              className="hover:underline text-sm"
            >
              View All
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.latestOrders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell>{order._id.slice(-6)}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        order.orderStatus === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : order.orderStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        order.paymentStatus === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : order.paymentStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.paymentStatus}
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
