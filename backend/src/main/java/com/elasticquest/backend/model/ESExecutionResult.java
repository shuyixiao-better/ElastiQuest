package com.elasticquest.backend.model;

/**
 * ES 命令执行结果
 */
public class ESExecutionResult {
    
    private boolean success;
    private String message;
    private int statusCode;
    private String responseBody;
    private String error;
    
    public ESExecutionResult() {
    }
    
    public static ESExecutionResult success(int statusCode, String responseBody) {
        ESExecutionResult result = new ESExecutionResult();
        result.setSuccess(true);
        result.setMessage("执行成功");
        result.setStatusCode(statusCode);
        result.setResponseBody(responseBody);
        return result;
    }
    
    public static ESExecutionResult failure(String error) {
        ESExecutionResult result = new ESExecutionResult();
        result.setSuccess(false);
        result.setMessage("执行失败");
        result.setError(error);
        return result;
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public int getStatusCode() {
        return statusCode;
    }
    
    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }
    
    public String getResponseBody() {
        return responseBody;
    }
    
    public void setResponseBody(String responseBody) {
        this.responseBody = responseBody;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
}

