# =============================================================================
#  Register MySQL as a Windows service
# =============================================================================
#
#  You do NOT need this for day-to-day development — `npm run dev` already starts
#  MySQL automatically (see scripts/ensure-mysql.js).
#
#  Run this when you want MySQL to start on boot, without the app needing to do
#  it. That is what you will want on a real shop computer.
#
#  HOW TO RUN:
#    1. Right-click this file
#    2. "Run with PowerShell" as administrator
#
#  or from an ADMIN PowerShell window:
#    powershell -ExecutionPolicy Bypass -File scripts\setup-mysql-service.ps1
#
# =============================================================================

$ErrorActionPreference = "Stop"

$MysqlBase   = "C:\Program Files\MySQL\MySQL Server 8.4"
$Mysqld      = Join-Path $MysqlBase "bin\mysqld.exe"
$DataDir     = "C:\ProgramData\MySQL\data"
$IniPath     = "C:\ProgramData\MySQL\my.ini"
$ServiceName = "MySQL84"

# --- check we are actually running as administrator --------------------------
$isAdmin = ([Security.Principal.WindowsPrincipal] `
    [Security.Principal.WindowsIdentity]::GetCurrent()
).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host ""
    Write-Host "  This script must be run as administrator." -ForegroundColor Red
    Write-Host "  Right-click it and choose 'Run with PowerShell' as admin." -ForegroundColor Red
    Write-Host ""
    exit 1
}

# --- sanity checks -----------------------------------------------------------
if (-not (Test-Path $Mysqld)) {
    Write-Host "  Could not find mysqld.exe at: $Mysqld" -ForegroundColor Red
    Write-Host "  Edit the `$MysqlBase variable at the top of this script." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $DataDir)) {
    Write-Host "  Could not find the data directory at: $DataDir" -ForegroundColor Red
    exit 1
}

# --- write my.ini ------------------------------------------------------------
Write-Host "  Writing config to $IniPath ..." -ForegroundColor Cyan

$ini = @"
[mysqld]
basedir=$MysqlBase
datadir=$DataDir
port=3306
bind-address=127.0.0.1

# Keep table/column names case-insensitive, which is the Windows default and
# what the ERP code assumes.
lower_case_table_names=1

max_connections=151
default-storage-engine=INNODB

[client]
port=3306
"@

Set-Content -Path $IniPath -Value $ini -Encoding ASCII
Write-Host "  Config written." -ForegroundColor Green

# --- remove any existing service so this script can be re-run safely ---------
$existing = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue

if ($existing) {
    Write-Host "  Service '$ServiceName' already exists. Removing it first ..." -ForegroundColor Yellow

    if ($existing.Status -eq "Running") {
        Stop-Service -Name $ServiceName -Force
        Start-Sleep -Seconds 3
    }

    & $Mysqld --remove $ServiceName
    Start-Sleep -Seconds 2
}

# --- stop any hand-started mysqld so it does not hold the port ---------------
$running = Get-Process mysqld -ErrorAction SilentlyContinue

if ($running) {
    Write-Host "  Stopping manually-started MySQL ..." -ForegroundColor Yellow
    $running | Stop-Process -Force
    Start-Sleep -Seconds 4
}

# --- install and start -------------------------------------------------------
Write-Host "  Installing service '$ServiceName' ..." -ForegroundColor Cyan
& $Mysqld --install $ServiceName --defaults-file="$IniPath"

Start-Sleep -Seconds 2

Set-Service -Name $ServiceName -StartupType Automatic
Start-Service -Name $ServiceName

Start-Sleep -Seconds 6

$svc = Get-Service -Name $ServiceName

Write-Host ""
Write-Host "  Service : $($svc.Name)"
Write-Host "  Status  : $($svc.Status)"
Write-Host "  Startup : Automatic"
Write-Host ""

if ($svc.Status -eq "Running") {
    Write-Host "  Done. MySQL will now start automatically on boot." -ForegroundColor Green
} else {
    Write-Host "  Service installed but not running. Check the .err file in $DataDir" -ForegroundColor Red
}

Write-Host ""
Write-Host "  To undo all of this:" -ForegroundColor DarkGray
Write-Host "    Stop-Service $ServiceName" -ForegroundColor DarkGray
Write-Host "    & '$Mysqld' --remove $ServiceName" -ForegroundColor DarkGray
Write-Host ""
