param(
    [switch]$OneFile = $true,
    [switch]$UsePublicPyPI = $false
)

$ErrorActionPreference = "Stop"
$Py = "py"

function Invoke-Step {
    param(
        [string]$Label,
        [scriptblock]$Script
    )
    Write-Host $Label
    & $Script
    if ($LASTEXITCODE -ne 0) {
        throw "$Label failed with exit code $LASTEXITCODE"
    }
}

$pipIndexArgs = @()
if ($UsePublicPyPI) {
    $pipIndexArgs = @("--index-url", "https://pypi.org/simple")
}

Invoke-Step "Upgrading pip..." {
    & $Py -m pip install --upgrade pip @pipIndexArgs
}

Invoke-Step "Installing app dependencies..." {
    & $Py -m pip install -r .\keepAlive_modern_requirements.txt @pipIndexArgs
}

Invoke-Step "Installing PyInstaller..." {
    & $Py -m pip install pyinstaller @pipIndexArgs
}

Invoke-Step "Ensuring Pillow is available for icon conversion..." {
    & $Py -m pip install pillow @pipIndexArgs
}

if (-not (Test-Path .\keepAlive.png)) {
    Write-Warning "keepAlive.png not found. Window/taskbar icon needs keepAlive.png at runtime."
}

$modeArgs = @()
if ($OneFile) {
    $modeArgs += "--onefile"
}

$iconArg = @()
$icoPath = ".\keepAlive.ico"
if ((-not (Test-Path $icoPath)) -and (Test-Path .\keepAlive.png)) {
    Invoke-Step "Converting keepAlive.png to keepAlive.ico..." {
        & $Py -c "from PIL import Image; img=Image.open('keepAlive.png').convert('RGBA'); img.save('keepAlive.ico', format='ICO', sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])"
    }
}

if (Test-Path $icoPath) {
    $iconArg = @("--icon", $icoPath)
} elseif (Test-Path .\keepAlive.png) {
    Write-Warning "keepAlive.png exists, but .ico generation failed."
    Write-Warning "Proceeding without --icon. Runtime window icon from keepAlive.png still works."
}

Invoke-Step "Building executable..." {
    & $Py -m PyInstaller `
      --noconfirm `
      --windowed `
    --name KeepAlive `
      --add-data ".\keepAlive.png;." `
      $modeArgs `
      $iconArg `
      .\keepAlive.py
}

Write-Host "Done. Build output is in .\dist\KeepAlive.exe"
