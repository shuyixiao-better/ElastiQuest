# ElastiQuest 设计文档

## 📖 项目概述

### 项目简介
ElastiQuest 是一个以游戏化方式学习 Elasticsearch 基础 CRUD 操作的互动平台。通过可视化界面与趣味任务，开发者可以在"打怪升级"中轻松掌握文档的创建、查询、更新与删除操作，让枯燥的语法学习变成一场充满成就感的技术冒险！

**英文版本：** ElastiQuest is an interactive, game-inspired learning platform that teaches developers the fundamentals of Elasticsearch CRUD operations through engaging visual interfaces and playful challenges. Turn querying, indexing, updating, and deleting documents into a fun adventure—level up your search skills while having fun!

### 核心目标
1. **降低学习门槛**：通过可视化界面，让 ES 学习变得直观易懂
2. **游戏化体验**：通过任务、成就、等级系统激发学习动力
3. **实践导向**：提供真实的 ES 环境，让开发者边学边练
4. **灵活配置**：支持任意配置 ES 数据库连接，适应不同环境

---

## 🎯 核心功能需求

### 1. ES 数据库配置管理
- **可配置连接**：支持任意 ES 实例配置（本地、远程、云服务）
- **多环境支持**：支持开发、测试、生产环境切换
- **连接验证**：实时检测 ES 连接状态
- **安全存储**：加密存储连接信息（可选）

### 2. 游戏化学习系统
- **任务系统**：分阶段的 CRUD 操作任务
- **成就系统**：完成特定操作解锁成就徽章
- **等级系统**：根据完成度提升等级
- **进度追踪**：可视化学习进度

### 3. CRUD 操作教学
- **Create（创建）**：学习如何索引文档
- **Read（查询）**：学习各种查询语法
- **Update（更新）**：学习文档更新操作
- **Delete（删除）**：学习删除操作

### 4. 可视化界面
- **查询构建器**：拖拽式查询构建工具
- **结果可视化**：图表、表格展示查询结果
- **语法高亮**：代码编辑器支持 ES 语法高亮
- **实时反馈**：操作结果即时反馈

---

## 🛠 技术栈选择

### 前端技术栈

#### 核心框架
- **Next.js 14+**：支持服务端渲染（SSR）的 React 框架
- **React 18+**：现代化 UI 框架，组件化开发
- **TypeScript**：类型安全，提升代码质量
- **App Router**：Next.js 14 的现代化路由系统

#### UI 框架
- **Ant Design 5.x**：成熟的组件库，提供丰富的 UI 组件
- **Tailwind CSS**：实用优先的 CSS 框架，快速定制样式

#### 状态管理
- **Zustand**：轻量级状态管理，适合 SSR 场景
- **React Context**：用于服务端/客户端状态同步

#### 数据可视化
- **ECharts** 或 **Recharts**：图表展示 ES 查询结果
- **D3.js**：高级数据可视化（可选）

#### 代码编辑器
- **Monaco Editor**：VS Code 同款编辑器，支持语法高亮和自动补全
- 注意：需要在客户端组件中使用

#### HTTP 客户端
- **Axios**：处理 API 请求
- **Next.js fetch**：服务端数据获取

#### 动画库
- **Framer Motion**：流畅的动画效果，增强游戏化体验

### 后端技术栈

#### 核心框架
- **Spring Boot 3.5.x**：企业级 Java 后端框架
- **Java 17+**：LTS 版本，长期支持

#### ES 客户端
- **Elasticsearch Java High Level REST Client** 或 **Elasticsearch Java API Client**
- 官方推荐的 Java 客户端

#### Web 框架
- **Spring Web**：RESTful API 开发
- **Spring Security**：安全认证和授权（可选）

#### 数据存储
- **Spring Data JPA**（可选）：如果需要存储用户数据
- **Redis**（可选）：缓存和会话管理

#### API 文档
- **SpringDoc OpenAPI**：自动生成 API 文档（Swagger）

### 开发工具链

#### 前端
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Husky**：Git hooks 管理
- **Jest**：单元测试框架
- **Playwright**：E2E 测试

#### 后端
- **Maven** 或 **Gradle**：构建工具
- **JUnit 5**：单元测试
- **Mockito**：Mock 框架
- **Lombok**：减少样板代码（可选）

---

## 🏗 系统架构设计

### 整体架构

```
┌─────────────────────────────────────────────────┐
│        前端应用 (Next.js SSR)                    │
├─────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  UI层    │  │ 业务逻辑层│  │ 数据层   │     │
│  │          │  │          │  │          │     │
│  │ 组件、页面│→ │ 状态管理 │→ │ API调用  │     │
│  │ (SSR)    │  │ (Zustand)│  │ (Axios)  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │   后端 API             │
        │   Spring Boot 3.5.x   │
        │   RESTful API         │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │   Elasticsearch       │
        │   (可配置连接)         │
        └───────────────────────┘
```

### 模块划分

#### 1. 配置管理模块
```
config/
  ├── es-config.ts          # ES 配置管理
  ├── connection-validator.ts # 连接验证
  └── storage.ts            # 配置存储
```

#### 2. 游戏化模块
```
gamification/
  ├── task-system.ts        # 任务系统
  ├── achievement-system.ts # 成就系统
  ├── level-system.ts       # 等级系统
  └── progress-tracker.ts   # 进度追踪
```

#### 3. CRUD 操作模块
```
operations/
  ├── create.ts             # 创建操作
  ├── read.ts               # 查询操作
  ├── update.ts             # 更新操作
  └── delete.ts             # 删除操作
```

#### 4. UI 组件模块
```
components/
  ├── QueryBuilder/         # 查询构建器
  ├── ResultVisualizer/     # 结果可视化
  ├── CodeEditor/           # 代码编辑器
  ├── TaskPanel/            # 任务面板
  ├── AchievementPanel/     # 成就面板
  └── ConfigPanel/          # 配置面板
```

---

## 🗄 ES 数据库配置方案

### 配置结构设计

```typescript
interface ESConnectionConfig {
  // 基础连接信息
  name: string;              // 配置名称
  host: string;              // ES 地址 (e.g., http://localhost:9200)
  username?: string;         // 用户名（可选）
  password?: string;         // 密码（可选）
  apiKey?: string;           // API Key（可选）
  
  // 高级选项
  cloudId?: string;          // Elastic Cloud ID
  requestHeaders?: Record<string, string>; // 自定义请求头
  
  // 连接选项
  timeout?: number;          // 超时时间（毫秒）
  maxRetries?: number;       // 最大重试次数
  ssl?: {
    rejectUnauthorized?: boolean;
    ca?: string;             // CA 证书
  };
  
  // 元数据
  environment: 'development' | 'test' | 'production';
  createdAt: string;
  lastUsed?: string;
}
```

### 配置存储方案

#### 方案一：浏览器本地存储
- **localStorage**：存储配置列表
- **优点**：简单，无需后端
- **缺点**：仅限当前浏览器，无法跨设备

#### 方案二：加密存储
- 使用 **crypto-js** 加密敏感信息
- 存储加密后的配置到 localStorage
- **优点**：增强安全性
- **缺点**：前端加密，安全级别有限

#### 方案三：后端存储（可选）
- 用户登录后，配置存储在服务器
- **优点**：跨设备同步，更高安全性
- **缺点**：需要用户系统，复杂度高

### 连接验证流程

```typescript
async function validateConnection(config: ESConnectionConfig): Promise<ValidationResult> {
  try {
    // 1. 测试基础连接
    const healthCheck = await fetch(`${config.host}/_cluster/health`, {
      method: 'GET',
      headers: getAuthHeaders(config)
    });
    
    // 2. 验证集群信息
    const clusterInfo = await fetch(`${config.host}/`, {
      headers: getAuthHeaders(config)
    });
    
    // 3. 检查版本兼容性
    const version = clusterInfo.version.number;
    
    return {
      success: true,
      clusterName: clusterInfo.cluster_name,
      version: version,
      message: '连接成功'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

### 多环境管理

```typescript
interface EnvironmentManager {
  // 环境列表
  environments: ESConnectionConfig[];
  
  // 当前激活环境
  activeEnvironment: string;
  
  // 切换环境
  switchEnvironment(name: string): void;
  
  // 添加环境
  addEnvironment(config: ESConnectionConfig): void;
  
  // 删除环境
  removeEnvironment(name: string): void;
}
```

---

## 🎨 UI/UX 设计思路

### 整体布局

```
┌─────────────────────────────────────────────────────┐
│  Header: Logo + 导航 + 配置切换 + 用户信息          │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  侧边栏      │          主内容区                      │
│              │                                       │
│  - 任务列表  │  - 查询构建器                          │
│  - 成就      │  - 代码编辑器                          │
│  - 进度      │  - 结果可视化                          │
│  - 配置      │                                       │
│              │                                       │
└──────────────┴───────────────────────────────────────┘
```

### 核心页面设计

#### 1. 首页/仪表板
- 欢迎信息
- 当前等级和进度条
- 最近完成的任务
- 成就展示
- 快速开始按钮

#### 2. 任务页面
- 任务列表（按难度分类）
- 任务详情（描述、要求、提示）
- 任务编辑器（代码编辑区）
- 执行按钮和结果展示

#### 3. 查询构建器页面
- 可视化查询构建器（拖拽式）
- 生成的查询代码预览
- 执行查询按钮
- 结果可视化（表格、图表）

#### 4. 配置页面
- 连接配置表单
- 配置列表（支持多配置）
- 连接测试按钮
- 配置导入/导出功能

### 游戏化元素设计

#### 视觉设计
- **主题色彩**：科技感配色（蓝色、紫色、渐变）
- **图标系统**：使用游戏化图标（徽章、奖杯、等级）
- **动画效果**：完成任务时的庆祝动画
- **进度可视化**：进度条、经验值条

#### 反馈机制
- **即时反馈**：操作成功/失败的即时提示
- **成就弹窗**：解锁成就时的动画弹窗
- **音效**（可选）：完成任务时的音效反馈

---

## 🎮 游戏化机制设计

### 任务系统

#### 任务分类
1. **新手村**（Level 1-5）
   - 基础连接测试
   - 简单文档创建
   - 基础查询

2. **初级挑战**（Level 6-10）
   - 批量创建文档
   - 条件查询
   - 文档更新

3. **中级挑战**（Level 11-15）
   - 复杂查询（聚合、过滤）
   - 文档删除
   - 索引管理

4. **高级挑战**（Level 16+）
   - 性能优化
   - 高级聚合
   - 自定义分析器

#### 任务结构
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'create' | 'read' | 'update' | 'delete';
  requirements: string[];      // 任务要求
  hints: string[];             // 提示
  solution: string;            // 解决方案（代码）
  experiencePoints: number;    // 经验值奖励
  validationFunction: (result: any) => boolean; // 验证函数
}
```

### 成就系统

#### 成就类型
- **里程碑成就**：完成特定数量的任务
- **技能成就**：掌握特定操作类型
- **效率成就**：在规定时间内完成任务
- **探索成就**：尝试不同的查询方式

#### 成就示例
```typescript
const achievements = [
  {
    id: 'first_create',
    name: '第一次创建',
    description: '创建第一个文档',
    icon: '📝',
    rarity: 'common'
  },
  {
    id: 'query_master',
    name: '查询大师',
    description: '完成 50 个查询任务',
    icon: '🔍',
    rarity: 'rare'
  },
  {
    id: 'speed_demon',
    name: '速度恶魔',
    description: '在 30 秒内完成简单任务',
    icon: '⚡',
    rarity: 'epic'
  }
];
```

### 等级系统

#### 经验值计算
```typescript
interface LevelSystem {
  // 等级计算公式
  calculateLevel(totalXP: number): number;
  
  // 经验值需求
  getXPForLevel(level: number): number;
  
  // 当前等级进度
  getLevelProgress(totalXP: number): {
    currentLevel: number;
    currentXP: number;
    nextLevelXP: number;
    progress: number; // 0-1
  };
}
```

#### 等级奖励
- 解锁新任务
- 解锁高级功能
- 特殊称号
- 自定义主题

---

## 📊 数据流设计

### ES 操作流程

```
用户操作
  ↓
UI 组件触发
  ↓
业务逻辑层处理
  ↓
API 调用层
  ↓
ES REST API / 后端代理
  ↓
Elasticsearch
  ↓
返回结果
  ↓
结果处理与验证
  ↓
更新游戏化状态（经验、成就等）
  ↓
UI 更新（结果展示、进度更新）
```

### 状态管理设计

```typescript
interface AppState {
  // ES 配置
  esConfig: {
    connections: ESConnectionConfig[];
    activeConnection: string | null;
  };
  
  // 游戏化状态
  gamification: {
    level: number;
    experience: number;
    completedTasks: string[];
    achievements: string[];
    progress: Record<string, number>;
  };
  
  // 当前操作
  currentOperation: {
    type: 'create' | 'read' | 'update' | 'delete' | null;
    query: string;
    result: any;
    loading: boolean;
    error: string | null;
  };
  
  // UI 状态
  ui: {
    sidebarOpen: boolean;
    currentView: string;
    theme: 'light' | 'dark';
  };
}
```

---

## 🔒 安全性考虑

### 前端安全
1. **敏感信息处理**
   - 密码/API Key 不在 URL 中暴露
   - 使用环境变量存储默认配置
   - 支持配置加密存储

2. **输入验证**
   - 验证 ES 查询语法
   - 防止恶意查询（如删除操作需要确认）
   - 限制查询复杂度（可选）

3. **CORS 处理**
   - 如果使用纯前端方案，需要 ES 服务器配置 CORS
   - 或使用后端代理解决 CORS 问题

### 后端安全（如果使用）
1. **认证授权**
   - API Key 验证
   - 用户权限控制

2. **请求限制**
   - 频率限制
   - 查询复杂度限制

3. **数据验证**
   - 输入验证和清理
   - SQL 注入防护（虽然 ES 不是 SQL，但需要防止恶意查询）

---

## 📱 响应式设计

### 断点设计
- **移动端**：< 768px
- **平板**：768px - 1024px
- **桌面**：> 1024px

### 适配策略
- 侧边栏在移动端转为抽屉式菜单
- 查询构建器在移动端简化为表单模式
- 结果可视化在移动端优化为卡片式布局

---

## 🚀 开发计划

### 阶段一：基础搭建（1-2 周）
- [ ] 项目初始化（React + TypeScript + Vite）
- [ ] UI 框架集成（Ant Design / MUI）
- [ ] 路由配置
- [ ] 基础布局组件

### 阶段二：ES 配置管理（1 周）
- [ ] 配置表单组件
- [ ] 连接验证功能
- [ ] 配置存储（localStorage）
- [ ] 多环境管理

### 阶段三：基础 CRUD 操作（2 周）
- [ ] Create 操作实现
- [ ] Read 操作实现
- [ ] Update 操作实现
- [ ] Delete 操作实现
- [ ] 错误处理

### 阶段四：游戏化系统（2 周）
- [ ] 任务系统
- [ ] 成就系统
- [ ] 等级系统
- [ ] 进度追踪

### 阶段五：可视化界面（2 周）
- [ ] 查询构建器
- [ ] 结果可视化
- [ ] 代码编辑器集成
- [ ] 动画效果

### 阶段六：优化与测试（1-2 周）
- [ ] 性能优化
- [ ] 单元测试
- [ ] E2E 测试
- [ ] 文档完善

---

## 📝 技术难点与解决方案

### 难点 1：ES 查询语法复杂性
**解决方案**：
- 提供可视化查询构建器
- 支持常用查询模板
- 提供语法提示和自动补全

### 难点 2：CORS 跨域问题
**解决方案**：
- 方案一：配置 ES 服务器 CORS
- 方案二：使用后端代理
- 方案三：浏览器扩展（可选）

### 难点 3：游戏化平衡性
**解决方案**：
- 根据用户反馈调整经验值和难度
- A/B 测试不同奖励机制
- 收集用户行为数据优化

### 难点 4：多环境配置管理
**解决方案**：
- 清晰的配置界面
- 配置导入/导出功能
- 配置模板功能

---

## 🎯 未来扩展方向

1. **社区功能**
   - 分享查询模板
   - 用户排行榜
   - 讨论区

2. **高级功能**
   - ES 集群监控
   - 性能分析工具
   - 自定义分析器测试

3. **多语言支持**
   - 国际化（i18n）
   - 中英文切换

4. **移动端应用**
   - React Native 版本
   - 移动端优化

5. **集成其他数据库**
   - 扩展到 MongoDB、PostgreSQL 等

---

## 📚 参考资料

- [Elasticsearch 官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Elasticsearch REST API](https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html)
- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

---

## 📄 总结

ElastiQuest 旨在通过游戏化、可视化的方式，让 Elasticsearch 的学习变得有趣且高效。通过灵活的配置管理和直观的界面设计，开发者可以轻松上手 ES 的 CRUD 操作，在完成任务的过程中逐步提升技能水平。

本项目采用现代化的前端技术栈，注重用户体验和代码质量，为开发者提供一个优秀的学习平台。

---

**文档版本**：v1.0  
**最后更新**：2024年  
**维护者**：ElastiQuest Team
