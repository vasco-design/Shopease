# Troubleshooting Guide

Common issues and solutions for ShopEase development.

## 🚀 Startup Issues

### Issue: Port 3000 Already in Use (Frontend)

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:
```bash
# Option 1: Use different port
npm run dev -- -p 3001

# Option 2: Kill process using port (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Option 3: Kill process using port (Linux/Mac)
lsof -ti:3000 | xargs kill -9
```

---

### Issue: Port 5000 Already in Use (Backend)

**Error**: `OSError: [Errno 48] Address already in use`

**Solutions**:
```bash
# Option 1: Change port in backend/run.py
# Change last line to: app.run(debug=True, host='0.0.0.0', port=5001)

# Option 2: Kill process using port (Windows)
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Option 3: Kill process using port (Linux/Mac)
lsof -ti:5000 | xargs kill -9
```

---

### Issue: Backend Module Not Found

**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solutions**:
```bash
# Reinstall dependencies
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# If still failing, use Python 3.8+
python --version

# Try explicit installation
pip install Flask==3.0.0 Flask-SQLAlchemy==3.1.1
```

---

### Issue: Frontend Module Not Found

**Error**: `Cannot find module '@/components/...'`

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 🗄️ Database Issues

### Issue: Database File Corrupted

**Error**: `sqlite3.DatabaseError: database disk image is malformed`

**Solution**:
```bash
cd backend
rm shopease.db
python run.py
```

The database will reinitialize with sample data on startup.

---

### Issue: Tables Not Created

**Error**: `OperationalError: no such table: products`

**Solutions**:
```bash
# Option 1: Delete database and restart
cd backend
rm shopease.db
python run.py

# Option 2: Check Flask app initialization
# Verify models are imported in backend/app/__init__.py
```

---

### Issue: Foreign Key Constraint Error

**Error**: `IntegrityError: FOREIGN KEY constraint failed`

**Solution**:
```bash
# Product must exist before creating inventory
# Check that product_id exists in products table
# Restart with fresh database

cd backend
rm shopease.db
python run.py
```

---

## 🔌 API Issues

### Issue: CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:

1. **Check backend is running**:
   ```bash
   curl http://localhost:5000/api/products
   ```

2. **Verify API URL in frontend**:
   - Check `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
   - Restart frontend: `npm run dev`

3. **Check Flask CORS setup**:
   - Verify `CORS(app)` in `backend/app/__init__.py`

---

### Issue: API Returns 404

**Error**: `404 Not Found`

**Solutions**:

1. **Verify endpoint path**:
   ```bash
   # Correct
   GET http://localhost:5000/api/products
   
   # Wrong
   GET http://localhost:5000/products
   ```

2. **Check Flask blueprints registered**:
   - Verify all routes registered in `backend/app/__init__.py`

3. **Restart backend**:
   ```bash
   # Stop and restart
   python run.py
   ```

---

### Issue: API Returns 500 Error

**Error**: `500 Internal Server Error`

**Solutions**:

1. **Check backend logs** for error messages
2. **Verify database exists**: `backend/shopease.db`
3. **Recreate database**:
   ```bash
   cd backend
   rm shopease.db
   python run.py
   ```

---

## 💳 Payment Issues

### Issue: Payment Always Fails

**Error**: `Payment declined by bank`

**Note**: Backend simulates 95% success rate

**Solutions**:
- Try again (5% will fail randomly)
- Use any test card: 4111111111111111
- Use any 3-digit CVV
- Use any future expiry date: MM/YY

---

### Issue: Transaction Not Found

**Error**: `Transaction not found`

**Solution**:
- Backend stores transactions in memory
- Transactions reset when server restarts
- For persistence, save to database

---

## 💬 Chatbot Issues

### Issue: Chatbot Not Responding

**Error**: No response from chatbot

**Solutions**:

1. **Verify backend running**:
   ```bash
   curl -X POST http://localhost:5000/api/chatbot/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello"}'
   ```

2. **Check browser console** for network errors

3. **Verify API URL** in `src/components/chatbot.tsx`

---

### Issue: Chatbot Trigger Not Visible

**Error**: Chat icon not visible

**Solutions**:

1. **Check component is added to layout**:
   - Verify `import ChatBot from '@/components/chatbot'` in `src/app/layout.tsx`
   - Verify `<ChatBot />` is in JSX

2. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check z-index conflicts**:
   - Ensure chatbot z-index is high (fixed inset-0 z-40)

---

## 📊 Admin Dashboard Issues

### Issue: Admin Stats Show 0

**Error**: All statistics are 0

**Solutions**:

1. **Verify database has data**:
   ```bash
   # Sample products auto-created on startup
   # If not showing, check backend logs
   ```

2. **Restart backend**:
   ```bash
   python run.py
   ```

3. **Check database**:
   ```bash
   cd backend
   python -c "from app import create_app; app = create_app(); \
     from app.models.product import Product; \
     print(Product.query.count())"
   ```

---

### Issue: Admin Can't Update Product

**Error**: Update fails silently

**Solutions**:

1. **Check backend logs** for errors
2. **Verify product exists** with that ID
3. **Restart backend**
4. **Try with curl**:
   ```bash
   curl -X PUT http://localhost:5000/api/admin/products/p1 \
     -H "Content-Type: application/json" \
     -d '{"title": "New Title"}'
   ```

---

## 📦 Package Issues

### Issue: npm Install Takes Forever

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# Or use yarn
yarn install
```

---

### Issue: Missing Peer Dependencies

**Error**: `peer dep missing`

**Solution**:
```bash
# Install with legacy peer deps
npm install --legacy-peer-deps

# Or upgrade packages
npm install @latest
```

---

## 🌐 Network Issues

### Issue: Cannot Reach Backend from Frontend

**Error**: `Cannot reach http://localhost:5000`

**Solutions**:

1. **Verify backend running**:
   ```bash
   curl http://localhost:5000
   ```

2. **Check firewall** allowing port 5000

3. **Try accessing directly**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000/api/products (in browser)

4. **Update API URL** if needed in `.env.local`

---

### Issue: Localhost Not Resolving

**Error**: `getaddrinfo ENOTFOUND localhost`

**Solutions**:

```bash
# Use 127.0.0.1 instead
# Update .env.local:
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
```

---

## 🔐 Authentication Issues

### Issue: JWT Token Invalid

**Error**: `Invalid token` or `Token expired`

**Note**: Current version uses simulated tokens

**Solutions**:
- Clear browser cache
- Login again
- Check token in localStorage

---

## 📱 Responsive Design Issues

### Issue: Layout Breaks on Mobile

**Solutions**:

1. **Check viewport meta tag** in `src/app/layout.tsx`
2. **Verify Tailwind breakpoints** are correct
3. **Use browser DevTools** to test responsive (F12)

---

## 🖼️ Image Issues

### Issue: External Images Not Loading

**Solutions**:

1. **Check image URLs** are valid
2. **Use CORS proxy** if needed
3. **Replace with local images** in `/public`

---

## 🐞 Debug Mode

Enable detailed logging:

**Frontend**:
```bash
# Add to .env.local
NEXT_PUBLIC_DEBUG=true

# Check browser console (F12)
```

**Backend**:
```bash
# Already in debug mode
# Check terminal output for logs

# Or capture output:
python run.py > backend.log 2>&1
```

---

## 📞 Getting More Help

### Check Documentation
1. `PROJECT_SETUP.md` - Full setup guide
2. `QUICKSTART.md` - Quick reference
3. `API_REFERENCE.json` - API endpoints
4. `backend/README.md` - Backend details
5. `FRONTEND_INTEGRATION.md` - Frontend guide

### Test with curl
```bash
# Test API directly
curl -v http://localhost:5000/api/products

# Test with data
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test","...":"..."}'
```

### Check Browser Console
Press F12 in browser to see:
- Network errors
- CORS issues
- JavaScript errors
- API responses

### Check Terminal Output
Useful information in startup terminals:
- Port binding messages
- Database initialization
- API request logs
- Error stack traces

---

## 🆘 Still Having Issues?

1. **Verify all prerequisites**:
   - Node.js 18+
   - Python 3.8+
   - Ports 3000 and 5000 available

2. **Check connections**:
   - Frontend ↔ Backend
   - Backend ↔ Database

3. **Reset everything**:
   ```bash
   # Backend
   cd backend && rm shopease.db && python run.py
   
   # Frontend (in new terminal)
   rm -rf .next node_modules && npm install && npm run dev
   ```

4. **Use provided scripts**:
   - Windows: `.\start-dev.ps1`
   - Linux/Mac: `bash start-dev.sh`

---

**Still stuck?** Check the terminal output carefully - most errors have helpful messages!
