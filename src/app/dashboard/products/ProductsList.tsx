'use client';

import { ProductInterface, ProductsResponse } from '@/src/@types';
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
import {
  ArrowUpDown,
  Edit3,
  EllipsisVertical,
  ImagePlus,
  Trash2,
} from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { startTransition, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { deleteProduct } from './actions';
import EditProductDialog from './edit-dialog';
import UpdateImageDialog from './update-image-dialog';

const ProductsList: React.FC<ProductsResponse> = ({ data, pagination }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imageUpdateDialogOpen, setImageUpdateDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductInterface | null>(null);

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
  const deleteProductHandler = async () => {
    setLoading(true);
    startTransition(async () => {
      const res = await deleteProduct(
        selectedProduct!._id,
        selectedProduct!.image.fileId
      );

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
        description: res?.message || 'Product deleted successfully!',
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
        <Link href="/dashboard/products/add">
          <Button>Add Product</Button>
        </Link>
      </div>
      <div className="flex items-center justify-end">
        <Badge variant="secondary">
          Total Products : {pagination.totalProducts}
        </Badge>
      </div>
      {data.length === 0 ? (
        <div className="text-center">No propducts</div>
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
              <TableHead>Description</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1"
                >
                  Price {getSortIcon('price')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('stock')}
                  className="flex items-center gap-1"
                >
                  Stock {getSortIcon('stock')}
                </button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Image</TableHead>
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
            {data?.map((product: ProductInterface) => (
              <TableRow key={product._id} className="text-xs">
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <span title={product.description}>
                    {product.description.length > 20
                      ? `${product.description.substring(0, 20)}...`
                      : product.description}
                  </span>
                </TableCell>
                <TableCell>&#8377;{product.price?.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {product.image ? (
                    <Image
                      src={
                        product.image.url ||
                        'https://placehold.co/600x400/000000/FFFFFF/png'
                      }
                      alt={product.name}
                      width={30}
                      height={30}
                      className="object-cover"
                    />
                  ) : (
                    'Loading...'
                  )}
                </TableCell>
                <TableCell>
                  {moment(product.createdAt).format('llll')}
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
                          setSelectedProduct(product);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Edit3 className="mr-2 w-4 h-4" /> Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProduct(product);
                          setImageUpdateDialogOpen(true);
                        }}
                      >
                        <ImagePlus className="mr-2 w-4 h-4" /> Update Image
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProduct(product);
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

      {data.length !== 0 && pagination.totalProducts > 10 && (
        <PaginationComponent totalPages={pagination.totalPages} />
      )}
      {editDialogOpen && (
        <EditProductDialog
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          product={selectedProduct!}
        />
      )}

      {imageUpdateDialogOpen && (
        <UpdateImageDialog
          open={imageUpdateDialogOpen}
          setOpen={setImageUpdateDialogOpen}
          product={selectedProduct!}
        />
      )}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete the product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={deleteProductHandler}
        confirmButtonText="Delete"
        loading={loading}
      />
    </React.Fragment>
  );
};

export default ProductsList;
