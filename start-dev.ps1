# Start Development Environment (Windows)
# This script starts both frontend and backend

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  ShopEase Development Environment Startup" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if backend virtual environment exists
if (-not (Test-Path "backend\venv")) {
    Write-Host "⚠️  Creating Python virtual environment..." -ForegroundColor Yellow
    cd backend
    python -m venv venv
    cd ..
}

# Create .env.local if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Creating .env.local..." -ForegroundColor Yellow
    @"
NEXT_PUBLIC_API_URL=http://localhost:5000/api
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
}

Write-Host "✅ Prerequisites checked" -ForegroundColor Green
Write-Host ""
Write-Host "Starting services..." -ForegroundColor Cyan
Write-Host ""

# Start backend in new window
Write-Host "Starting Backend (Python Flask)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PWD\backend; .\venv\Scripts\activate; python run.py"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in new window
Write-Host "Starting Frontend (Next.js)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PWD; npm run dev"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ Services Starting..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"
