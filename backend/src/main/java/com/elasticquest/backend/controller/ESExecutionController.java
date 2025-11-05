package com.elasticquest.backend.controller;

import com.elasticquest.backend.model.ESExecutionRequest;
import com.elasticquest.backend.model.ESExecutionResult;
import com.elasticquest.backend.service.ESExecutionService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * ES 命令执行控制器
 */
@RestController
@RequestMapping("/es-execution")
public class ESExecutionController {
    
    private static final Logger logger = LoggerFactory.getLogger(ESExecutionController.class);
    
    @Autowired
    private ESExecutionService esExecutionService;
    
    /**
     * 执行 ES 命令
     */
    @PostMapping("/execute")
    public ResponseEntity<ESExecutionResult> executeCommand(@Valid @RequestBody ESExecutionRequest request) {
        logger.info("执行 ES 命令: {}", request.getCommand().split("\n")[0]);
        
        try {
            ESExecutionResult result = esExecutionService.executeCommand(
                request.getCommand(), 
                request.getConnection()
            );
            
            if (result.isSuccess()) {
                logger.info("ES 命令执行成功: statusCode={}", result.getStatusCode());
            } else {
                logger.warn("ES 命令执行失败: error={}", result.getError());
            }
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            logger.error("执行 ES 命令时发生异常", e);
            return ResponseEntity.ok(ESExecutionResult.failure(e.getMessage()));
        }
    }
}

