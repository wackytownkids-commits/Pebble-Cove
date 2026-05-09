@echo off
cd /d "%~dp0"
echo Installing electron + builder (one-time)...
where npm >nul 2>&1
if errorlevel 1 (
  echo Install Node.js from https://nodejs.org/ then re-run.
  pause
  exit /b 1
)
if not exist node_modules call npm install
echo.
echo Building Windows installer (Pebble Cove)...
call npx electron-builder --win
echo.
echo Done. The installer is in dist\.
pause
