# Check if Inkscape is installed
$inkscapePath = "C:\Program Files\Inkscape\bin\inkscape.exe"
if (-not (Test-Path $inkscapePath)) {
    Write-Host "Inkscape not found. Please install Inkscape first."
    exit 1
}

# Source and destination paths
$svgPath = "..\assets\images\logo.svg"
$pngPath = "..\assets\images\logo.png"

# Convert SVG to PNG
& $inkscapePath --export-type="png" --export-filename=$pngPath $svgPath

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully converted logo to PNG"
} else {
    Write-Host "Failed to convert logo"
    exit 1
} 