@echo off
echo.
echo ========================================
echo    Hashtag Revolution - Quick Deploy
echo ========================================
echo.

echo Setting up GitHub repository and Vercel deployment...
echo.

echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Error installing dependencies!
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

echo Building project...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

echo Initializing Git repository...
git init
git add .
git commit -m "Initial commit: Hashtag Revolution V0 Demo"

echo.
echo 🌐 Next Steps:
echo.
echo 1. Create a new repository on GitHub:
echo    - Go to https://github.com/new
echo    - Name it: hashtag-revolution-v0
echo    - Don't initialize with README
echo.
echo 2. Connect your local repo:
echo    git remote add origin https://github.com/YOUR_USERNAME/hashtag-revolution-v0.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Deploy to Vercel:
echo    - Go to https://vercel.com
echo    - Sign in with GitHub
echo    - Import your repository
echo    - Deploy automatically
echo.
echo Your live demo will be available at:
echo    https://hashtag-revolution-v0.vercel.app
echo.
echo Press any key to continue...
pause > nul

echo.
echo Starting local development server...
echo Visit: http://localhost:3000/
echo.
echo Press Ctrl+C to stop
echo.

npm run dev 