'use client';

import { Box, List, ShoppingCart, Users } from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/src/components/ui/sidebar';
import { NavMain } from './dashboard/nav-main';
import { NavUser } from './dashboard/nav-user';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Products',
      icon: Box,
      items: [
        {
          title: 'Product List',
          url: '/dashboard/products',
        },
        {
          title: 'Add Product',
          url: '/dashboard/products/add-product',
        },
      ],
    },
    {
      title: 'Categories',
      icon: List,
      items: [
        {
          title: 'Category List',
          url: '/dashboard/categories',
        },
        {
          title: 'Add Category',
          url: '/dashboard/categories/add-category',
        },
      ],
    },

    {
      title: 'Users',
      icon: Users,
      items: [
        {
          title: 'Users List',
          url: '/dashboard/users',
        },
      ],
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      items: [
        {
          title: 'Orders List',
          url: '/dashboard/orders',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
