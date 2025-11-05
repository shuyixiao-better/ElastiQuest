@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          安装 Markdown 渲染依赖                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/3] 安装依赖包...
echo.
call npm install

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          ✅ 安装完成！                                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📦 已安装的依赖:
echo    - react-markdown ^9.0.1
echo    - remark-gfm ^4.0.0
echo    - rehype-highlight ^7.0.1
echo    - rehype-raw ^7.0.0
echo    - highlight.js ^11.11.1
echo.
echo 🚀 下一步:
echo    1. 运行 npm run dev 启动开发服务器
echo    2. 访问 http://localhost:3000/rag 测试效果
echo.
pause

