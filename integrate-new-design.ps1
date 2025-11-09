# Integrate new public site design
Write-Host "Integrating new design..." -ForegroundColor Green

# Copy components
Write-Host "`nCopying components..." -ForegroundColor Yellow
Copy-Item "new-public-site\src\components\*" "public-site\src\components\" -Recurse -Force

# Copy assets
Write-Host "Copying assets..." -ForegroundColor Yellow
Copy-Item "new-public-site\src\assets\*" "public-site\src\assets\" -Recurse -Force

# Copy additional dependencies needed
Write-Host "`nUpdating package.json..." -ForegroundColor Yellow
$packagePath = "public-site\package.json"
$package = Get-Content $packagePath | ConvertFrom-Json

# Add missing dependencies
$package.dependencies | Add-Member -NotePropertyName "mathjs" -NotePropertyValue "*" -Force

$package | ConvertTo-Json -Depth 10 | Set-Content $packagePath

Write-Host "`n✅ Design integration complete!" -ForegroundColor Green
Write-Host "`nNext: Creating integrated Landing page with API..." -ForegroundColor Cyan
