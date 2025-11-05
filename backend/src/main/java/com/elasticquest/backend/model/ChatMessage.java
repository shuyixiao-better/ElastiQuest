package com.elasticquest.backend.model;

import jakarta.validation.constraints.NotBlank;

/**
 * 聊天消息模型
 */
public class ChatMessage {
    
    @NotBlank(message = "角色不能为空")
    private String role; // system, user, assistant
    
    @NotBlank(message = "内容不能为空")
    private String content;
    
    private String name;
    
    public ChatMessage() {
    }
    
    public ChatMessage(String role, String content) {
        this.role = role;
        this.content = content;
    }
    
    public ChatMessage(String role, String content, String name) {
        this.role = role;
        this.content = content;
        this.name = name;
    }
    
    // Getters and Setters
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}

