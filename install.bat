@echo off
echo ========================================
echo  Online Auction System - Installation
echo ========================================
echo.

echo [1/4] Installing Server Dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Server installation failed!
    pause
    exit /b 1
)
cd ..
echo ✓ Server dependencies installed successfully
echo.

echo [2/4] Installing Client Dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Client installation failed!
    pause
    exit /b 1
)
cd ..
echo ✓ Client dependencies installed successfully
echo.

echo [3/4] Checking Environment Files...
if exist "server\.env" (
    echo ✓ Server .env file exists
) else (
    echo ⚠ Server .env file created - PLEASE CONFIGURE IT!
)

if exist "client\.env" (
    echo ✓ Client .env file exists
) else (
    echo ⚠ Client .env file created - PLEASE CONFIGURE IT!
)
echo.

echo [4/4] Installation Complete!
echo.
echo ========================================
echo  Next Steps:
echo ========================================
echo 1. Configure your API keys in server\.env
echo    (See API_KEYS_TEMPLATE.md for help)
echo.
echo 2. Run the application:
echo    - Open TWO terminal windows
echo    - Terminal 1: cd server ^&^& npm run dev
echo    - Terminal 2: cd client ^&^& npm run dev
echo.
echo 3. Open http://localhost:5173 in your browser
echo.
echo For detailed instructions, see SETUP_GUIDE.md
echo ========================================
echo.
pause
