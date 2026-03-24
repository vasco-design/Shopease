# ShopEase - Complete E-Commerce Platform

A full-stack e-commerce platform built with modern technologies including a Next.js frontend, Flask backend, SQLite database, payment simulation, chatbot, and admin panel.

## 🚀 Features

### Frontend (Next.js + React)
- **Product Catalog** - Browse products with search and filtering
- **Shopping Cart** - Add/remove items, manage quantities
- **Checkout** - Complete purchase flow
- **Order Tracking** - Real-time order status updates
- **Chatbot** - AI-powered customer support
- **Responsive Design** - Mobile, tablet, and desktop support
- **Dark Mode** - Theme switching support

### Backend (Flask + SQLite)
- **Admin Panel** - Manage products, inventory, and orders
- **Product Management** - CRUD operations for products
- **Inventory Management** - Track stock levels, low stock alerts
- **Order Processing** - Create, track, and manage orders
- **Payment Simulation** - Multiple payment method support
- **Chatbot API** - Rule-based customer support
- **RESTful API** - Complete API for all operations

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 15.5.6
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI (Radix UI)
- **Animation**: Framer Motion

### Backend
- **Framework**: Flask 3.0.0
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **API**: RESTful with CORS support
- **Authentication**: JWT (Flask-JWT-Extended)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- npm or yarn (for frontend package management)

### 1. Frontend Setup

```bash
# Navigate to project root (if not already there)
cd e:\shopease-clone

# Install dependencies
npm install
# or
yarn install

# Create .env.local file for frontend configuration
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run the Application

#### Terminal 1 - Start Frontend
```bash
# From project root
npm run dev
# or
yarn dev

# Frontend will be available at http://localhost:3000
```

#### Terminal 2 - Start Backend
```bash
# From backend directory
python run.py

# Backend will be available at http://localhost:5000
```

## 📍 Application URLs

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:3000 | Main shopping application |
| Admin Dashboard | http://localhost:3000/admin | Manage products, inventory, orders |
| Order Tracking | http://localhost:3000/orders | Track orders |
| Checkout | http://localhost:3000/checkout | Complete purchases |
| API | http://localhost:5000/api | REST API endpoints |

## 🔌 API Endpoints

### Products (`/api/products`)
- `GET /` - Get all products
- `GET /<id>` - Get product details
- `GET /categories` - Get all categories

### Admin (`/api/admin`)
- `GET /stats` - Dashboard statistics
- `GET /products` - All products
- `POST /products` - Create product
- `PUT /products/<id>` - Update product
- `DELETE /products/<id>` - Delete product

### Orders (`/api/orders`)
- `GET /` - Get all orders
- `POST /` - Create order
- `GET /<id>` - Get order details
- `PUT /<id>` - Update order status
- `POST /<id>/cancel` - Cancel order

### Inventory (`/api/inventory`)
- `GET /` - Get inventory
- `GET /low-stock` - Low stock items
- `PUT /<product_id>` - Update stock

### Payment (`/api/payment`)
- `POST /initiate` - Start payment process
- `POST /process` - Process payment
- `GET /status/<transaction_id>` - Check payment status
- `GET /methods` - Available payment methods

### Chatbot (`/api/chatbot`)
- `POST /chat` - Send message
- `GET /faq` - Get FAQ list
- `GET /suggestions` - Get suggestions

## 💳 Payment Methods

The system supports multiple payment methods with different fees:

1. **Credit Card** - 2% fee
2. **Debit Card** - 1% fee
3. **Digital Wallet** - No fee
4. **Bank Transfer** - 1.5% fee

**Note**: Payment processing simulates a 95% success rate for testing purposes.

## 🗄️ Database Models

### Product
```typescript
{
  id: string,
  title: string,
  price: number,
  category: string,
  img: string,
  desc: string,
  sizes: string[],
  stock: number
}
```

### Order
```typescript
{
  id: string,
  customer_name: string,
  customer_email: string,
  customer_phone: string,
  total_amount: number,
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
  payment_status: 'Pending' | 'Completed' | 'Failed',
  address: string,
  items: OrderItem[]
}
```

### Inventory
```typescript
{
  id: number,
  product_id: string,
  stock: number,
  reorder_level: number
}
```

## 🛡️ Configuration

### Frontend Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend Environment Variables (`.env`)
```env
FLASK_APP=run.py
FLASK_ENV=development
DATABASE_URL=sqlite:///shopease.db
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=jwt-secret-key
```

## 📊 Sample Data

The backend automatically initializes with sample products on first run:
- Classic White T-Shirt (50 stock)
- Running Sneakers (30 stock)
- Denim Jacket (25 stock)
- Wireless Headphones (15 stock)

## 🧪 Testing

### Test Product Creation
```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "p5",
    "title": "Test Product",
    "price": 99,
    "category": "Test",
    "desc": "A test product",
    "stock": 100
  }'
```

### Test Order Creation
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "1234567890",
    "address": "123 Main St",
    "items": [{"product_id": "p1", "quantity": 2}]
  }'
```

### Test Chatbot
```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is your return policy?"}'
```

## 🐛 Troubleshooting

### Backend not connecting
- Ensure backend is running on port 5000
- Check `.env` file configuration
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Database errors
- Delete `backend/shopease.db` to reset database
- Reinstall Python packages: `pip install -r requirements.txt`

### Port conflicts
- Change ports in `backend/run.py` (Flask) or `next.config.ts` (Next.js)
- Update API URL in frontend configuration

## 📚 Project Structure

```
shopease-clone/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── admin/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── products/
│   ├── components/
│   │   ├── chatbot.tsx
│   │   ├── cart-*
│   │   ├── navbar.tsx
│   │   └── ui/
│   └── lib/
│       ├── api.ts (Backend integration)
│       ├── data.ts
│       └── cart.tsx
├── backend/
│   ├── app/
│   │   ├── models/ (Database models)
│   │   ├── routes/ (API endpoints)
│   │   └── templates/
│   ├── run.py (Entry point)
│   ├── requirements.txt
│   └── README.md (Backend documentation)
└── package.json
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Push to GitHub and connect to Vercel
# Set NEXT_PUBLIC_API_URL to production backend
```

### Backend (Heroku/PythonAnywhere)
```bash
# Create Procfile:
web: python run.py

# Deploy as Python application
```

## 📝 License

Private - ShopEase Project

## 👥 Support

For issues or questions, refer to individual README files:
- Frontend: See documentation in `src/`
- Backend: See `backend/README.md`

## 🎯 Next Steps

1. Customize product catalog with your items
2. Update payment methods if needed
3. Enhance chatbot with more responses
4. Configure production environment
5. Deploy to cloud platforms

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Status**: Ready for Development
