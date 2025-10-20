@echo off
echo =======================================
echo   World Cup Betting App - One Click Run
echo =======================================

REM Ensure we’re in the project root
cd /d %~dp0

echo.
echo Installing all dependencies...
call npm run install:all

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ Error installing dependencies.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ✅ Dependencies installed successfully.
echo Starting the project in development mode...
echo.

call npm run dev

pause
