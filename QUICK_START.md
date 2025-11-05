# ElastiQuest 快速开始

## 🚀 3 步启动

### 1️⃣ 配置 API 密钥

```bash
# 进入后端目录
cd backend

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
# 将 LLM_API_KEY=your-molizk-api-key-here 
# 改为你的实际 API 密钥
```

**获取 API 密钥**: https://ai.gitee.com/

### 2️⃣ 安装依赖

**后端**:
```bash
cd backend
mvn clean install
```

**前端**:
```bash
cd frontend
npm install
```

### 3️⃣ 启动服务

**方式一：使用启动脚本（推荐）**

Windows:
```bash
start.bat
```

Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

**方式二：手动启动**

后端（终端1）:
```bash
cd backend
mvn spring-boot:run
```

前端（终端2）:
```bash
cd frontend
npm run dev
```

## 🎯 访问应用

- 🌐 前端: http://localhost:3000
- 🔧 后端: http://localhost:8080
- 📚 API 文档: http://localhost:8080/swagger-ui.html
- 🤖 RAG 问答: http://localhost:3000/rag

## ✨ 功能体验

### RAG 智能问答

1. 访问 http://localhost:3000/rag
2. 在"问题"框输入你的问题
3. 在"参考资料"框粘贴相关内容（可选）
4. 点击"发送问题"
5. 观察流式回答和高亮效果

### 示例问题

**问题**: 什么是 Elasticsearch？

**参考资料**:
```
Elasticsearch 是一个基于 Lucene 的分布式搜索和分析引擎。
它具有实时搜索、高可用性、RESTful API 等特点。
```

## ⚠️ 注意事项

1. **必须配置 API 密钥**: 否则 RAG 功能无法使用
2. **首次启动较慢**: HanLP 需要加载分词模型（10-20秒）
3. **网络要求**: 需要访问 ai.gitee.com

## 🐛 常见问题

**Q: 提示找不到 .env 文件**
A: 确保在 backend 目录下执行 `cp .env.example .env`

**Q: API 调用失败**
A: 检查 .env 文件中的 LLM_API_KEY 是否正确

**Q: Maven 依赖下载慢**
A: 配置国内镜像源或使用 VPN

## 📖 更多文档

- 完整 README: [README.md](README.md)
- 环境变量说明: [backend/README_ENV.md](backend/README_ENV.md)
- 设计文档: [DESIGN.md](DESIGN.md)

