export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  __v: number;
}

export interface PaginationInterface {
  totalCategories: number;
  currentPage: number;
  totalPages: number;
}

export interface CategoryResponse {
  message: string | undefined;
  data: Category[];
  pagination: PaginationInterface;
}
