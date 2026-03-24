# Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### Step 1: Frontend Setup
```bash
# Install dependencies
npm install

# Create .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
```

### Step 2: Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Run Both Services

**Option A: Two Terminals (Recommended)**

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
cd backend
python run.py
```

**Option B: PowerShell Script (Windows)**
```powershell
.\start-dev.ps1
```

## ✅ Verify Installation

1. **Frontend**: Open http://localhost:3000
   - Should see ShopEase homepage
   - Chatbot icon in bottom right

2. **Backend**: Open http://localhost:5000/api/admin/stats
   - Should return JSON with stats

3. **Admin Panel**: Visit http://localhost:3000/admin
   - Should show dashboard with stats

## 📄 Default Access

| Component | URL | Status |
|-----------|-----|--------|
| Home | http://localhost:3000 | ✅ |
| Products | http://localhost:3000/products | ✅ |
| Categories | http://localhost:3000/categories | ✅ |
| Checkout | http://localhost:3000/checkout | ✅ |
| Order Tracking | http://localhost:3000/orders | ✅ |
| Admin | http://localhost:3000/admin | ✅ |
| Chatbot | Bottom Right (all pages) | ✅ |

## 🧪 Quick Test

### Test Chatbot
1. Open http://localhost:3000
2. Click message icon (bottom right)
3. Type: "What is your return policy?"
4. Should get instant response

### Test Admin
1. Open http://localhost:3000/admin
2. Should see dashboard with:
   - Total Products: 4
   - Total Orders: 0
   - Total Revenue: $0
   - Low Stock Items: 0

### Test Checkout
1. Go to http://localhost:3000/checkout
2. Fill in customer details
3. Click "Continue to Payment"
4. Use test card: 4111111111111111
5. CVV: 123, Expiry: 12/25
6. Should complete successfully

## 🔧 Troubleshooting

### Port 3000 already in use
```bash
# Change frontend port
npm run dev -- -p 3001
```

### Port 5000 already in use
Edit `backend/run.py` last line:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Database issues
```bash
# Remove old database
cd backend
rm shopease.db

# Run again - it will reinitialize
python run.py
```

### Virtual environment issues
```bash
# Delete and recreate
cd backend
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## 📚 Documentation

- Full setup guide: `PROJECT_SETUP.md`
- Frontend guide: `FRONTEND_INTEGRATION.md`
- Backend guide: `backend/README.md`

## 🎯 Next Steps

1. ✅ Verify all services running
2. ✅ Test each feature
3. 📝 Customize products with your data
4. 👥 Add user authentication
5. 💳 Integrate real payment gateway
6. 🚀 Deploy to production

## 💡 Tips

- **Hot Reload**: Changes auto-reload on save
- **Database**: Reset by deleting `backend/shopease.db`
- **API Testing**: Use Postman or curl for API calls
- **Styling**: Edit Tailwind CSS in `src/app/globals.css`

---

**Setup completed!** Start building! 🎉
