@echo off
echo =======================================
echo     Starting Nexus LLM TestGen
echo =======================================
echo.
echo Starting Backend on port 3001...
start cmd /k "cd backend && npm run dev"
echo Starting Frontend on Vite default port...
start cmd /k "cd frontend && npm run dev"
echo.
echo Servers are booting up in separate windows. Close them when done.
pause
