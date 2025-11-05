/**
 * API 配置
 * 智能解析后端 API 地址，支持 localhost 和局域网 IP 访问
 */

/**
 * 获取后端 API 基础 URL
 * 根据当前访问的前端地址，自动推断后端地址
 */
export function getApiBaseUrl(): string {
  // 优先使用环境变量配置
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // 服务端渲染时使用默认地址
  if (typeof window === 'undefined') {
    return 'http://localhost:8080/api';
  }

  // 客户端：根据当前访问地址智能推断
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // 后端端口固定为 8080
  const backendPort = 8080;

  // 构建后端 URL
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
  // 确保 path 以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

