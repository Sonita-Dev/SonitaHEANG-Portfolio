Write-Output "Serving portfolio on http://localhost:8000"
try {
  python -m http.server 8000
} catch {
  Write-Output "Python server failed — trying npx http-server"
  npx http-server -p 8000
}
