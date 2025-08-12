@echo off
echo Setting up Matt's Eldercare Backend...
echo.

cd backend

echo Installing backend dependencies...
npm install

echo.
echo Backend setup complete!
echo.
echo Next steps:
echo 1. Copy env.example to .env
echo 2. Update .env with your Gmail credentials
echo 3. Run: npm run dev
echo.
echo For detailed instructions, see README.md
pause
