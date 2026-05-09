@echo off
cd /d "%~dp0"

echo.
echo ===============================================
echo   PEBBLE COVE - Publishing to GitHub Pages
echo ===============================================
echo.

where gh >nul 2>&1
if errorlevel 1 goto NO_GH
where git >nul 2>&1
if errorlevel 1 goto NO_GIT

echo Step 1: configuring git identity...
git config --global user.email "themanwiththeyellowbox@gmail.com"
git config --global user.name "Cory"

echo Step 2: initializing git...
if not exist .git git init -b main

echo Step 3: writing .gitignore...
echo node_modules/> .gitignore
echo dist/>> .gitignore
echo .DS_Store>> .gitignore

echo Step 4: staging files...
git add -A

echo Step 5: committing...
git commit -m "Pebble Cove v0.2 - initial publish"

echo Step 6: creating / pushing GitHub repo...
gh repo view wackytownkids-commits/Pebble-Cove >nul 2>&1
if errorlevel 1 goto CREATE_REPO
goto PUSH_EXISTING

:CREATE_REPO
gh repo create wackytownkids-commits/Pebble-Cove --public --source=. --push --description "A pastel chibi life-sim. Tomodachi vibes, Steam-bound."
if errorlevel 1 goto FAIL
goto ENABLE_PAGES

:PUSH_EXISTING
echo Repo already exists, pushing latest...
git remote add origin https://github.com/wackytownkids-commits/Pebble-Cove.git 2>nul
git branch -M main
git push -u origin main --force

:ENABLE_PAGES
echo Step 7: enabling GitHub Pages...
gh api -X POST repos/wackytownkids-commits/Pebble-Cove/pages -f "source[branch]=main" -f "source[path]=/" 2>nul
gh api -X PUT repos/wackytownkids-commits/Pebble-Cove/pages -f "source[branch]=main" -f "source[path]=/" 2>nul

echo.
echo ===============================================
echo  Done. Your game is at:
echo.
echo    https://wackytownkids-commits.github.io/Pebble-Cove/
echo.
echo  GitHub Pages takes 1-2 minutes to build the
echo  first time. If it 404s, wait and refresh.
echo ===============================================
echo.
pause
goto END

:NO_GH
echo The GitHub CLI is not installed.
echo Install from https://cli.github.com/ then re-run.
pause
goto END

:NO_GIT
echo Git is not installed.
echo Install from https://git-scm.com/ then re-run.
pause
goto END

:FAIL
echo.
echo Something went wrong during repo creation.
echo Scroll up to see the error.
pause
goto END

:END
