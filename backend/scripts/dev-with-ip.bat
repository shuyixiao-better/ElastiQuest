@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  ElastiQuest 后端服务                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM 获取本地 IP 地址
echo 🌐 访问地址:
echo    - Local:   http://localhost:8080
echo    - Swagger: http://localhost:8080/swagger-ui.html

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set "ip=%%a"
    set "ip=!ip:~1!"
    if not "!ip!"=="127.0.0.1" (
        echo    - Network: http://!ip!:8080
    )
)

echo.
echo 📝 提示:
echo    - 按 Ctrl+C 停止服务
echo    - 确保已配置 backend/.env 文件中的 LLM_API_KEY
echo    - 前端服务需要在 http://localhost:3000 运行
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

REM 启动 Maven
mvn spring-boot:run

