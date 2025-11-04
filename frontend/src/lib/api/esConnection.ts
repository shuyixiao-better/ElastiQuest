import { apiClient } from './client';
import { ESConnectionConfig } from '@/stores/useAppStore';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  clusterName?: string;
  version?: string;
  error?: string;
}

/**
 * 测试 ES 连接
 */
export async function testESConnection(config: ESConnectionConfig): Promise<ConnectionTestResult> {
  try {
    const response = await apiClient.post<ConnectionTestResult>('/es-connection/test', config);
    return response.data;
  } catch (error: any) {
    console.error('测试 ES 连接失败:', error);
    return {
      success: false,
      message: '连接失败',
      error: error.response?.data?.message || error.message || '未知错误',
    };
  }
}

/**
 * 检查 ES 连接服务健康状态
 */
export async function checkESConnectionHealth(): Promise<boolean> {
  try {
    const response = await apiClient.get('/es-connection/health');
    return response.status === 200;
  } catch (error) {
    console.error('检查 ES 连接服务健康状态失败:', error);
    return false;
  }
}

