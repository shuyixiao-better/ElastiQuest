# ElastiQuest Backend

Spring Boot 3.5.x 后端 API 服务

## 技术栈

- Spring Boot 3.5.0
- Java 17
- Elasticsearch Java Client
- SpringDoc OpenAPI (Swagger)

## 开发

### 启动应用

```bash
mvn spring-boot:run
```

或者使用 IDE 运行 `ElasticQuestApplication.java`

### 访问 API

- 应用地址：http://localhost:8080
- API 基础路径：http://localhost:8080/api
- Swagger UI：http://localhost:8080/swagger-ui.html
- API 文档：http://localhost:8080/api-docs

### 配置

编辑 `src/main/resources/application.yml` 来配置应用。

### 测试

```bash
mvn test
```

## 项目结构

```
src/main/java/com/elasticquest/backend/
├── config/          # 配置类（CORS、Web 配置等）
├── controller/      # REST 控制器
├── service/         # 业务逻辑层
├── model/          # 数据模型和 DTO
└── ElasticQuestApplication.java  # 主应用类
```
