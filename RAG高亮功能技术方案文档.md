# RAG 智能高亮功能技术方案文档

## 📋 目录

1. [功能概述](#功能概述)
2. [技术架构](#技术架构)
3. [后端实现](#后端实现)
4. [前端实现](#前端实现)
5. [核心算法](#核心算法)
6. [数据流程](#数据流程)
7. [性能优化](#性能优化)
8. [问题与挑战](#问题与挑战)

---

## 功能概述

### 业务需求

在 RAG（Retrieval-Augmented Generation）问答系统中，用户提供：
1. **问题** - 用户想要询问的内容
2. **参考资料** - 补充的上下文材料

系统需要：
1. 将问题和参考资料发送给大模型
2. 大模型结合自身知识和参考资料生成回答
3. **智能识别并高亮**回答中直接引用参考资料的部分

### 核心挑战

- 大模型可能会改写参考资料的内容
- 需要识别语义相似但表述不同的文本
- 中文分词和匹配的准确性
- 流式响应中的实时高亮

### 技术选型

| 技术 | 用途 | 版本 |
|------|------|------|
| HanLP | 中文分词 | portable-1.8.4 |
| Apache Lucene | 文本分析和高亮 | 9.8.0 |
| Spring Boot | 后端框架 | 3.5.7 |
| React | 前端框架 | 19.2.0 |
| TypeScript | 类型安全 | 5.x |

---

## 技术架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         前端 (React)                         │
├─────────────────────────────────────────────────────────────┤
│  RAGChatPanel.tsx                                           │
│  ├─ 问题输入框                                               │
│  ├─ 参考资料输入框                                           │
│  ├─ 流式回答显示                                             │
│  └─ HighlightedText.tsx (高亮渲染组件)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓ SSE (Server-Sent Events)
┌─────────────────────────────────────────────────────────────┐
│                      后端 (Spring Boot)                      │
├─────────────────────────────────────────────────────────────┤
│  RAGChatController.java                                     │
│  ├─ 接收请求                                                 │
│  ├─ 调用 LLMChatService (流式对话)                          │
│  └─ 调用 TextHighlightService (高亮分析)                    │
├─────────────────────────────────────────────────────────────┤
│  LLMChatService.java                                        │
│  ├─ 构建提示词                                               │
│  ├─ 调用模力方舟 API                                         │
│  └─ 解析 SSE 流式响应                                        │
├─────────────────────────────────────────────────────────────┤
│  TextHighlightService.java                                  │
│  ├─ HanLP 中文分词                                          │
│  ├─ 提取关键短语                                             │
│  ├─ 滑动窗口匹配                                             │
│  └─ 生成高亮片段                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   模力方舟 LLM API                           │
│                 (Qwen3-235B-A22B-Instruct)                  │
└─────────────────────────────────────────────────────────────┘
```

### 数据模型

```java
// 请求模型
public class RAGChatRequest {
    private String question;           // 用户问题
    private String contextMaterial;    // 参考资料
    private String systemPrompt;       // 系统提示词
    private Double temperature;        // 温度参数
    private Integer maxTokens;         // 最大 tokens
}

// 响应模型
public class StreamChatChunk {
    private String content;                    // 内容块
    private Boolean done;                      // 是否完成
    private List<HighlightSegment> highlights; // 高亮片段
    private String error;                      // 错误信息
}

// 高亮片段
public class HighlightSegment {
    private String text;        // 文本内容
    private Boolean highlighted; // 是否高亮
}
```

---

## 后端实现

### 1. 控制器层 (RAGChatController.java)

**职责**: 处理 HTTP 请求，管理 SSE 连接

```java
@PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter streamChat(@RequestBody @Valid RAGChatRequest request) {
    SseEmitter emitter = new SseEmitter(120000L); // 2分钟超时
    
    executorService.execute(() -> {
        try {
            // 1. 流式调用 LLM
            llmChatService.streamChat(
                request,
                // onChunk: 发送内容块
                (content) -> {
                    StreamChatChunk chunk = new StreamChatChunk();
                    chunk.setContent(content);
                    chunk.setDone(false);
                    emitter.send(SseEmitter.event()
                        .name("message")
                        .data(chunk));
                },
                // onComplete: 生成高亮并发送
                (fullAnswer) -> {
                    List<HighlightSegment> highlights = 
                        textHighlightService.highlightText(
                            fullAnswer, 
                            request.getContextMaterial()
                        );
                    
                    StreamChatChunk doneChunk = new StreamChatChunk();
                    doneChunk.setDone(true);
                    doneChunk.setHighlights(highlights);
                    emitter.send(SseEmitter.event()
                        .name("done")
                        .data(doneChunk));
                    emitter.complete();
                },
                // onError: 发送错误
                (error) -> {
                    StreamChatChunk errorChunk = new StreamChatChunk();
                    errorChunk.setError(error);
                    emitter.send(SseEmitter.event()
                        .name("error")
                        .data(errorChunk));
                    emitter.completeWithError(new RuntimeException(error));
                }
            );
        } catch (Exception e) {
            emitter.completeWithError(e);
        }
    });
    
    return emitter;
}
```

**关键点**:
- 使用 `SseEmitter` 实现服务器推送
- 异步执行避免阻塞
- 三个回调处理不同阶段

### 2. LLM 服务层 (LLMChatService.java)

**职责**: 调用模力方舟 API，处理流式响应

```java
public void streamChat(
    RAGChatRequest request,
    Consumer<String> onChunk,
    Consumer<String> onComplete,
    Consumer<String> onError
) {
    // 1. 构建消息数组
    List<Map<String, Object>> messages = new ArrayList<>();
    
    // 系统提示词
    messages.add(Map.of(
        "role", "system",
        "content", request.getSystemPrompt()
    ));
    
    // 用户消息（包含问题和参考资料）
    String userContent = String.format(
        "问题：%s\n\n参考资料：\n%s",
        request.getQuestion(),
        request.getContextMaterial()
    );
    messages.add(Map.of(
        "role", "user",
        "content", userContent
    ));
    
    // 2. 构建请求体
    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("model", model);
    requestBody.put("messages", messages);
    requestBody.put("stream", true);
    requestBody.put("temperature", request.getTemperature());
    requestBody.put("max_tokens", request.getMaxTokens());
    
    // 3. 发送请求
    Request httpRequest = new Request.Builder()
        .url(apiUrl)
        .post(RequestBody.create(
            objectMapper.writeValueAsString(requestBody),
            MediaType.get("application/json")
        ))
        .addHeader("Authorization", "Bearer " + apiKey)
        .build();
    
    // 4. 处理流式响应
    try (Response response = client.newCall(httpRequest).execute()) {
        BufferedReader reader = new BufferedReader(
            new InputStreamReader(response.body().byteStream())
        );
        
        String line;
        StringBuilder fullAnswer = new StringBuilder();
        
        while ((line = reader.readLine()) != null) {
            if (line.startsWith("data: ")) {
                String data = line.substring(6);
                
                if ("[DONE]".equals(data)) {
                    onComplete.accept(fullAnswer.toString());
                    break;
                }
                
                // 解析 JSON
                JsonNode root = objectMapper.readTree(data);
                JsonNode delta = root.path("choices")
                    .get(0).path("delta");
                
                if (delta.has("content")) {
                    String content = delta.get("content").asText();
                    fullAnswer.append(content);
                    onChunk.accept(content);
                }
            }
        }
    } catch (Exception e) {
        onError.accept(e.getMessage());
    }
}
```

**关键点**:
- 构建包含问题和参考资料的提示词
- 使用 OkHttp 处理流式响应
- 逐行解析 SSE 数据
- 累积完整回答用于高亮分析

### 3. 文本高亮服务层 (TextHighlightService.java)

**职责**: 核心高亮算法实现

#### 3.1 整体流程

```java
public List<HighlightSegment> highlightText(
    String answer,
    String contextMaterial
) {
    if (answer == null || contextMaterial == null) {
        return Collections.singletonList(
            new HighlightSegment(answer, false)
        );
    }
    
    // 1. 提取参考资料的关键短语
    Set<String> keyPhrases = extractKeyPhrases(contextMaterial);
    
    // 2. 使用滑动窗口匹配
    return matchAndHighlight(answer, keyPhrases);
}
```

#### 3.2 关键短语提取

```java
private Set<String> extractKeyPhrases(String text) {
    Set<String> phrases = new HashSet<>();
    
    // 1. 使用 HanLP 分词
    List<Term> terms = HanLP.segment(text);
    List<String> words = terms.stream()
        .map(Term::word)
        .collect(Collectors.toList());
    
    // 2. 提取 1-gram (单个词)
    for (String word : words) {
        if (word.length() >= 2) {
            phrases.add(word);
        }
    }
    
    // 3. 提取 2-gram (两个词的组合)
    for (int i = 0; i < words.size() - 1; i++) {
        String phrase = words.get(i) + words.get(i + 1);
        if (phrase.length() >= 4) {
            phrases.add(phrase);
        }
    }
    
    // 4. 提取 3-gram (三个词的组合)
    for (int i = 0; i < words.size() - 2; i++) {
        String phrase = words.get(i) + words.get(i + 1) + words.get(i + 2);
        if (phrase.length() >= 6) {
            phrases.add(phrase);
        }
    }
    
    // 5. 提取长子串 (4-20字符)
    for (int len = 4; len <= Math.min(20, text.length()); len++) {
        for (int i = 0; i <= text.length() - len; i++) {
            String substring = text.substring(i, i + len);
            if (!substring.trim().isEmpty()) {
                phrases.add(substring);
            }
        }
    }
    
    return phrases;
}
```

**关键点**:
- 使用 HanLP 进行中文分词
- 多粒度提取：单词、词组、子串
- 过滤过短的短语（< 2 字符）

#### 3.3 滑动窗口匹配

```java
private List<HighlightSegment> matchAndHighlight(
    String text,
    Set<String> keyPhrases
) {
    List<HighlightSegment> segments = new ArrayList<>();
    int textLength = text.length();
    int i = 0;
    
    while (i < textLength) {
        // 1. 尝试找到最长匹配
        int longestMatchLength = 0;
        String longestMatch = null;
        
        // 从当前位置开始，尝试不同长度的子串
        for (int len = MIN_MATCH_LENGTH; 
             len <= Math.min(50, textLength - i); 
             len++) {
            String substring = text.substring(i, i + len);
            
            // 检查是否在关键短语中
            if (keyPhrases.contains(substring)) {
                if (len > longestMatchLength) {
                    longestMatchLength = len;
                    longestMatch = substring;
                }
            }
        }
        
        // 2. 如果找到匹配，添加高亮片段
        if (longestMatch != null) {
            segments.add(new HighlightSegment(longestMatch, true));
            i += longestMatchLength;
        } else {
            // 3. 没有匹配，添加普通片段
            // 找到下一个可能的匹配位置
            int nextMatchPos = findNextPossibleMatch(
                text, i, keyPhrases
            );
            
            if (nextMatchPos > i) {
                String normalText = text.substring(i, nextMatchPos);
                segments.add(new HighlightSegment(normalText, false));
                i = nextMatchPos;
            } else {
                // 没有更多匹配，添加剩余文本
                String remaining = text.substring(i);
                segments.add(new HighlightSegment(remaining, false));
                break;
            }
        }
    }
    
    return segments;
}
```

**算法特点**:
- **贪婪匹配**: 优先匹配最长的短语
- **滑动窗口**: 从当前位置尝试不同长度
- **最小长度**: 设置 `MIN_MATCH_LENGTH = 4` 避免过短匹配
- **最大长度**: 限制为 50 字符避免性能问题

#### 3.4 查找下一个匹配位置

```java
private int findNextPossibleMatch(
    String text,
    int startPos,
    Set<String> keyPhrases
) {
    for (int i = startPos + 1; i < text.length(); i++) {
        // 检查从这个位置开始是否有可能匹配
        for (int len = MIN_MATCH_LENGTH; 
             len <= Math.min(50, text.length() - i); 
             len++) {
            String substring = text.substring(i, i + len);
            if (keyPhrases.contains(substring)) {
                return i;
            }
        }
    }
    return text.length(); // 没有找到，返回文本末尾
}
```

---

## 前端实现

### 1. API 调用层 (ragChat.ts)

**职责**: 处理 SSE 流式响应

```typescript
export async function streamRAGChat(
  request: RAGChatRequest,
  onChunk: (content: string) => void,
  onComplete: (highlights: HighlightSegment[]) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    // 1. 发送请求
    const response = await fetch(getApiUrl('/rag-chat/stream'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 2. 获取流式读取器
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    // 3. 循环读取数据
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // 4. 解码数据
      buffer += decoder.decode(value, { stream: true });

      // 5. 处理 SSE 消息
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
```

**关键点**:
- 使用 Fetch API 的 `ReadableStream`
- 处理 SSE 格式 (`data: ...`)
- 缓冲不完整的行
- 三个回调处理不同事件

### 2. 高亮渲染组件 (HighlightedText.tsx)

**职责**: 渲染高亮文本

```typescript
interface HighlightedTextProps {
  segments: HighlightSegment[];
}

export default function HighlightedText({ segments }: HighlightedTextProps) {
  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
      {segments.map((segment, index) => (
        segment.highlighted ? (
          <mark
            key={index}
            style={{
              backgroundColor: '#fff3cd',
              padding: '2px 6px',
              borderRadius: '3px',
              fontWeight: 500,
            }}
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      ))}
    </div>
  );
}
```

**样式设计**:
- 高亮背景色: `#fff3cd` (淡黄色)
- 内边距: `2px 6px`
- 圆角: `3px`
- 字重: `500` (稍粗)

### 3. 聊天面板组件 (RAGChatPanel.tsx)

**职责**: 管理状态和用户交互

```typescript
export default function RAGChatPanel() {
  const { message } = App.useApp();
  const [question, setQuestion] = useState('');
  const [contextMaterial, setContextMaterial] = useState('');
  const [answer, setAnswer] = useState('');
  const [highlights, setHighlights] = useState<HighlightSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      message.warning('请输入问题');
      return;
    }

    setAnswer('');
    setHighlights([]);
    setLoading(true);
    setShowHighlights(false);

    await streamRAGChat(
      {
        question,
        contextMaterial,
        systemPrompt,
        temperature,
        maxTokens,
      },
      // onChunk: 流式显示
      (content) => {
        setAnswer((prev) => prev + content);
      },
      // onComplete: 显示高亮
      (highlightSegments) => {
        setHighlights(highlightSegments);
        setShowHighlights(true);
        setLoading(false);
        message.success('回答完成');
      },
      // onError: 显示错误
      (error) => {
        setLoading(false);
        message.error(`错误: ${error}`);
      }
    );
  };

  return (
    <div>
      {/* 输入区域 */}
      <TextArea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="请输入你的问题..."
      />
      
      <TextArea
        value={contextMaterial}
        onChange={(e) => setContextMaterial(e.target.value)}
        placeholder="请输入参考资料（可选）..."
      />

      {/* 回答区域 */}
      {showHighlights && highlights.length > 0 ? (
        <HighlightedText segments={highlights} />
      ) : (
        <div>
          {answer}
          {loading && <span className="cursor">▊</span>}
        </div>
      )}

      <Button onClick={handleSubmit} loading={loading}>
        发送
      </Button>
    </div>
  );
}
```

**状态管理**:
- `answer`: 流式累积的原始回答
- `highlights`: 高亮片段数组
- `showHighlights`: 是否显示高亮版本
- `loading`: 加载状态

---

## 核心算法

### 算法流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    1. 提取关键短语                           │
│                                                              │
│  参考资料: "Elasticsearch 是一个分布式搜索引擎"              │
│                          ↓                                   │
│  HanLP 分词: ["Elasticsearch", "是", "一个", "分布式",      │
│               "搜索", "引擎"]                                │
│                          ↓                                   │
│  提取 N-gram:                                                │
│  - 1-gram: ["Elasticsearch", "分布式", "搜索", "引擎"]      │
│  - 2-gram: ["Elasticsearch是", "分布式搜索", "搜索引擎"]    │
│  - 3-gram: ["Elasticsearch是一个", "分布式搜索引擎"]        │
│                          ↓                                   │
│  提取子串:                                                   │
│  - "Elasticsearch 是"                                        │
│  - "分布式搜索引擎"                                          │
│  - ...                                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    2. 滑动窗口匹配                           │
│                                                              │
│  回答: "Elasticsearch 是一个强大的分布式搜索引擎"            │
│                                                              │
│  i=0: 尝试匹配 "Elas", "Elast", ..., "Elasticsearch"        │
│       → 找到 "Elasticsearch" (最长匹配)                      │
│       → 添加高亮片段: {text: "Elasticsearch", highlighted: true} │
│       → i += 13                                              │
│                                                              │
│  i=13: 尝试匹配 " 是", " 是一", ...                         │
│        → 没有匹配                                            │
│        → 查找下一个匹配位置                                  │
│        → 添加普通片段: {text: " 是一个强大的", highlighted: false} │
│        → i = 20                                              │
│                                                              │
│  i=20: 尝试匹配 "分布", "分布式", "分布式搜索", ...         │
│        → 找到 "分布式搜索引擎" (最长匹配)                    │
│        → 添加高亮片段: {text: "分布式搜索引擎", highlighted: true} │
│        → i += 7                                              │
│                                                              │
│  结果: [                                                     │
│    {text: "Elasticsearch", highlighted: true},               │
│    {text: " 是一个强大的", highlighted: false},              │
│    {text: "分布式搜索引擎", highlighted: true}               │
│  ]                                                           │
└─────────────────────────────────────────────────────────────┘
```

### 算法复杂度分析

**时间复杂度**:
- 分词: O(n) - HanLP 分词
- 提取关键短语: O(n²) - 提取所有子串
- 滑动窗口匹配: O(m × k) - m 是回答长度，k 是窗口大小

**空间复杂度**:
- 关键短语集合: O(n²) - 存储所有子串
- 高亮片段: O(m) - 最多 m 个片段

**优化策略**:
1. 限制最大窗口大小 (50 字符)
2. 设置最小匹配长度 (4 字符)
3. 使用 HashSet 快速查找
4. 贪婪匹配减少片段数量

---

## 数据流程

### 完整数据流

```
用户输入
  ├─ 问题: "什么是 Elasticsearch?"
  └─ 参考资料: "Elasticsearch 是一个分布式搜索引擎..."
                    ↓
            [前端] RAGChatPanel
                    ↓
            构建 RAGChatRequest
                    ↓
            POST /api/rag-chat/stream
                    ↓
        [后端] RAGChatController
                    ↓
            创建 SseEmitter
                    ↓
        [后端] LLMChatService.streamChat()
                    ↓
            构建提示词:
            "系统: 你是一个智能助手..."
            "用户: 问题：什么是 Elasticsearch?
                   参考资料：Elasticsearch 是..."
                    ↓
            调用模力方舟 API
                    ↓
        [LLM] 流式生成回答
                    ↓
            "Elasticsearch"
            " 是"
            "一个"
            "强大的"
            "分布式"
            "搜索引擎"
            "..."
                    ↓
        [后端] 逐块发送 SSE
            data: {"content":"Elasticsearch","done":false}
            data: {"content":" 是","done":false}
            data: {"content":"一个","done":false}
            ...
                    ↓
        [前端] 流式显示
            "Elasticsearch"
            "Elasticsearch 是"
            "Elasticsearch 是一个"
            ...
                    ↓
        [后端] LLM 完成，累积完整回答
            fullAnswer = "Elasticsearch 是一个强大的分布式搜索引擎..."
                    ↓
        [后端] TextHighlightService.highlightText()
                    ↓
            1. 提取关键短语
               keyPhrases = ["Elasticsearch", "分布式", "搜索引擎", ...]
                    ↓
            2. 滑动窗口匹配
               segments = [
                 {text: "Elasticsearch", highlighted: true},
                 {text: " 是一个强大的", highlighted: false},
                 {text: "分布式搜索引擎", highlighted: true},
                 ...
               ]
                    ↓
        [后端] 发送完成事件
            data: {"done":true,"highlights":[...]}
                    ↓
        [前端] 接收高亮数据
            setHighlights(segments)
            setShowHighlights(true)
                    ↓
        [前端] HighlightedText 渲染
            <span>Elasticsearch</span> (高亮)
            <span> 是一个强大的</span> (普通)
            <span>分布式搜索引擎</span> (高亮)
                    ↓
            用户看到高亮的回答
```

---

## 性能优化

### 1. 后端优化

#### 1.1 异步处理
```java
// 使用线程池异步处理
private final ExecutorService executorService = 
    Executors.newFixedThreadPool(10);

executorService.execute(() -> {
    // 处理流式响应
});
```

#### 1.2 连接池
```java
// OkHttp 连接池
private final OkHttpClient client = new OkHttpClient.Builder()
    .connectTimeout(30, TimeUnit.SECONDS)
    .readTimeout(60, TimeUnit.SECONDS)
    .writeTimeout(60, TimeUnit.SECONDS)
    .connectionPool(new ConnectionPool(5, 5, TimeUnit.MINUTES))
    .build();
```

#### 1.3 缓存优化
```java
// HanLP 分词器缓存
private static final HanLP hanlp = new HanLP();

// 关键短语提取结果缓存（可选）
private final Map<String, Set<String>> phraseCache = 
    new ConcurrentHashMap<>();
```

### 2. 前端优化

#### 2.1 防抖处理
```typescript
// 避免频繁更新
const debouncedSetAnswer = useMemo(
  () => debounce((content: string) => {
    setAnswer(prev => prev + content);
  }, 50),
  []
);
```

#### 2.2 虚拟滚动
```typescript
// 对于超长回答，使用虚拟滚动
import { FixedSizeList } from 'react-window';
```

#### 2.3 懒加载高亮
```typescript
// 只在用户滚动到可见区域时渲染高亮
const [visibleSegments, setVisibleSegments] = useState([]);
```

### 3. 算法优化

#### 3.1 限制短语数量
```java
// 只保留最有价值的短语
Set<String> topPhrases = keyPhrases.stream()
    .sorted((a, b) -> Integer.compare(b.length(), a.length()))
    .limit(1000)
    .collect(Collectors.toSet());
```

#### 3.2 早期终止
```java
// 如果已经匹配了大部分文本，提前终止
if (highlightedLength > answer.length() * 0.8) {
    break;
}
```

#### 3.3 并行处理
```java
// 对于超长文本，分段并行处理
List<CompletableFuture<List<HighlightSegment>>> futures = 
    chunks.stream()
        .map(chunk -> CompletableFuture.supplyAsync(
            () -> matchAndHighlight(chunk, keyPhrases)
        ))
        .collect(Collectors.toList());
```

---

## 问题与挑战

### 1. 语义改写问题

**问题**: 大模型可能改写参考资料

**示例**:
- 参考资料: "Elasticsearch 是一个分布式搜索引擎"
- LLM 回答: "Elasticsearch 是一款分布式的搜索引擎系统"

**解决方案**:
- 当前: 基于字符串匹配，只能匹配完全相同的部分
- 未来: 使用语义相似度匹配（如 BERT embeddings）

### 2. 中文分词准确性

**问题**: 分词错误导致匹配失败

**示例**:
- 正确: "分布式" + "搜索引擎"
- 错误: "分布" + "式搜索" + "引擎"

**解决方案**:
- 使用 HanLP 提高分词准确性
- 提取多粒度短语（1-gram, 2-gram, 3-gram）
- 提取子串作为补充

### 3. 性能问题

**问题**: 大量短语和长文本导致性能下降

**优化**:
- 限制最大窗口大小 (50 字符)
- 限制关键短语数量 (1000 个)
- 使用 HashSet 快速查找
- 异步处理避免阻塞

### 4. 边界情况

**问题**: 特殊字符、换行符、标点符号

**处理**:
```java
// 标准化文本
String normalized = text
    .replaceAll("\\s+", " ")  // 统一空白字符
    .trim();                   // 去除首尾空白
```

### 5. 流式响应中断

**问题**: 网络问题导致 SSE 连接中断

**解决方案**:
```java
// 设置超时和重试
emitter.onTimeout(() -> {
    emitter.completeWithError(new TimeoutException());
});

emitter.onError((e) -> {
    logger.error("SSE error", e);
});
```

---

## 未来改进方向

### 1. 语义匹配

使用 BERT 或其他语言模型计算语义相似度：

```java
// 伪代码
float similarity = bertModel.similarity(
    "Elasticsearch 是一个分布式搜索引擎",
    "Elasticsearch 是一款分布式的搜索引擎系统"
);

if (similarity > 0.85) {
    // 认为是引用
}
```

### 2. 智能提示词

优化系统提示词，要求 LLM 标记引用：

```
系统提示词: "当你引用参考资料时，请使用 [REF]...[/REF] 标记"

LLM 回答: "[REF]Elasticsearch 是一个分布式搜索引擎[/REF]，它具有..."
```

### 3. 多语言支持

扩展到英文、日文等其他语言：

```java
// 根据语言选择分词器
Tokenizer tokenizer = switch (language) {
    case "zh" -> new HanLPTokenizer();
    case "en" -> new EnglishTokenizer();
    case "ja" -> new JapaneseTokenizer();
    default -> new StandardTokenizer();
};
```

### 4. 可视化增强

提供更丰富的高亮样式：

```typescript
// 不同类型的高亮
<mark className="exact-match">完全匹配</mark>
<mark className="partial-match">部分匹配</mark>
<mark className="semantic-match">语义匹配</mark>
```

### 5. 用户反馈

允许用户标记错误的高亮：

```typescript
<mark onClick={() => reportWrongHighlight(segment)}>
  {segment.text}
</mark>
```

---

## 总结

### 技术亮点

1. **流式响应** - 使用 SSE 实现实时显示
2. **智能分词** - HanLP 中文分词提高准确性
3. **多粒度匹配** - N-gram + 子串提取
4. **贪婪算法** - 优先匹配最长短语
5. **异步处理** - 不阻塞主线程

### 适用场景

- ✅ RAG 问答系统
- ✅ 文档引用标注
- ✅ 抄袭检测
- ✅ 内容溯源

### 局限性

- ❌ 无法识别语义改写
- ❌ 依赖分词准确性
- ❌ 长文本性能有限

### 改进空间

- 🔄 引入语义匹配
- 🔄 优化算法性能
- 🔄 支持多语言
- 🔄 增强可视化

---

## 附录

### A. 依赖版本

```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.hankcs</groupId>
    <artifactId>hanlp</artifactId>
    <version>portable-1.8.4</version>
</dependency>

<dependency>
    <groupId>org.apache.lucene</groupId>
    <artifactId>lucene-core</artifactId>
    <version>9.8.0</version>
</dependency>

<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>4.12.0</version>
</dependency>
```

### B. 配置参数

```yaml
# application.yml
llm:
  molizk:
    api-url: https://ai.gitee.com/v1/chat/completions
    api-key: ${LLM_API_KEY}
    model: Qwen3-235B-A22B-Instruct-2507
    timeout: 60000
    default-system-prompt: "你是一个智能助手。请结合你的知识和用户提供的参考资料来回答问题。如果你的回答中直接引用了参考资料的内容，请保持原文。"
```

### C. 测试用例

```java
@Test
public void testHighlight() {
    String answer = "Elasticsearch 是一个强大的分布式搜索引擎";
    String context = "Elasticsearch 是一个分布式搜索引擎";
    
    List<HighlightSegment> segments = 
        textHighlightService.highlightText(answer, context);
    
    assertEquals(3, segments.size());
    assertTrue(segments.get(0).getHighlighted()); // "Elasticsearch"
    assertFalse(segments.get(1).getHighlighted()); // " 是一个强大的"
    assertTrue(segments.get(2).getHighlighted()); // "分布式搜索引擎"
}
```

---

**文档版本**: 1.0  
**最后更新**: 2025-11-05  
**作者**: ElastiQuest Team

