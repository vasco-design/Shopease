# Frontend Integration Guide

This document outlines how to integrate the Next.js frontend with the Flask backend.

## Setup

### 1. Environment Configuration

Create `.env.local` in the project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. API Service

The API integration is handled in `src/lib/api.ts`. This file includes:
- Product API methods
- Admin API methods
- Inventory API methods
- Order API methods
- Chatbot API methods
- Payment API methods

### 3. Key Pages

#### Dashboard (`/`)
- Displays featured products
- Uses `productAPI.getAll()`

#### Products (`/products`)
- Browse all products
- Search and filter functionality
- Pagination support

#### Admin (`/admin`)
- Dashboard with statistics
- Product management
- Inventory tracking
- Order management
- Uses `adminAPI.*` methods

#### Checkout (`/checkout`)
- Order creation form
- Payment processing
- Confirmation page
- Uses `orderAPI.create()` and `paymentAPI.*` methods

#### Order Tracking (`/orders`)
- Search orders by ID
- View order status
- Track items
- Uses `orderAPI.getById()`

#### Chatbot
- Floating chat widget on all pages
- Available in `src/components/chatbot.tsx`
- Uses `chatbotAPI.sendMessage()`

## Features Implemented

✅ Product Listing and Details  
✅ Shopping Cart  
✅ Product Search and Filtering  
✅ Order Creation  
✅ Payment Simulation  
✅ Order Tracking  
✅ Admin Dashboard  
✅ Inventory Management  
✅ Chatbot Integration  
✅ Dark Mode Support  
✅ Responsive Design  

## Running the Application

### Terminal 1 - Frontend
```bash
npm run dev
# Available at http://localhost:3000
```

### Terminal 2 - Backend
```bash
cd backend
python run.py
# Available at http://localhost:5000
```

## API Documentation

All API endpoints are documented in `backend/README.md`

## Common Issues

**Chatbot not responding:**
- Check if backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` is set correctly

**Payment failing:**
- Simulate payment uses test card: 4111111111111111
- CVV: Any 3 digits
- Expiry: Any future date

**Admin dashboard empty:**
- Backend must be running
- Sample data initializes on first run

## Extending the Application

### Add New Products
1. Use admin dashboard or API
2. Products are stored in SQLite database
3. Inventory is auto-created with each product

### Add New Pages
1. Create in `src/app/`
2. Use API methods from `src/lib/api.ts`
3. Add navigation link to navbar

### Customize Chatbot
1. Edit `src/components/chatbot.tsx`
2. Update responses in `backend/app/routes/chatbot.py`
3. Add new API endpoints as needed

## Performance Optimization

- Implement caching for products
- Optimize images
- Use lazy loading for order lists
- Implement pagination for admin tables

## Security Notes

⚠️ **Development Mode:**
- JWT secret is exposed in `.env`
- Payment processing is simulated
- No real data protection

✅ **Production Mode:**
- Use environment variables for secrets
- Implement proper authentication
- Add HTTPS
- Deploy to secure servers

## Components Used

- **Shadcn/UI** - Button, Input, Card, Badge, etc.
- **Lucide React** - Icons
- **Framer Motion** - Animations
- **Radix UI** - Base component library

## Next Steps

1. Add user authentication
2. Implement real payment gateway
3. Add email notifications
4. Set up analytics
5. Deploy to production
6. Add more product categories
7. Implement reviews system
8. Add wishlist functionality
