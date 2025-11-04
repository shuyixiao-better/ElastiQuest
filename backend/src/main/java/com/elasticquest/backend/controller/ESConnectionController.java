package com.elasticquest.backend.controller;

import com.elasticquest.backend.model.ConnectionTestResult;
import com.elasticquest.backend.model.ESConnectionConfig;
import com.elasticquest.backend.service.ESConnectionService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * ES 连接配置控制器
 */
@RestController
@RequestMapping("/es-connection")
public class ESConnectionController {
    
    private static final Logger logger = LoggerFactory.getLogger(ESConnectionController.class);
    
    @Autowired
    private ESConnectionService esConnectionService;
    
    /**
     * 测试 ES 连接
     */
    @PostMapping("/test")
    public ResponseEntity<ConnectionTestResult> testConnection(@Valid @RequestBody ESConnectionConfig config) {
        logger.info("测试 ES 连接: name={}, host={}, port={}", config.getName(), config.getHost(), config.getPort());
        
        ConnectionTestResult result = esConnectionService.testConnection(config);
        
        if (result.isSuccess()) {
            logger.info("ES 连接测试成功: clusterName={}, version={}", result.getClusterName(), result.getVersion());
            return ResponseEntity.ok(result);
        } else {
            logger.warn("ES 连接测试失败: error={}", result.getError());
            return ResponseEntity.ok(result); // 仍然返回 200，但 success=false
        }
    }
    
    /**
     * 健康检查
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ES Connection Service is running");
    }
}

