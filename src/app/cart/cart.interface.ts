import { ProductInterface } from '@/src/@types';

export interface CartItem {
  product: ProductInterface;
  quantity: number;
  _id: string;
}

export interface CartInterface {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
