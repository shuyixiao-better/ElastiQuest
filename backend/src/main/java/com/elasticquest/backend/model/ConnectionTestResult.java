package com.elasticquest.backend.model;

/**
 * ES 连接测试结果
 */
public class ConnectionTestResult {
    
    private boolean success;
    private String message;
    private String clusterName;
    private String version;
    private String error;
    
    public ConnectionTestResult() {
    }
    
    public ConnectionTestResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public static ConnectionTestResult success(String clusterName, String version) {
        ConnectionTestResult result = new ConnectionTestResult();
        result.setSuccess(true);
        result.setMessage("连接成功");
        result.setClusterName(clusterName);
        result.setVersion(version);
        return result;
    }
    
    public static ConnectionTestResult failure(String error) {
        ConnectionTestResult result = new ConnectionTestResult();
        result.setSuccess(false);
        result.setMessage("连接失败");
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
    
    public String getClusterName() {
        return clusterName;
    }
    
    public void setClusterName(String clusterName) {
        this.clusterName = clusterName;
    }
    
    public String getVersion() {
        return version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
}

