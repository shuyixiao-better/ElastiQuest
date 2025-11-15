# ElastiQuest

一个以游戏化方式学习 Elasticsearch 基础 CRUD 操作的互动平台。通过可视化界面与趣味任务，开发者可以在"打怪升级"中轻松掌握文档的创建、查询、更新与删除操作，让枯燥的语法学习变成一场充满成就感的技术冒险！

**English:** ElastiQuest is an interactive, game-inspired learning platform that teaches developers the fundamentals of Elasticsearch CRUD operations through engaging visual interfaces and playful challenges. Turn querying, indexing, updating, and deleting documents into a fun adventure—level up your search skills while having fun!

## 🚀 技术栈

### 前端
- **Next.js 14+**：支持服务端渲染（SSR）的 React 框架
- **TypeScript**：类型安全
- **Tailwind CSS**：实用优先的 CSS 框架
- **Ant Design 5.x**：UI 组件库
- **Zustand**：轻量级状态管理
- **Axios**：HTTP 客户端
- **ECharts/Recharts**：数据可视化
- **Monaco Editor**：代码编辑器

### 后端
- **Spring Boot 3.5.x**：企业级 Java 后端框架
- **Java 17+**：LTS 版本
- **Elasticsearch Java Client**：官方 ES 客户端
- **SpringDoc OpenAPI**：API 文档（Swagger）

## 📁 项目结构

```
ElastiQuest/
├── frontend/                 # Next.js 前端项目
│   ├── app/                  # Next.js App Router
│   ├── src/
│   │   ├── components/       # React 组件
│   │   ├── lib/              # 工具函数和 API 客户端
│   │   └── stores/           # Zustand 状态管理
│   └── package.json
│
├── backend/                  # Spring Boot 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/elasticquest/backend/
│   │   │   │       ├── config/        # 配置类
│   │   │   │       ├── controller/    # REST 控制器
│   │   │   │       ├── service/       # 业务逻辑层
│   │   │   │       └── model/         # 数据模型
│   │   │   └── resources/
│   │   │       └── application.yml    # 配置文件
│   │   └── test/             # 测试代码
│   └── pom.xml
│
└── DESIGN.md                 # 详细设计文档
```

## 🛠️ 开发环境设置

### 前置要求

- **Node.js** 18+ 和 npm
- **Java** 17+
- **Maven** 3.6+
- **Elasticsearch** 7.x 或 8.x（可选，用于测试）

### 前端开发

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 创建环境变量文件（可选）：
```bash
# 创建 .env.local 文件
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

4. 启动开发服务器：
```bash
npm run dev
```

前端将在 http://localhost:3000 启动

### 后端开发

1. 进入后端目录：
```bash
cd backend
```

2. 配置环境变量（重要）：
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入你的模力方舟 API 密钥
# LLM_API_KEY=your-actual-api-key-here
```

3. 使用 Maven 安装依赖：
```bash
mvn clean install
```

4. 运行应用：
```bash
mvn spring-boot:run
```

或者使用 IDE 直接运行 `ElasticQuestApplication.java`

后端将在 http://localhost:8080 启动

API 文档（Swagger）可在 http://localhost:8080/swagger-ui.html 访问

## 📖 功能特性

### 已实现
- ✅ 项目基础架构搭建
- ✅ Next.js SSR 前端框架
- ✅ Spring Boot 后端 API 框架
- ✅ CORS 配置
- ✅ 基础状态管理（Zustand）
- ✅ ES 连接配置管理（前端）
- ✅ **RAG 智能问答功能**（结合模力方舟 LLM）
  - 流式对话响应
  - 智能高亮引用内容
  - 中文分词优化（HanLP）
  - 自定义提示词和参数
- ✅ **ES认证工程师考试学习系统** 🎓
  - 8大知识分类，20+知识点
  - 4个递进式闯关关卡
  - 12+挑战题目（单选、多选、实践题）
  - 3套完整模拟考试
  - 游戏化学习（经验值、等级、成就、称号）
  - 学习进度追踪和统计分析

### 开发中
- 🔄 ES CRUD 操作 API
- 🔄 查询构建器
- 🔄 结果可视化
- 🔄 更多考试题目和知识点

## 🎯 核心功能

### 1. ES 数据库配置管理
- 支持任意 ES 实例配置（本地、远程、云服务）
- 多环境支持（开发、测试、生产）
- 连接验证功能

### 2. ES认证工程师考试学习系统 🎓
- **知识点学习**：8大分类（安装配置、索引管理、搜索查询、聚合分析、映射分析器、集群管理、性能优化、安全配置）
- **闯关地图**：4个递进式关卡，从新手到认证工程师
- **挑战系统**：多种题型（单选、多选、实践题、代码补全）
- **模拟考试**：完整的认证考试模拟体验
- **游戏化元素**：经验值、等级、成就徽章、称号系统
- **进度追踪**：学习时长、成功率、强弱项分析

### 3. 游戏化学习系统
- 分阶段任务系统
- 成就徽章系统
- 等级和经验值系统
- 进度追踪

### 4. CRUD 操作教学
- Create（创建）：学习如何索引文档
- Read（查询）：学习各种查询语法
- Update（更新）：学习文档更新操作
- Delete（删除）：学习删除操作

### 5. 可视化界面
- 查询构建器（拖拽式）
- 结果可视化（图表、表格）
- 代码编辑器（语法高亮）
- 实时反馈

## 📚 API 文档

后端 API 文档可通过 Swagger UI 访问：
- 开发环境：http://localhost:8080/swagger-ui.html
- API 定义：http://localhost:8080/api-docs

## 🧪 测试

### 前端测试
```bash
cd frontend
npm test
```

### 后端测试
```bash
cd backend
mvn test
```

## 📝 开发规范

- **代码风格**：使用 ESLint 和 Prettier（前端），遵循 Java 编码规范（后端）
- **提交信息**：使用清晰的提交信息，遵循 Conventional Commits
- **分支策略**：main 分支用于生产，develop 分支用于开发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 [LICENSE](LICENSE) 许可证。

## 📧 联系方式

如有问题或建议，请提交 Issue。

---

**Happy Coding! 🎮🚀**
