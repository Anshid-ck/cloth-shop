# POGIEE - Premium Men's Fashion

![POGIEE Banner](https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

**POGIEE** is a modern, full-stack e-commerce application designed for premium men's fashion. Built with React (Vite) and Django, it offers a seamless shopping experience with features like user authentication, product filtering, cart management, and secure payments via Stripe.

## 🚀 Features

-   **User Authentication**: Secure Login & Register with Google OAuth support.
-   **Product Catalog**: Dynamic product listing with advanced filtering (Categories, Search, Sorting).
-   **Product Details**: High-quality image gallery, size selection, and related products.
-   **Shopping Cart & Wishlist**: Persistent cart and wishlist management.
-   **Checkout Flow**: Multi-step checkout process with Stripe payment integration.
-   **Admin Dashboard**: comprehensive admin panel for managing products, orders, and users.
-   **Responsive Design**: Mobile-first UI built with Tailwind CSS.
-   **Scroll-to-Top**: Smooth navigation behavior.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
-   **Routing**: [React Router v7](https://reactrouter.com/)
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Icons**: React Icons & Lucide React
-   **Payments**: Stripe Elements

### Backend
-   **Framework**: [Django 5](https://www.djangoproject.com/)
-   **API**: Django REST Framework (DRF)
-   **Authentication**: JWT (SimpleJWT) & Social Auth
-   **Database**: PostgreSQL (Production) / SQLite (Dev)
-   **Storage**: Cloudinary (Image Hosting)
-   **Payment Processing**: Stripe API

## 📦 Installation

Follow these steps to set up the project locally.

### Prerequisites
-   Node.js & npm
-   Python 3.10+
-   Git

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/cloth-shop.git
cd cloth-shop
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```
Create a virtual environment and activate it:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Set up Environment Variables:
Create a `.env` file in `backend/` and add:
```env
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3 # Or your Postgres URL
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
```
Run Migrations and Start Server:
```bash
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../frontend
```
Install dependencies:
```bash
npm install
```
Start Development Server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the app!

## 🚀 Deployment

-   **Frontend**: Deployed on [Vercel](https://vercel.com).
-   **Backend**: Deployed on [Render](https://render.com).

See `deploy_instructions.md` for full details.

## 📄 License
This project is licensed under the MIT License.
