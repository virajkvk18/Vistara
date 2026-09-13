@echo off
echo ============================================
echo   VISTARA - Starting all services...
echo ============================================
echo.

echo [1/2] Starting Backend (FastAPI)...
start "VISTARA Backend" cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000"

timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend (Next.js)...
start "VISTARA Frontend" cmd /k "npm run dev"

echo.
echo ============================================
echo   Both services starting!
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:8000
echo   API Docs : http://localhost:8000/docs
echo ============================================
echo.
pause
