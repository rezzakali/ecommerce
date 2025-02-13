# E-Commerce Web Application (Next.js 15 + MongoDB + Firebase Auth + Stripe)

## 🚀 Project Overview

This is a **Full-Stack E-Commerce Web Application** built using **Next.js 14 (App Router)** with **MongoDB** as the database, **Firebase Authentication (Google Sign-In)**, and **Stripe for payment processing**. It includes an **Admin Dashboard** to manage products and orders.

---

## Features

### 🛒 Customer Features

- Browse and search for products
- Add products to the cart and checkout
- Secure payment integration
- User authentication with Firebase (Google login)
- Order tracking and history

### 🔧 Admin Dashboard Features

- **Product Management**: Add, edit, and remove products
- **Order Management**: View and update order statuses
- **User Management**: Manage customer accounts
- **Analytics & Reports**: View sales insights
- **Secure Access**: Admin authentication required to access the dashboard

## 🛠 Tech Stack

### **Frontend**

- **Next.js 15** (App Router)
- **ShadCN UI + Tailwind CSS** (For Styling)
- **Redux** (State Management)

### **Backend**

- **Next.js 15 API (App Router)**
- **MongoDB (Mongoose for ORM)**
- **Firebase Authentication (Google Login)**
- **Stripe API (Payments)**

### **Deployment**

- **Frontend & Backend** → Vercel / Railway
- **Database** → MongoDB Atlas

---

## 🔧 Installation & Setup

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app
```

### **2️⃣ Install Dependencies**

```bash
npm install
```

### **3️⃣ Configure Environment Variables**

Create a **.env.local** file and add:

```env
MONGO_URI=your_mongodb_connection_url
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
ADMIN_EMAIL=your_admin_email
```

### **4️⃣ Run the Development Server**

```bash
npm run dev
```

> The app will be available at `http://localhost:3000`

---

## 🏗 Features

✅ **Google Authentication (Firebase Auth)**  
✅ **Product Listing & Filtering**  
✅ **Add to Cart & Checkout (Stripe)**  
✅ **Admin Dashboard (CRUD Products & Orders)**  
✅ **Order Management**  
✅ **Responsive UI with ShadCN & Tailwind**

---

## 🔥 API Endpoints

### **🛍 Products**

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| GET    | `/api/products`     | Fetch all products             |
| GET    | `/api/products/:id` | Fetch product by ID            |
| POST   | `/api/products`     | Create a new product (Admin)   |
| PUT    | `/api/products/:id` | Update product details (Admin) |
| DELETE | `/api/products/:id` | Delete a product (Admin)       |

### **🛒 Cart & Checkout**

| Method | Endpoint        | Description              |
| ------ | --------------- | ------------------------ |
| POST   | `/api/cart`     | Add item to cart         |
| GET    | `/api/cart`     | View cart items          |
| POST   | `/api/checkout` | Initiate Stripe checkout |

### **👤 User Authentication**

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| POST   | `/api/auth/login`   | Login with Google (Firebase) |
| POST   | `/api/auth/logout`  | Logout user                  |
| GET    | `/api/auth/session` | Get current user session     |

### **📦 Orders**

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | `/api/orders`     | Fetch all orders (Admin) |
| POST   | `/api/orders`     | Create a new order       |
| GET    | `/api/orders/:id` | Get order details        |

### **🔑 Admin Dashboard API Endpoints**

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| GET    | `/api/admin/products`     | Fetch all products (Admin) |
| POST   | `/api/admin/products`     | Add a new product          |
| PUT    | `/api/admin/products/:id` | Update product details     |
| DELETE | `/api/admin/products/:id` | Delete a product           |
| GET    | `/api/admin/orders`       | Fetch all orders (Admin)   |
| PUT    | `/api/admin/orders/:id`   | Update order status        |
| GET    | `/api/admin/users`        | Fetch all users (Admin)    |
| DELETE | `/api/admin/users/:id`    | Delete a user (Admin)      |

---

## 📌 Project Structure

```
/src
 ├── app/
 │   ├── api/
 │   │   ├── products/
 │   │   ├── cart/
 │   │   ├── checkout/
 │   │   ├── auth/
 │   │   ├── orders/
 │   │   ├── admin/
 │   ├── dashboard/
 │   ├── components/
 │   ├── lib/
 │   ├── models/
 │   ├── styles/
 │   ├── utils/
 ├── public/
 ├── .env.local
 ├── package.json
 ├── README.md
```

---

## 🎨 UI Screenshots

- **Home Page (Product Listings)**
- **Product Details Page**
- **Shopping Cart & Checkout**
- **Admin Dashboard (Manage Products, Orders, Users)**

---

## 🚀 Deployment

### **Deploy on Vercel**

```bash
npx vercel
```

### **Deploy Database on MongoDB Atlas**

1. Go to **[MongoDB Atlas](https://www.mongodb.com/atlas)**
2. Create a new database cluster
3. Copy the connection string and update **MONGO_URI** in `.env.local`

---

## 👨‍💻 Contributing

Contributions are welcome! Feel free to submit a PR or open an issue.

---

## 📜 License

This project is **MIT licensed**.
