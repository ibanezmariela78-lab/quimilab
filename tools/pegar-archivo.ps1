param(
    [Parameter(Mandatory=$true)]
    [string]$Path
)

$ErrorActionPreference = "Stop"
$root = "C:\Users\ibane\quimilab"

$fullPath = if ([System.IO.Path]::IsPathRooted($Path)) {
    $Path
} else {
    Join-Path $root $Path
}

$content = Get-Clipboard -Raw

if ([string]::IsNullOrWhiteSpace($content)) {
    throw "El portapapeles está vacío. Copiá primero el código completo."
}

$directory = Split-Path $fullPath -Parent

if (!(Test-Path $directory)) {
    New-Item -ItemType Directory -Force $directory | Out-Null
}

$existed = Test-Path $fullPath

if ($existed) {
    Copy-Item $fullPath "$fullPath.bak" -Force
}

$utf8 = New-Object System.Text.UTF8Encoding($false)

[System.IO.File]::WriteAllText(
    $fullPath,
    $content,
    $utf8
)

Write-Host ""
Write-Host "ARCHIVO ACTUALIZADO:" -ForegroundColor Green
Write-Host $fullPath
Write-Host ""
Write-Host "Se guardó en UTF-8 correctamente." -ForegroundColor Green

if ($existed) {
    Write-Host "Copia de seguridad: $fullPath.bak" -ForegroundColor Yellow
}
