'use client';

import ConfirmationDialog from '@/src/components/confirmation-dialog';
import PaginationComponent from '@/src/components/pagination';
import { SearchForm } from '@/src/components/search-form';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { useToast } from '@/src/hooks/use-toast';
import { ArrowUpDown, Edit3, EllipsisVertical, Trash2 } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { startTransition, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { deleteUser } from './actions';
import EditUserDialog from './edit-user-dialog';
import { UserInterface, UserResponse } from './user.interface';

const UserList: React.FC<UserResponse> = ({ data, pagination }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);

  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { toast } = useToast();

  // Debounced search
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Sorting handler
  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams);
    const currentSort = params.get('sort');

    // Toggle sorting order
    if (currentSort === `${field}_asc`) {
      params.set('sort', `${field}_desc`);
    } else {
      params.set('sort', `${field}_asc`);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  // Get current sort direction
  const getSortIcon = (field: string) => {
    const sort = searchParams.get('sort');
    if (sort === `${field}_asc`) return '▲';
    if (sort === `${field}_desc`) return '▼';
    return <ArrowUpDown size={16} />;
  };

  // clear filter handler
  const clearFilter = () => {
    replace(pathname);
  };

  // delete product
  const deleteUserHandler = async () => {
    setLoading(true);
    startTransition(async () => {
      const res = await deleteUser(selectedUser!._id);

      if (res?.error) {
        toast({
          title: 'Error',
          description: res.error || 'Something went wrong!',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Success',
        description: res?.message || 'User deleted successfully!',
      });
      setLoading(false);
      setDeleteDialogOpen(false);
    });
  };

  return (
    <React.Fragment>
      <div className="flex justify-between mb-4 gap-4">
        <div className="flex items-center gap-2 w-full">
          <SearchForm onSearch={(value) => handleSearch(value)} />
          {searchParams.toString() && (
            <Button onClick={clearFilter} variant={'outline'}>
              Clear Filter
            </Button>
          )}
        </div>
        {/* <Link href="/dashboard/products/add">
          <Button>Add Product</Button>
        </Link> */}
      </div>
      <div className="flex items-center justify-end">
        <Badge variant="secondary">Total Users : {pagination.totalUsers}</Badge>
      </div>
      {data.length === 0 ? (
        <div className="text-center">No users</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1"
                >
                  Name/Email {getSortIcon('name')}
                </button>
              </TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1"
                >
                  Role
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('stock')}
                  className="flex items-center gap-1"
                >
                  Auth Provider
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-1"
                >
                  Created At {getSortIcon('createdAt')}
                </button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((user: UserInterface) => (
              <TableRow key={user._id} className="text-xs">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={'/user.png'}
                      alt={user.name}
                      className="object-cover"
                      width={25}
                      height={25}
                    />
                    <div>
                      <span>{user.name}</span> <br />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {user.address && (
                    <span title={user.address || ''}>
                      {user.address.length > 20
                        ? `${user.address.substring(0, 20)}...`
                        : user.address}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={'secondary'} className="rounded-full">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {' '}
                  <Badge variant={'secondary'} className="rounded-full">
                    {user.authProvider}
                  </Badge>
                </TableCell>

                <TableCell>{moment(user.createdAt).format('llll')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Edit3 className="mr-2 w-4 h-4" /> Update
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 w-4 h-4" color="red" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {data.length !== 0 && pagination.totalUsers > 10 && (
        <PaginationComponent totalPages={pagination.totalPages} />
      )}
      {editDialogOpen && (
        <EditUserDialog
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          user={selectedUser!}
        />
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete user"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={deleteUserHandler}
        confirmButtonText="Delete"
        loading={loading}
      />
    </React.Fragment>
  );
};

export default UserList;
