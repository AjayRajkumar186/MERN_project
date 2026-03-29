# Script to automatically add local domains to your hosts file

# 1. Ask for Administrator privileges if we don't already have them
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Requesting Administrator privileges to modify the hosts file..." -ForegroundColor Yellow
    Start-Process PowerShell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

$hostsPath = "$env:windir\System32\drivers\etc\hosts"
$entries = @(
    "127.0.0.1    shopmate.test",
    "127.0.0.1    www.shopmate.test",
    "127.0.0.1    api.shopmate.test"
)

Write-Host "Updating hosts file at: $hostsPath" -ForegroundColor Cyan

$addedEntries = 0
foreach ($entry in $entries) {
    if (!(Select-String -Path $hostsPath -Pattern $entry -Quiet)) {
         Add-Content -Path $hostsPath -Value $entry
         Write-Host "Added: $entry" -ForegroundColor Green
         $addedEntries++
    } else {
         Write-Host "Already exists: $entry" -ForegroundColor Gray
    }
}

if ($addedEntries -eq 0) {
    Write-Host "Your hosts file already has the correct entries." -ForegroundColor Green
} else {
    Write-Host "Successfully updated hosts file!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to close..."
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
