import { apiClient } from './client';
import { ESConnectionConfig } from '@/stores/useAppStore';

export interface ESExecutionResult {
  success: boolean;
  message: string;
  statusCode?: number;
  responseBody?: string;
  error?: string;
}

/**
 * 执行 ES 命令
 */
export async function executeESCommand(
  command: string,
  connection: ESConnectionConfig
): Promise<ESExecutionResult> {
  try {
    const response = await apiClient.post<ESExecutionResult>('/es-execution/execute', {
      command,
      connection,
    });
    return response.data;
  } catch (error: any) {
    console.error('执行 ES 命令失败:', error);
    return {
      success: false,
      message: '执行失败',
      error: error.response?.data?.message || error.message || '未知错误',
    };
  }
}

