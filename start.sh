#!/bin/bash

echo "🚀 ElastiQuest 启动脚本"
echo "======================="

# 检查 .env 文件
if [ ! -f "backend/.env" ]; then
    echo "⚠️  未找到 backend/.env 文件"
    echo "📝 正在从模板创建..."
    cp backend/.env.example backend/.env
    echo "✅ 已创建 backend/.env 文件"
    echo "⚠️  请编辑 backend/.env 文件，填入你的 LLM_API_KEY"
    echo ""
    read -p "按回车键继续..."
fi

# 启动后端
echo ""
echo "🔧 启动后端服务..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

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
echo "📍 前端地址: http://localhost:3000"
echo "📍 后端地址: http://localhost:8080"
echo "📍 API 文档: http://localhost:8080/swagger-ui.html"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
wait

