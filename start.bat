@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ElastiQuest 一键启动脚本                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM 检查 .env 文件
if not exist "backend\.env" (
    echo ⚠️  未找到 backend\.env 文件
    echo 📝 正在从模板创建...
    copy "backend\.env.example" "backend\.env"
    echo ✅ 已创建 backend\.env 文件
    echo.
    echo ⚠️  重要提示：
    echo    请编辑 backend\.env 文件，填入你的 LLM_API_KEY
    echo    否则 RAG 功能将无法使用
    echo.
    pause
)

echo 🔧 启动后端服务...
start "ElastiQuest Backend" cmd /k "cd backend\scripts && dev-with-ip.bat"

echo ⏳ 等待后端启动...
timeout /t 10 /nobreak >nul

echo.
echo 🎨 启动前端服务...
start "ElastiQuest Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ 服务启动完成！
echo.
echo 📝 提示：
echo    - 关闭对应的命令行窗口即可停止服务
echo    - 查看各服务窗口获取详细的访问地址（包括局域网 IP）
echo.
pause

