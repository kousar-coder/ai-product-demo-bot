#!/bin/bash

echo "🚀 Setting up AI Voice Agent Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Creating environment file..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Environment file created from template"
else
    echo "⚠️  .env file already exists, skipping..."
fi

echo "🎨 Building Tailwind CSS..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the backend server (Django)"
echo "2. Run 'npm run dev' to start the frontend"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Check README.md for detailed instructions" 