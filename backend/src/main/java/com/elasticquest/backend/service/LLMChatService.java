package com.elasticquest.backend.service;

import com.elasticquest.backend.model.ChatMessage;
import com.elasticquest.backend.model.RAGChatRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

/**
 * LLM 聊天服务
 * 调用模力方舟 API 进行流式对话
 */
@Service
public class LLMChatService {
    
    private static final Logger logger = LoggerFactory.getLogger(LLMChatService.class);
    
    @Value("${llm.molizk.api-url}")
    private String apiUrl;
    
    @Value("${llm.molizk.api-key}")
    private String apiKey;
    
    @Value("${llm.molizk.model}")
    private String model;
    
    @Value("${llm.molizk.timeout:60000}")
    private long timeout;
    
    @Value("${llm.molizk.default-system-prompt}")
    private String defaultSystemPrompt;
    
    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    public LLMChatService() {
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * 流式聊天
     * @param request RAG 聊天请求
     * @param onChunk 接收每个流式块的回调
     * @param onComplete 完成时的回调，返回完整答案
     * @param onError 错误回调
     */
    public void streamChat(RAGChatRequest request, 
                          Consumer<String> onChunk,
                          Consumer<String> onComplete,
                          Consumer<String> onError) {
        
        try {
            // 构建消息列表
            List<ChatMessage> messages = buildMessages(request);
            
            // 构建请求体
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", messages);
            requestBody.put("stream", true);
            requestBody.put("temperature", request.getTemperature() != null ? request.getTemperature() : 1.0);
            
            if (request.getMaxTokens() != null && request.getMaxTokens() > 0) {
                requestBody.put("max_tokens", request.getMaxTokens());
            }
            
            String jsonBody = objectMapper.writeValueAsString(requestBody);
            
            logger.info("调用 LLM API: {}", apiUrl);
            logger.debug("请求体: {}", jsonBody);
            
            // 构建 HTTP 请求
            Request httpRequest = new Request.Builder()
                    .url(apiUrl)
                    .post(RequestBody.create(jsonBody, MediaType.parse("application/json")))
                    .addHeader("Content-Type", "application/json")
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .build();
            
            // 发送请求并处理流式响应
            try (Response response = httpClient.newCall(httpRequest).execute()) {
                if (!response.isSuccessful()) {
                    String errorMsg = "LLM API 调用失败: " + response.code();
                    logger.error(errorMsg);
                    onError.accept(errorMsg);
                    return;
                }
                
                ResponseBody responseBody = response.body();
                if (responseBody == null) {
                    onError.accept("响应体为空");
                    return;
                }
                
                // 处理流式响应
                StringBuilder fullAnswer = new StringBuilder();
                BufferedReader reader = new BufferedReader(responseBody.charStream());
                String line;
                
                while ((line = reader.readLine()) != null) {
                    if (line.startsWith("data: ")) {
                        String data = line.substring(6).trim();
                        
                        if ("[DONE]".equals(data)) {
                            break;
                        }
                        
                        try {
                            JsonNode jsonNode = objectMapper.readTree(data);
                            JsonNode choices = jsonNode.get("choices");
                            
                            if (choices != null && choices.isArray() && choices.size() > 0) {
                                JsonNode delta = choices.get(0).get("delta");
                                if (delta != null && delta.has("content")) {
                                    String content = delta.get("content").asText();
                                    if (content != null && !content.isEmpty()) {
                                        fullAnswer.append(content);
                                        onChunk.accept(content);
                                    }
                                }
                            }
                        } catch (Exception e) {
                            logger.warn("解析流式响应失败: {}", data, e);
                        }
                    }
                }
                
                // 完成
                onComplete.accept(fullAnswer.toString());
                logger.info("LLM 流式响应完成，总长度: {}", fullAnswer.length());
                
            }
            
        } catch (Exception e) {
            logger.error("LLM 调用异常", e);
            onError.accept("调用失败: " + e.getMessage());
        }
    }
    
    /**
     * 构建消息列表
     */
    private List<ChatMessage> buildMessages(RAGChatRequest request) {
        List<ChatMessage> messages = new ArrayList<>();
        
        // 系统提示词
        String systemPrompt = request.getSystemPrompt() != null && !request.getSystemPrompt().isEmpty()
                ? request.getSystemPrompt()
                : defaultSystemPrompt;
        messages.add(new ChatMessage("system", systemPrompt));
        
        // 用户问题（包含参考材料）
        StringBuilder userContent = new StringBuilder();
        
        if (request.getContextMaterial() != null && !request.getContextMaterial().isEmpty()) {
            userContent.append("参考资料：\n");
            userContent.append(request.getContextMaterial());
            userContent.append("\n\n");
        }
        
        userContent.append("问题：\n");
        userContent.append(request.getQuestion());
        
        messages.add(new ChatMessage("user", userContent.toString()));
        
        return messages;
    }
}

