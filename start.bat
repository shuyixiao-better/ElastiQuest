@echo off
chcp 65001 >nul
echo 🚀 ElastiQuest 启动脚本
echo =======================

REM 检查 .env 文件
if not exist "backend\.env" (
    echo ⚠️  未找到 backend\.env 文件
    echo 📝 正在从模板创建...
    copy "backend\.env.example" "backend\.env"
    echo ✅ 已创建 backend\.env 文件
    echo ⚠️  请编辑 backend\.env 文件，填入你的 LLM_API_KEY
    echo.
    pause
)

echo.
echo 🔧 启动后端服务...
start "ElastiQuest Backend" cmd /k "cd backend && mvn spring-boot:run"

echo ⏳ 等待后端启动...
timeout /t 10 /nobreak >nul

echo.
echo 🎨 启动前端服务...
start "ElastiQuest Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ 服务启动完成！
echo 📍 前端地址: http://localhost:3000
echo 📍 后端地址: http://localhost:8080
echo 📍 API 文档: http://localhost:8080/swagger-ui.html
echo.
echo 提示：关闭命令行窗口即可停止对应服务
pause

