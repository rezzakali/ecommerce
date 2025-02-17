export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  address: string;
  role: string;
  authProvider: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface UserResponse {
  message: string;
  data: UserInterface[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalUsers: number;
  };
}

export interface UserUpdateForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  authProvider: string;
}
