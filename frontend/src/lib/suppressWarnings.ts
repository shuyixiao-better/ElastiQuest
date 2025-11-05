/**
 * 抑制控制台警告配置
 * 用于过滤已知的、不影响功能的第三方库警告
 */

// 需要抑制的警告关键词列表
const SUPPRESSED_WARNINGS = [
  '[antd: compatible]', // Ant Design React 19 兼容性警告
  '[antd: Spin]',       // Ant Design Spin tip 警告（如果已修复可以移除）
  '[antd: message]',    // Ant Design message 静态方法警告（如果已修复可以移除）
];

/**
 * 检查消息是否应该被抑制
 */
function shouldSuppressWarning(message: string): boolean {
  return SUPPRESSED_WARNINGS.some(keyword => message.includes(keyword));
}

/**
 * 初始化警告抑制
 * 在应用启动时调用一次
 */
export function initWarningSuppress() {
  if (typeof window === 'undefined') {
    return; // 只在浏览器环境中运行
  }

  // 保存原始的 console 方法
  const originalError = console.error;
  const originalWarn = console.warn;

  // 重写 console.error
  console.error = (...args: any[]) => {
    const message = args[0];
    if (typeof message === 'string' && shouldSuppressWarning(message)) {
      return; // 忽略这个警告
    }
    originalError.apply(console, args);
  };

  // 重写 console.warn
  console.warn = (...args: any[]) => {
    const message = args[0];
    if (typeof message === 'string' && shouldSuppressWarning(message)) {
      return; // 忽略这个警告
    }
    originalWarn.apply(console, args);
  };

  // 开发环境下输出提示
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '%c[ElastiQuest] 警告抑制已启用',
      'color: #1890ff; font-weight: bold;'
    );
    console.log(
      '%c已抑制的警告:',
      'color: #52c41a;',
      SUPPRESSED_WARNINGS
    );
  }
}

/**
 * 添加新的警告关键词到抑制列表
 */
export function addSuppressedWarning(keyword: string) {
  if (!SUPPRESSED_WARNINGS.includes(keyword)) {
    SUPPRESSED_WARNINGS.push(keyword);
    console.log(
      `%c[ElastiQuest] 已添加警告抑制: ${keyword}`,
      'color: #faad14;'
    );
  }
}

/**
 * 移除警告关键词
 */
export function removeSuppressedWarning(keyword: string) {
  const index = SUPPRESSED_WARNINGS.indexOf(keyword);
  if (index > -1) {
    SUPPRESSED_WARNINGS.splice(index, 1);
    console.log(
      `%c[ElastiQuest] 已移除警告抑制: ${keyword}`,
      'color: #faad14;'
    );
  }
}

/**
 * 获取当前抑制的警告列表
 */
export function getSuppressedWarnings(): string[] {
  return [...SUPPRESSED_WARNINGS];
}

