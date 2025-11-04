package com.elasticquest.backend.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * ES 连接配置模型
 */
public class ESConnectionConfig {
    
    private String id;
    
    @NotBlank(message = "配置名称不能为空")
    private String name;
    
    @NotBlank(message = "主机地址不能为空")
    private String host;
    
    @NotNull(message = "端口不能为空")
    @Min(value = 1, message = "端口必须大于0")
    @Max(value = 65535, message = "端口必须小于65536")
    private Integer port;
    
    @NotBlank(message = "协议不能为空")
    private String scheme; // http 或 https
    
    private String username;
    private String password;
    private String apiKey;
    
    @NotBlank(message = "环境不能为空")
    private String environment; // development, test, production
    
    private String createdAt;
    private String lastUsed;
    
    // 构造函数
    public ESConnectionConfig() {
    }
    
    public ESConnectionConfig(String id, String name, String host, Integer port, String scheme, 
                             String username, String password, String apiKey, String environment, 
                             String createdAt, String lastUsed) {
        this.id = id;
        this.name = name;
        this.host = host;
        this.port = port;
        this.scheme = scheme;
        this.username = username;
        this.password = password;
        this.apiKey = apiKey;
        this.environment = environment;
        this.createdAt = createdAt;
        this.lastUsed = lastUsed;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getHost() {
        return host;
    }
    
    public void setHost(String host) {
        this.host = host;
    }
    
    public Integer getPort() {
        return port;
    }
    
    public void setPort(Integer port) {
        this.port = port;
    }
    
    public String getScheme() {
        return scheme;
    }
    
    public void setScheme(String scheme) {
        this.scheme = scheme;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getApiKey() {
        return apiKey;
    }
    
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
    
    public String getEnvironment() {
        return environment;
    }
    
    public void setEnvironment(String environment) {
        this.environment = environment;
    }
    
    public String getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getLastUsed() {
        return lastUsed;
    }
    
    public void setLastUsed(String lastUsed) {
        this.lastUsed = lastUsed;
    }
    
    /**
     * 获取完整的 ES URL
     */
    public String getFullUrl() {
        return scheme + "://" + host + ":" + port;
    }
    
    @Override
    public String toString() {
        return "ESConnectionConfig{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", host='" + host + '\'' +
                ", port=" + port +
                ", scheme='" + scheme + '\'' +
                ", environment='" + environment + '\'' +
                ", createdAt='" + createdAt + '\'' +
                '}';
    }
}

