@echo off
echo Installing Student & Faculty Management System...
echo.

echo Installing root dependencies...
call npm install

echo.
echo Installing server dependencies...
cd server
call npm install
cd ..

echo.
echo Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo Installation complete!
echo.
echo To start the application:
echo 1. Run "npm run dev" to start both server and client
echo 2. Or run "npm run server" and "npm run client" in separate terminals
echo.
echo Default login credentials:
echo Username: admin
echo Password: admin123
echo.
pause
