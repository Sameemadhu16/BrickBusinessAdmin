Write-Host "Setting up Brick Business Admin Dashboard..." -ForegroundColor Green
Write-Host ""

Write-Host "Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location "Backend\BrickBusinessAPI"
dotnet restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to restore backend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location "..\..\Frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Start Backend: cd Backend\BrickBusinessAPI && dotnet run" -ForegroundColor White
Write-Host "2. Start Frontend: cd Frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The backend will be available at: https://localhost:7001" -ForegroundColor White
Write-Host "The frontend will be available at: http://localhost:3000" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
