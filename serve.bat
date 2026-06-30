@echo off
echo Serving portfolio on http://localhost:8000
python -m http.server 8000
if ERRORLEVEL 1 (
  echo Python server failed — trying npx http-server
  npx http-server -p 8000
)
