@echo off
setlocal
set "SITE_DIR=%~dp0"
if not exist "%SITE_DIR%index.html" (
  echo StationMadad Howrah cannot start because index.html was not found.
  echo.
  echo Please extract the full ZIP first, then open this launcher from the extracted folder.
  echo.
  echo Steps:
  echo 1. Right-click station-madad-howrah-portable.zip
  echo 2. Select Extract All
  echo 3. Open the extracted station-madad-howrah folder
  echo 4. Double-click this file again
  echo.
  pause
  exit /b 1
)
start "" "%SITE_DIR%index.html"
endlocal
