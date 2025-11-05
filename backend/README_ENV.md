# 环境变量配置说明

## 快速开始

1. 复制 `.env.example` 文件为 `.env`：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 API 密钥：
```bash
# 模力方舟 LLM API 配置
LLM_API_KEY=你的实际API密钥

# Elasticsearch 配置（可选）
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_SCHEME=http
ELASTICSEARCH_USERNAME=
ELASTICSEARCH_PASSWORD=
```

3. 启动应用：
```bash
mvn spring-boot:run
```

## 注意事项

- `.env` 文件已添加到 `.gitignore`，不会被提交到版本控制
- 请妥善保管你的 API 密钥，不要泄露
- 如果 `.env` 文件不存在，应用会使用环境变量或默认配置

## 获取 API 密钥

访问模力方舟官网获取 API 密钥：https://ai.gitee.com/

