@echo off
echo.
echo ========================================
echo    Hashtag Revolution - V0 Demo Setup
echo ========================================
echo.

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Error installing dependencies!
    echo Please make sure you have Node.js installed.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo Starting development server...
echo.
echo Your demo will be available at: http://localhost:3000/
echo.
echo Demo Features:
echo    • Connect Gmail, Slack, Notion
echo    • Smart hashtag extraction
echo    • Advanced search & filtering
echo    • AI-powered assistant
echo    • Beautiful dark theme UI
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev 