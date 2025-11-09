# 停止占用端口 3000 和 3001 的进程
Write-Host "正在停止占用端口 3000 的进程..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($port3000) {
    Stop-Process -Id $port3000 -Force
    Write-Host "已停止进程 $port3000 (端口 3000)" -ForegroundColor Green
} else {
    Write-Host "端口 3000 未被占用" -ForegroundColor Gray
}

Write-Host "正在停止占用端口 3001 的进程..." -ForegroundColor Yellow
$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($port3001) {
    Stop-Process -Id $port3001 -Force
    Write-Host "已停止进程 $port3001 (端口 3001)" -ForegroundColor Green
} else {
    Write-Host "端口 3001 未被占用" -ForegroundColor Gray
}

Write-Host "完成！" -ForegroundColor Green

