@echo off
echo 🚀 Setting up AI Voice Agent Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
npm install

echo 🔧 Creating environment file...
if not exist .env (
    copy env.example .env
    echo ✅ Environment file created from template
) else (
    echo ⚠️  .env file already exists, skipping...
)

echo 🎨 Building Tailwind CSS...
npm run build

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Start the backend server (Django)
echo 2. Run 'npm run dev' to start the frontend
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📚 Check README.md for detailed instructions
pause 