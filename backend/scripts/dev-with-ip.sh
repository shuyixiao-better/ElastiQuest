#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  ElastiQuest 后端服务                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 获取本地 IP 地址
echo "🌐 访问地址:"
echo "   - Local:   http://localhost:8080"
echo "   - Swagger: http://localhost:8080/swagger-ui.html"

# 获取所有非回环的 IPv4 地址
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IPS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}')
else
    # Linux
    IPS=$(hostname -I)
fi

for IP in $IPS; do
    if [[ $IP != 127.0.0.1 ]]; then
        echo "   - Network: http://$IP:8080"
    fi
done

echo ""
echo "📝 提示:"
echo "   - 按 Ctrl+C 停止服务"
echo "   - 确保已配置 backend/.env 文件中的 LLM_API_KEY"
echo "   - 前端服务需要在 http://localhost:3000 运行"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 启动 Maven
mvn spring-boot:run

