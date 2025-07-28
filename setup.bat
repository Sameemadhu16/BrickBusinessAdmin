@echo off
echo Setting up Brick Business Admin Dashboard...
echo.

echo Installing Backend Dependencies...
cd Backend\BrickBusinessAPI
dotnet restore
if %errorlevel% neq 0 (
    echo Failed to restore backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing Frontend Dependencies...
cd ..\..\Frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To start the application:
echo 1. Start Backend: cd Backend\BrickBusinessAPI && dotnet run
echo 2. Start Frontend: cd Frontend && npm run dev
echo.
echo The backend will be available at: https://localhost:7001
echo The frontend will be available at: http://localhost:3000
echo.
pause
