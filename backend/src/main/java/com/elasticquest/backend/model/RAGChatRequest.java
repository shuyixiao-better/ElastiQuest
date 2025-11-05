package com.elasticquest.backend.model;

import jakarta.validation.constraints.NotBlank;

/**
 * RAG 聊天请求模型
 */
public class RAGChatRequest {
    
    @NotBlank(message = "问题不能为空")
    private String question;
    
    private String contextMaterial; // 补充材料/上下文
    
    private String systemPrompt; // 系统提示词
    
    private Double temperature; // 温度参数，控制随机性
    
    private Integer maxTokens; // 最大token数
    
    public RAGChatRequest() {
    }
    
    public RAGChatRequest(String question, String contextMaterial) {
        this.question = question;
        this.contextMaterial = contextMaterial;
    }
    
    // Getters and Setters
    public String getQuestion() {
        return question;
    }
    
    public void setQuestion(String question) {
        this.question = question;
    }
    
    public String getContextMaterial() {
        return contextMaterial;
    }
    
    public void setContextMaterial(String contextMaterial) {
        this.contextMaterial = contextMaterial;
    }
    
    public String getSystemPrompt() {
        return systemPrompt;
    }
    
    public void setSystemPrompt(String systemPrompt) {
        this.systemPrompt = systemPrompt;
    }
    
    public Double getTemperature() {
        return temperature;
    }
    
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
    
    public Integer getMaxTokens() {
        return maxTokens;
    }
    
    public void setMaxTokens(Integer maxTokens) {
        this.maxTokens = maxTokens;
    }
}

