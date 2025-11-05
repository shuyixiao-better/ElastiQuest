# API 地址智能解析说明

## 🎯 问题背景

在使用局域网 IP 访问前端时（例如 `http://10.10.0.153:3000`），如果后端 API 地址硬编码为 `http://localhost:8080`，会导致 CORS 错误：

```
Access to fetch at 'http://localhost:8080/api/...' from origin 'http://10.10.0.153:3000' 
has been blocked by CORS policy
```

## ✅ 解决方案

实现了智能 API 地址解析系统，根据前端访问地址自动推断后端地址。

### 核心原理

```
前端访问地址                    →  后端 API 地址
http://localhost:3000          →  http://localhost:8080/api
http://127.0.0.1:3000          →  http://127.0.0.1:8080/api
http://10.10.0.153:3000        →  http://10.10.0.153:8080/api
http://192.168.1.100:3000      →  http://192.168.1.100:8080/api
```

**规则**: 使用与前端相同的 hostname 和 protocol，端口固定为 8080

## 📁 实现文件

### 1. `src/lib/api/config.ts` - 核心配置模块

```typescript
/**
 * 获取后端 API 基础 URL
 * 根据当前访问的前端地址，自动推断后端地址
 */
export function getApiBaseUrl(): string {
  // 1. 优先使用环境变量配置
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // 2. 服务端渲染时使用默认地址
  if (typeof window === 'undefined') {
    return 'http://localhost:8080/api';
  }

  // 3. 客户端：根据当前访问地址智能推断
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const backendPort = 8080;

  const apiBaseUrl = `${protocol}//${hostname}:${backendPort}/api`;

  console.log(`[API Config] 前端地址: ${window.location.origin}`);
  console.log(`[API Config] 后端地址: ${apiBaseUrl}`);

  return apiBaseUrl;
}

/**
 * 获取完整的 API URL
 */
export function getApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
```

### 2. `src/lib/api/client.ts` - Axios 客户端

```typescript
import axios from 'axios';
import { getApiBaseUrl } from './config';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),  // 使用智能解析
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 3. `src/lib/api/ragChat.ts` - RAG 聊天 API

```typescript
import { getApiUrl } from './config';

export async function streamRAGChat(...) {
  const response = await fetch(getApiUrl('/rag-chat/stream'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}
```

## 🎨 使用方式

### 方式一：使用 `getApiBaseUrl()`（推荐用于 axios）

```typescript
import { getApiBaseUrl } from '@/lib/api/config';

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
});
```

### 方式二：使用 `getApiUrl()`（推荐用于 fetch）

```typescript
import { getApiUrl } from '@/lib/api/config';

const response = await fetch(getApiUrl('/rag-chat/stream'), {
  method: 'POST',
  body: JSON.stringify(data),
});
```

### 方式三：使用现有的 `apiClient`

```typescript
import { apiClient } from '@/lib/api/client';

const response = await apiClient.get('/health');
const response = await apiClient.post('/es-execution/execute', data);
```

## 🔧 配置优先级

1. **环境变量** (最高优先级)
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://custom-backend:8080/api
   ```

2. **智能推断** (默认)
   - 客户端：根据 `window.location` 推断
   - 服务端：使用 `http://localhost:8080/api`

## 🌐 支持的场景

### 场景 1: 本地开发
```
前端: http://localhost:3000
后端: http://localhost:8080/api
✅ 自动匹配
```

### 场景 2: 局域网访问（以太网）
```
前端: http://10.10.0.153:3000
后端: http://10.10.0.153:8080/api
✅ 自动匹配
```

### 场景 3: 局域网访问（WiFi）
```
前端: http://192.168.1.100:3000
后端: http://192.168.1.100:8080/api
✅ 自动匹配
```

### 场景 4: 手机访问
```
前端: http://10.10.0.153:3000 (手机浏览器)
后端: http://10.10.0.153:8080/api
✅ 自动匹配
```

### 场景 5: 自定义后端地址
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.200:8080/api
```

## 🐛 调试

### 查看当前 API 地址

打开浏览器控制台，会看到：
```
[API Config] 前端地址: http://10.10.0.153:3000
[API Config] 后端地址: http://10.10.0.153:8080/api
```

### 手动测试

在浏览器控制台执行：
```javascript
// 查看当前 API 基础地址
console.log(window.location.hostname);
console.log(`${window.location.protocol}//${window.location.hostname}:8080/api`);
```

## ✨ 优势

1. **零配置** - 无需手动配置，自动适配
2. **灵活性** - 支持环境变量覆盖
3. **兼容性** - 支持所有访问方式
4. **调试友好** - 控制台输出当前配置
5. **类型安全** - TypeScript 支持

## 📝 注意事项

### 1. 后端端口固定为 8080

如果后端使用其他端口，需要修改 `config.ts`:
```typescript
const backendPort = 9000; // 修改为你的端口
```

### 2. 服务端渲染 (SSR)

服务端渲染时无法访问 `window.location`，会使用默认地址 `http://localhost:8080/api`。

如果需要在 SSR 中使用不同地址，请设置环境变量：
```bash
NEXT_PUBLIC_API_BASE_URL=http://your-backend:8080/api
```

### 3. HTTPS 支持

如果前端使用 HTTPS，后端也会自动使用 HTTPS：
```
前端: https://example.com:3000
后端: https://example.com:8080/api
```

### 4. 生产环境

生产环境建议使用环境变量明确指定后端地址：
```bash
# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
```

## 🔄 迁移指南

### 从硬编码迁移

**旧代码**:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
const response = await fetch(`${API_BASE_URL}/endpoint`, ...);
```

**新代码**:
```typescript
import { getApiUrl } from '@/lib/api/config';
const response = await fetch(getApiUrl('/endpoint'), ...);
```

### 从 axios 迁移

**旧代码**:
```typescript
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});
```

**新代码**:
```typescript
import { getApiBaseUrl } from '@/lib/api/config';
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
});
```

## 🎯 测试清单

- [ ] localhost 访问正常
- [ ] 局域网 IP 访问正常
- [ ] 手机访问正常
- [ ] RAG 功能正常
- [ ] 其他 API 调用正常
- [ ] 控制台无 CORS 错误
- [ ] 控制台显示正确的 API 地址

## 💡 最佳实践

1. **开发环境**: 使用智能推断（默认）
2. **测试环境**: 使用环境变量指定
3. **生产环境**: 使用环境变量指定
4. **调试时**: 查看控制台输出确认地址

## 📚 相关文档

- [跨域配置说明.md](../跨域配置说明.md)
- [启动说明.md](../启动说明.md)

