export interface ProductInterface {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: {
    url: string;
    fileId: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationInterface {
  totalProducts: number;
  currentPage: number;
  totalPages: number;
}

export interface ProductsResponse {
  message: string;
  data: ProductInterface[];
  pagination: PaginationInterface;
}

export interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  latestOrders: {
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
}

// hello
