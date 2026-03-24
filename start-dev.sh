#!/bin/bash

# Start Development Environment (Linux/Mac)
# This script starts both frontend and backend

echo "================================================"
echo "  ShopEase Development Environment Startup"
echo "================================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Installing frontend dependencies..."
    npm install
fi

# Check if backend virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "⚠️  Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "⚠️  Creating .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
fi

echo "✅ Prerequisites checked"
echo ""
echo "Starting services..."
echo ""

# Start backend
echo "Starting Backend (Python Flask)..."
cd backend
source venv/bin/activate
python run.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "Starting Frontend (Next.js)..."
npm run dev &
FRONTEND_PID=$!

# Allow a moment for servers to start
sleep 3

echo ""
echo "================================================"
echo "✅ Services Starting..."
echo "================================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Handle cleanup
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

# Keep script running
wait
