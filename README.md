# VastraVerse - Online Clothing Shopping System

**Tagline:** *Your Fashion, Your Way — Explore the Universe of Indian Fashion*

## 🌟 Overview

VastraVerse is a full-stack online clothing shopping web application that celebrates Indian fashion. Built with modern technologies, it offers a seamless shopping experience with traditional and contemporary clothing options.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure signup/login with JWT tokens
- **Product Catalog**: Browse products by categories (Men, Women, Kids, Traditional)
- **Dynamic Product Loading**: Products loaded from JSON files for each category
- **Shopping Cart**: Add, update, and remove items with real-time updates
- **Wishlist**: Save favorite items for later
- **Advanced Filters**: Filter by size, price range, and brand
- **Sorting Options**: Sort products by price, rating, and newest arrivals
- **Checkout Process**: Streamlined order placement with order tracking
- **Responsive Design**: Fully responsive layout for all device sizes

### Technical Features
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Indian-Inspired UI**: Beautiful color scheme with saffron, deep blue, and gold
- **Real-time Updates**: Dynamic cart and wishlist management
- **Secure Backend**: JWT authentication, bcrypt password hashing
- **RESTful API**: Clean API design with proper error handling
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling with custom theming
- **React Router** for client-side routing
- **Zustand** for state management
- **Axios** for API calls
- **React Hot Toast** for user notifications
- **Lucide React** for beautiful, consistent icons
- **React Intersection Observer** for infinite scrolling
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **JSON-based data storage** for products
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **Netlify Functions** for serverless backend

  ### 🖼️ Screenshots

![Home Page](https://github.com/yogendra-08/VastraVerse-Online_Clothing_Shopping_System/blob/main/pictures/home-page.png?raw=true)

![Category Page](https://github.com/yogendra-08/VastraVerse-Online_Clothing_Shopping_System/blob/main/pictures/category.png?raw=true)

![GenZ Collection](https://github.com/yogendra-08/VastraVerse-Online_Clothing_Shopping_System/blob/main/pictures/genz.png?raw=true)

![Traditional Collection](https://github.com/yogendra-08/VastraVerse-Online_Clothing_Shopping_System/blob/main/pictures/traditional.png?raw=true)


## 📁 Project Structure

```
VastraVerse/
├── frontend/
│   ├── public/
│   │   ├── mens_products.json        # Men's product data
│   │   ├── womens_products.json      # Women's product data
│   │   └── kids_products.json        # Kids' product data
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Navigation component
│   │   │   ├── Footer.tsx            # Footer component
│   │   │   ├── ProductCard.tsx       # Product display card
│   │   │   ├── CartItem.tsx          # Cart item component
│   │   │   └── WishlistItem.tsx      # Wishlist item component
│   │   ├── pages/
│   │   │   ├── HomePage.tsx          # Landing page
│   │   │   ├── LoginPage.tsx         # User login
│   │   │   ├── SignupPage.tsx        # User registration
│   │   │   ├── ProductsPage.tsx      # Product catalog
│   │   │   ├── MensCollectionPage.tsx # Men's collection
│   │   │   ├── WomensCollectionPage.tsx # Women's collection
│   │   │   ├── KidsCollectionPage.tsx # Kids' collection
│   │   │   ├── CartPage.tsx          # Shopping cart
│   │   │   ├── WishlistPage.tsx      # Wishlist page
│   │   │   └── CheckoutPage.tsx      # Order checkout
│   │   ├── hooks/
│   │   │   ├── useCart.tsx           # Cart state management
│   │   │   └── useProducts.tsx       # Products data fetching
│   │   ├── utils/
│   │   │   ├── api.ts                # API utility functions
│   │   │   └── productApi.ts         # Product API utilities
│   │   ├── main.tsx                  # React entry point
│   │   └── App.tsx                   # Main app component
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── netlify/
│   └── functions/                    # Netlify serverless functions
│       ├── api.js                   # Main API handler
│       ├── auth-login.js            # Login function
│       └── auth-register.js         # Registration function
│
├── .gitignore
├── netlify.toml                      # Netlify configuration
└── package.json                     # Root package.json
```
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Supabase Account** (free tier available)
- **npm** or **yarn**

## 🌐 Deployment

### Deploy to Vercel (Full-Stack)
1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set Environment Variables** in Vercel dashboard:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=your-jwt-secret
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. **Deploy** - Vercel will automatically build both frontend and backend

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VastraVerse
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   ```

4. **Set up Supabase Database**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the initialization SQL from `backend/src/config/db.ts`
   - Copy your project URL and API keys to the `.env` file

5. **Start the Backend Server**
   ```bash
   npm run dev
   ```

6. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

7. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```

8. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 🎨 Design Features

### Color Palette
- **Saffron**: `#f17316` - Primary brand color
- **Deep Blue**: `#1e40af` - Secondary color for trust and stability
- **Gold**: `#eab308` - Accent color for premium feel
- **Gradients**: Beautiful gradients combining these colors

### UI Components
- **Modern Cards**: Elevated cards with subtle shadows and hover effects
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Indian Typography**: Noto Sans Devanagari for Hindi text support
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Accessible Design**: High contrast ratios and keyboard navigation

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search?q=query` - Search products

### Cart (Protected Routes)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Wishlist (Protected Routes)
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove item from wishlist
- `POST /api/wishlist/move-to-cart/:productId` - Move item to cart
- `DELETE /api/wishlist/clear` - Clear entire wishlist

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image VARCHAR(500),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Cart Table
```sql
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
);
```

### Wishlist Table
```sql
CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
);
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Add/remove items to/from cart
- [ ] Add/remove items to/from wishlist
- [ ] Checkout process
- [ ] Responsive design on different devices
- [ ] API error handling

## 🚀 Deployment

### Backend Deployment
1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, DigitalOcean, AWS, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to a static hosting service (Netlify, Vercel, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

**VastraVerse Development Team**
- Yogendra Bhange 
- Yash Dudhe
- Anuj Dudhe
- Rudresh Vyas
- Raj kathoute

---

**VastraVerse** - *Celebrating Indian Fashion in the Digital Age* 🇮🇳✨
