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
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { startTransition, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { deleteCategory } from './actions';
import { Category, CategoryResponse } from './category.interface';
import EditCategoryDialog from './edit-category-dialog';

const CategoryLists: React.FC<CategoryResponse> = ({ data, pagination }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

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
  const deleteCategoryHandler = async () => {
    setLoading(true);
    startTransition(async () => {
      const res = await deleteCategory(selectedCategory!._id);

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
        description: res?.message || 'Category deleted successfully!',
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
        <Link href="/dashboard/categories/add-category">
          <Button>Add Category</Button>
        </Link>
      </div>
      <div className="flex items-center justify-end">
        <Badge variant="secondary">
          Total Categories : {pagination.totalCategories}
        </Badge>
      </div>
      {data.length === 0 ? (
        <div className="text-center">No categories</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1"
                >
                  Name {getSortIcon('name')}
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
            {data?.map((category: Category) => (
              <TableRow key={category._id} className="text-xs">
                <TableCell>{category.name}</TableCell>

                <TableCell>
                  {moment(category.createdAt).format('llll')}
                </TableCell>
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
                          setSelectedCategory(category);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Edit3 className="mr-2 w-4 h-4" /> Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCategory(category);
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

      {data.length !== 0 && pagination.totalCategories > 10 && (
        <PaginationComponent totalPages={pagination.totalPages} />
      )}
      {editDialogOpen && (
        <EditCategoryDialog
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          category={selectedCategory!}
        />
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={deleteCategoryHandler}
        confirmButtonText="Delete"
        loading={loading}
      />
    </React.Fragment>
  );
};

export default CategoryLists;
