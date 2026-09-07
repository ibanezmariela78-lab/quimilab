$ErrorActionPreference = "Continue"
Set-Location "C:\Users\ibane\quimilab"

$output = @()

$output += "=== TYPESCRIPT ==="
$output += (npx tsc --noEmit 2>&1)

$output += ""
$output += "=== ESLINT ==="
$output += (npx eslint . 2>&1)

$output += ""
$output += "=== EXPO DOCTOR ==="
$output += (npx expo-doctor 2>&1)

$output += ""
$output += "=== GIT DIFF CHECK ==="
$output += (git diff --check 2>&1)

$output += ""
$output += "=== GIT STATUS ==="
$output += (git status --short 2>&1)

$text = $output -join "`r`n"
$text | Set-Clipboard
Write-Host $text
Write-Host ""
Write-Host "RESULTADO COPIADO AL PORTAPAPELES" -ForegroundColor Green
