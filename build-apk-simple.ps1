# Simple APK Builder - Handles everything in correct order
# No manual steps needed!

Write-Host "======================================" -ForegroundColor Cyan
Write-Host " APK Builder - Simplified" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if already built
if (-not (Test-Path "dist\index.html")) {
    Write-Host "[1/3] Building app..." -ForegroundColor Yellow
    npm install --ignore-scripts
    npm run build
    Write-Host "✓ Build complete" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[1/3] Using existing build..." -ForegroundColor Yellow
    Write-Host "✓ Build found" -ForegroundColor Green
    Write-Host ""
}

# Start server in background
Write-Host "[2/3] Starting preview server..." -ForegroundColor Yellow
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run serve
}
Start-Sleep -Seconds 5
Write-Host "✓ Server running at http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Build APK
Write-Host "[3/3] Building APK..." -ForegroundColor Yellow
Write-Host ""

try {
    bubblewrap build --skipPwaValidation

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ APK built successfully!" -ForegroundColor Green

        # Move APK to build folder
        New-Item -ItemType Directory -Force -Path "build" | Out-Null
        $apkFiles = Get-ChildItem -Filter "*.apk" -ErrorAction SilentlyContinue
        if ($apkFiles) {
            $apkFiles | ForEach-Object {
                Move-Item -Path $_.FullName -Destination "build\" -Force
                Write-Host "✓ APK saved to: build\$($_.Name)" -ForegroundColor Green
            }
        }
    }
} catch {
    Write-Host "Error during build: $_" -ForegroundColor Red
} finally {
    # Always cleanup server
    Write-Host ""
    Write-Host "Stopping server..." -ForegroundColor Yellow
    Stop-Job -Job $serverJob -ErrorAction SilentlyContinue
    Remove-Job -Job $serverJob -ErrorAction SilentlyContinue
    Write-Host "✓ Cleanup complete" -ForegroundColor Green
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Done! Check the build\ folder for your APK" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
