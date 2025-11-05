package com.elasticquest.backend.service;

import com.elasticquest.backend.model.ConnectionTestResult;
import com.elasticquest.backend.model.ESConnectionConfig;
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
 * ES 连接服务
 */
@Service
public class ESConnectionService {
    
    private static final Logger logger = LoggerFactory.getLogger(ESConnectionService.class);
    
    /**
     * 测试 ES 连接
     */
    public ConnectionTestResult testConnection(ESConnectionConfig config) {
        RestClient client = null;
        try {
            // 创建 RestClient
            client = createRestClient(config);
            
            // 测试连接 - 获取集群信息
            Request request = new Request("GET", "/");
            Response response = client.performRequest(request);
            
            // 解析响应
            String responseBody = new BufferedReader(
                new InputStreamReader(response.getEntity().getContent(), StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining("\n"));
            
            logger.info("ES 连接测试成功: {}", responseBody);
            
            // 简单解析 JSON（实际项目中应使用 JSON 库）
            String clusterName = extractJsonValue(responseBody, "cluster_name");
            String version = extractJsonValue(responseBody, "number");
            
            return ConnectionTestResult.success(clusterName, version);
            
        } catch (Exception e) {
            logger.error("ES 连接测试失败: {}", e.getMessage(), e);
            return ConnectionTestResult.failure(e.getMessage());
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
     * 简单的 JSON 值提取（仅用于演示，生产环境应使用 Jackson 或 Gson）
     */
    private String extractJsonValue(String json, String key) {
        try {
            String searchKey = "\"" + key + "\"";
            int startIndex = json.indexOf(searchKey);
            if (startIndex == -1) {
                return "Unknown";
            }
            
            startIndex = json.indexOf(":", startIndex) + 1;
            int endIndex = json.indexOf(",", startIndex);
            if (endIndex == -1) {
                endIndex = json.indexOf("}", startIndex);
            }
            
            String value = json.substring(startIndex, endIndex).trim();
            // 移除引号
            if (value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length() - 1);
            }
            
            return value;
        } catch (Exception e) {
            logger.warn("解析 JSON 值失败: key={}", key, e);
            return "Unknown";
        }
    }
}

