package com.elasticquest.backend.controller;

import com.elasticquest.backend.model.HighlightSegment;
import com.elasticquest.backend.model.RAGChatRequest;
import com.elasticquest.backend.model.StreamChatChunk;
import com.elasticquest.backend.service.LLMChatService;
import com.elasticquest.backend.service.TextHighlightService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * RAG 聊天控制器
 * 提供流式对话 API
 */
@RestController
@RequestMapping("/rag-chat")
public class RAGChatController {
    
    private static final Logger logger = LoggerFactory.getLogger(RAGChatController.class);
    
    @Autowired
    private LLMChatService llmChatService;
    
    @Autowired
    private TextHighlightService textHighlightService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ExecutorService executorService = Executors.newCachedThreadPool();
    
    /**
     * 流式聊天接口
     * 使用 Server-Sent Events (SSE) 返回流式响应
     */
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@Valid @RequestBody RAGChatRequest request) {
        logger.info("收到 RAG 聊天请求: question={}", request.getQuestion());
        
        SseEmitter emitter = new SseEmitter(120000L); // 2分钟超时
        
        executorService.execute(() -> {
            try {
                llmChatService.streamChat(
                    request,
                    // onChunk: 发送每个内容块
                    (content) -> {
                        try {
                            StreamChatChunk chunk = StreamChatChunk.content(content);
                            String json = objectMapper.writeValueAsString(chunk);
                            emitter.send(SseEmitter.event()
                                    .data(json)
                                    .name("message"));
                        } catch (IOException e) {
                            logger.error("发送流式数据失败", e);
                            emitter.completeWithError(e);
                        }
                    },
                    // onComplete: 发送高亮信息并完成
                    (fullAnswer) -> {
                        try {
                            // 计算高亮
                            List<HighlightSegment> highlights = textHighlightService.highlightAnswer(
                                    fullAnswer, 
                                    request.getContextMaterial()
                            );
                            
                            // 发送完成消息（包含高亮信息）
                            StreamChatChunk doneChunk = StreamChatChunk.done(highlights);
                            String json = objectMapper.writeValueAsString(doneChunk);
                            emitter.send(SseEmitter.event()
                                    .data(json)
                                    .name("done"));
                            
                            emitter.complete();
                            logger.info("RAG 聊天完成");
                            
                        } catch (IOException e) {
                            logger.error("发送完成消息失败", e);
                            emitter.completeWithError(e);
                        }
                    },
                    // onError: 发送错误并完成
                    (error) -> {
                        try {
                            StreamChatChunk errorChunk = StreamChatChunk.error(error);
                            String json = objectMapper.writeValueAsString(errorChunk);
                            emitter.send(SseEmitter.event()
                                    .data(json)
                                    .name("error"));
                            emitter.completeWithError(new RuntimeException(error));
                        } catch (IOException e) {
                            logger.error("发送错误消息失败", e);
                            emitter.completeWithError(e);
                        }
                    }
                );
                
            } catch (Exception e) {
                logger.error("RAG 聊天异常", e);
                emitter.completeWithError(e);
            }
        });
        
        // 设置超时和错误处理
        emitter.onTimeout(() -> {
            logger.warn("RAG 聊天超时");
            emitter.complete();
        });
        
        emitter.onError((e) -> {
            logger.error("RAG 聊天错误", e);
        });
        
        return emitter;
    }
    
    /**
     * 健康检查
     */
    @GetMapping("/health")
    public String health() {
        return "RAG Chat Service is running";
    }
}

