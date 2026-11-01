@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %ERRORLEVEL%==0 (
  py build.py
) else (
  python build.py
)
if %ERRORLEVEL%==0 (
  echo.
  echo Da cap nhat play.html tu su kien moi. Mo play.html de choi.
) else (
  echo.
  echo Loi: Can cai Python 3, hoac kiem tra cu phap js/customEvents.js.
)
pause
