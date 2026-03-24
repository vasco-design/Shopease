# ShopEase Backend - Flask API

A complete Flask-based backend for an e-commerce platform with admin panel, inventory management, order processing, chatbot, and simulated payment processing.

## Features

### 1. **Admin Panel** 
- Manage products (CRUD operations)
- View dashboard statistics
- Track inventory levels
- Monitor orders and revenue

### 2. **Product Management**
- Full product catalog with categories
- Search and filter functionality
- Product details and pricing
- Size/variant support

### 3. **Inventory Management**
- Real-time stock tracking
- Low stock alerts
- Reorder level configuration
- Stock updates on purchases

### 4. **Order Processing**
- Create and manage orders
- Order status tracking (Pending, Processing, Shipped, Delivered, Cancelled)
- Payment status management
- Order cancellation with inventory restoration

### 5. **Chatbot**
- Rule-based customer support chatbot
- FAQ responses
- Common questions handling
- Suggestions feature

### 6. **Payment Simulation**
- Multiple payment methods (Credit Card, Debit Card, Digital Wallet, Bank Transfer)
- Transaction processing simulation
- Receipt generation
- Payment status tracking
- Fee calculation

## Tech Stack

- **Framework**: Flask 3.0.0
- **Database**: SQLite with SQLAlchemy ORM
- **API**: RESTful API with CORS support
- **Authentication**: JWT (Flask-JWT-Extended)
- **Database**: SQLAlchemy 2.0.23

## Installation

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Create Virtual Environment** (Optional but recommended)
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Linux/Mac
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**
   ```bash
   python run.py
   ```

The server will start at `http://localhost:5000`

## API Endpoints

### Admin Routes (`/api/admin`)
- **GET** `/stats` - Get dashboard statistics
- **GET** `/products` - Get all products
- **POST** `/products` - Create new product
- **PUT** `/products/<product_id>` - Update product
- **DELETE** `/products/<product_id>` - Delete product

### Products Routes (`/api/products`)
- **GET** `/` - Get all products with pagination
- **GET** `/<product_id>` - Get specific product
- **GET** `/category/<category>` - Get products by category
- **GET** `/categories` - Get all categories

### Inventory Routes (`/api/inventory`)
- **GET** `/` - Get all inventory items
- **GET** `/low-stock` - Get low stock items
- **GET** `/<product_id>` - Get inventory for product
- **PUT** `/<product_id>` - Update stock levels

### Orders Routes (`/api/orders`)
- **GET** `/` - Get all orders with filtering
- **POST** `/` - Create new order
- **GET** `/<order_id>` - Get order details
- **PUT** `/<order_id>` - Update order status
- **POST** `/<order_id>/cancel` - Cancel order

### Chatbot Routes (`/api/chatbot`)
- **POST** `/chat` - Send message to chatbot
- **GET** `/faq` - Get FAQ list
- **GET** `/suggestions` - Get chat suggestions

### Payment Routes (`/api/payment`)
- **POST** `/initiate` - Initiate payment process
- **POST** `/process` - Process payment transaction
- **GET** `/status/<transaction_id>` - Check payment status
- **GET** `/methods` - Get available payment methods

## Database Models

### Product
```typescript
- id: string (primary key)
- title: string
- price: float
- category: string
- img: string (URL)
- desc: string
- sizes: string (comma-separated)
- created_at: datetime
- updated_at: datetime
```

### Inventory
```typescript
- id: integer (primary key)
- product_id: string (foreign key)
- stock: integer
- reorder_level: integer
- last_updated: datetime
```

### Order
```typescript
- id: string (UUID, primary key)
- customer_name: string
- customer_email: string
- customer_phone: string
- total_amount: float
- status: string (Pending, Processing, Shipped, Delivered, Cancelled)
- payment_status: string (Pending, Completed, Failed)
- payment_method: string
- address: string
- created_at: datetime
- updated_at: datetime
```

### OrderItem
```typescript
- id: integer (primary key)
- order_id: string (foreign key)
- product_id: string (foreign key)
- quantity: integer
- price: float
```

## Example API Usage

### Create an Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "1234567890",
    "address": "123 Main St, City",
    "items": [
      {
        "product_id": "p1",
        "quantity": 2
      }
    ]
  }'
```

### Process Payment
```bash
curl -X POST http://localhost:5000/api/payment/process \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "uuid-here",
    "card_number": "4111111111111111",
    "cvv": "123",
    "expiry": "12/25"
  }'
```

### Chat with Chatbot
```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, what is your return policy?"
  }'
```

## Configuration

Edit `.env` file to configure:
- `FLASK_ENV` - Environment (development/production)
- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - Secret key for sessions
- `JWT_SECRET_KEY` - JWT signing key

## Database Initialization

Sample products are automatically initialized on first run. The database file (`shopease.db`) will be created in the backend directory.

## Error Handling

All endpoints return consistent JSON responses:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Payment Methods

The system supports:
1. **Credit Card** - 2% processing fee
2. **Debit Card** - 1% processing fee
3. **Digital Wallet** - No fee
4. **Bank Transfer** - 1.5% processing fee

Payment processing simulates 95% success rate for testing purposes.

## Notes

- The SQLite database is stored as `backend/shopease.db`
- PaymentSimulation uses in-memory storage for transactions (resets on restart)
- Chatbot uses rule-based responses (easily extensible to AI models)
- CORS is enabled for frontend integration
- All timestamps are in UTC

## Development

To extend the API:

1. **Add new model**: Create file in `app/models/`
2. **Add new routes**: Create file in `app/routes/` and register in `app/__init__.py`
3. **Register blueprint**: Add to `create_app()` function

## Testing

Use tools like Postman or curl to test endpoints. Sample data is auto-loaded on startup.

## License

Private - ShopEase Project

## Support

For issues or questions, refer to the Next.js frontend integration guide.
