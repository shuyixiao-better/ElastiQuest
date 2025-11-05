#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ElastiQuest 一键启动脚本                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 检查 .env 文件
if [ ! -f "backend/.env" ]; then
    echo "⚠️  未找到 backend/.env 文件"
    echo "📝 正在从模板创建..."
    cp backend/.env.example backend/.env
    echo "✅ 已创建 backend/.env 文件"
    echo ""
    echo "⚠️  重要提示："
    echo "   请编辑 backend/.env 文件，填入你的 LLM_API_KEY"
    echo "   否则 RAG 功能将无法使用"
    echo ""
    read -p "按回车键继续..."
fi

# 启动后端
echo ""
echo "🔧 启动后端服务..."
cd backend/scripts
chmod +x dev-with-ip.sh
./dev-with-ip.sh &
BACKEND_PID=$!
cd ../..

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 10

# 启动前端
echo ""
echo "🎨 启动前端服务..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 服务启动完成！"
echo ""
echo "📝 提示："
echo "   - 按 Ctrl+C 停止所有服务"
echo "   - 查看上方输出获取详细的访问地址（包括局域网 IP）"
echo ""

# 等待用户中断
wait

