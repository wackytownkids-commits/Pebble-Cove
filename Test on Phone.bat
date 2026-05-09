@echo off
rem Serves Pebble Cove on your local network.
rem Open the URL on your phone (same Wi-Fi as this PC) to play.

cd /d "%~dp0"

echo.
echo ===============================================
echo   PEBBLE COVE — Phone Test Server
echo ===============================================
echo.
echo Finding your computer's local IP...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R "IPv4"') do (
  set "IP=%%a"
  goto :gotip
)
:gotip
set IP=%IP: =%

echo Server starting at:
echo.
echo     http://%IP%:8080/
echo.
echo On your phone (same Wi-Fi as this PC):
echo   1. Open your browser
echo   2. Go to the URL above
echo   3. Add to home screen for full-screen play
echo.
echo Press Ctrl+C to stop the server when you're done.
echo ===============================================
echo.

python -m http.server 8080
if errorlevel 1 (
  echo.
  echo Python wasn't found. Trying py...
  py -3 -m http.server 8080
)
if errorlevel 1 (
  echo.
  echo Couldn't start the server. Install Python from https://python.org
  pause
)
