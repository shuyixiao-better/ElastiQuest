package com.elasticquest.backend.model;

import jakarta.validation.constraints.NotBlank;

/**
 * ES 命令执行请求
 */
public class ESExecutionRequest {
    
    @NotBlank(message = "命令不能为空")
    private String command;
    
    private ESConnectionConfig connection;
    
    public ESExecutionRequest() {
    }
    
    public ESExecutionRequest(String command, ESConnectionConfig connection) {
        this.command = command;
        this.connection = connection;
    }
    
    public String getCommand() {
        return command;
    }
    
    public void setCommand(String command) {
        this.command = command;
    }
    
    public ESConnectionConfig getConnection() {
        return connection;
    }
    
    public void setConnection(ESConnectionConfig connection) {
        this.connection = connection;
    }
}

