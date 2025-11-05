const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

export interface StreamChatChunk {
  content: string;
  done: boolean;
  highlights?: HighlightSegment[];
  error?: string;
}

export interface RAGChatRequest {
  question: string;
  contextMaterial?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * 流式 RAG 聊天
 * @param request 聊天请求
 * @param onChunk 接收每个内容块的回调
 * @param onComplete 完成时的回调，返回高亮信息
 * @param onError 错误回调
 */
export async function streamRAGChat(
  request: RAGChatRequest,
  onChunk: (content: string) => void,
  onComplete: (highlights: HighlightSegment[]) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/rag-chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // 解码数据
      buffer += decoder.decode(value, { stream: true });

      // 处理 SSE 消息
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留不完整的行

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.substring(5).trim();

          try {
            const chunk: StreamChatChunk = JSON.parse(data);

            if (chunk.error) {
              onError(chunk.error);
              return;
            }

            if (chunk.done) {
              // 完成，返回高亮信息
              onComplete(chunk.highlights || []);
              return;
            }

            if (chunk.content) {
              // 发送内容块
              onChunk(chunk.content);
            }
          } catch (e) {
            console.warn('解析 SSE 数据失败:', data, e);
          }
        }
      }
    }
  } catch (error: any) {
    console.error('RAG 聊天失败:', error);
    onError(error.message || '未知错误');
  }
}

