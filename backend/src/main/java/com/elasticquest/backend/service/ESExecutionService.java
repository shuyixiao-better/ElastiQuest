package com.elasticquest.backend.service;

import com.elasticquest.backend.model.ESConnectionConfig;
import com.elasticquest.backend.model.ESExecutionResult;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

/**
 * ES 命令执行服务
 */
@Service
public class ESExecutionService {
    
    private static final Logger logger = LoggerFactory.getLogger(ESExecutionService.class);
    
    /**
     * 执行 ES 命令
     */
    public ESExecutionResult executeCommand(String command, ESConnectionConfig config) {
        RestClient client = null;
        try {
            // 解析命令
            CommandInfo commandInfo = parseCommand(command);
            
            // 创建 RestClient
            client = createRestClient(config);
            
            // 创建请求
            Request request = new Request(commandInfo.method, commandInfo.endpoint);
            
            // 如果有请求体，设置请求体
            if (commandInfo.body != null && !commandInfo.body.trim().isEmpty()) {
                request.setJsonEntity(commandInfo.body);
            }
            
            // 执行请求
            Response response = client.performRequest(request);
            
            // 读取响应
            String responseBody = new BufferedReader(
                new InputStreamReader(response.getEntity().getContent(), StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining("\n"));
            
            logger.info("ES 命令执行成功: method={}, endpoint={}, status={}", 
                commandInfo.method, commandInfo.endpoint, response.getStatusLine().getStatusCode());
            
            return ESExecutionResult.success(
                response.getStatusLine().getStatusCode(), 
                responseBody
            );
            
        } catch (Exception e) {
            logger.error("ES 命令执行失败: {}", e.getMessage(), e);
            return ESExecutionResult.failure(e.getMessage());
        } finally {
            if (client != null) {
                try {
                    client.close();
                } catch (Exception e) {
                    logger.error("关闭 ES 客户端失败", e);
                }
            }
        }
    }
    
    /**
     * 解析命令
     */
    private CommandInfo parseCommand(String command) {
        String[] lines = command.trim().split("\n");
        
        if (lines.length == 0) {
            throw new IllegalArgumentException("命令不能为空");
        }
        
        // 第一行是方法和端点
        String firstLine = lines[0].trim();
        String[] parts = firstLine.split("\\s+", 2);
        
        if (parts.length < 2) {
            throw new IllegalArgumentException("命令格式错误，应为: METHOD /endpoint");
        }
        
        String method = parts[0].toUpperCase();
        String endpoint = parts[1];
        
        // 剩余行是请求体
        String body = null;
        if (lines.length > 1) {
            StringBuilder bodyBuilder = new StringBuilder();
            for (int i = 1; i < lines.length; i++) {
                bodyBuilder.append(lines[i]).append("\n");
            }
            body = bodyBuilder.toString().trim();
        }
        
        return new CommandInfo(method, endpoint, body);
    }
    
    /**
     * 创建 RestClient
     */
    private RestClient createRestClient(ESConnectionConfig config) {
        HttpHost host = new HttpHost(
            config.getHost(),
            config.getPort(),
            config.getScheme()
        );
        
        RestClientBuilder builder = RestClient.builder(host);
        
        // 如果有用户名和密码，添加认证
        if (config.getUsername() != null && !config.getUsername().isEmpty() &&
            config.getPassword() != null && !config.getPassword().isEmpty()) {
            
            BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
            credentialsProvider.setCredentials(
                AuthScope.ANY,
                new UsernamePasswordCredentials(config.getUsername(), config.getPassword())
            );
            
            builder.setHttpClientConfigCallback(httpClientBuilder ->
                httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider)
            );
        }
        
        // 设置超时
        builder.setRequestConfigCallback(requestConfigBuilder ->
            requestConfigBuilder
                .setConnectTimeout(5000)
                .setSocketTimeout(60000)
        );
        
        return builder.build();
    }
    
    /**
     * 命令信息
     */
    private static class CommandInfo {
        String method;
        String endpoint;
        String body;
        
        CommandInfo(String method, String endpoint, String body) {
            this.method = method;
            this.endpoint = endpoint;
            this.body = body;
        }
    }
}

