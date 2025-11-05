package com.elasticquest.backend.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Dotenv 配置类
 * 在应用启动时加载 .env 文件中的环境变量
 */
public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        
        // 尝试加载 .env 文件
        File envFile = new File(".env");
        if (!envFile.exists()) {
            // 如果当前目录没有，尝试从项目根目录加载
            envFile = new File("backend/.env");
        }
        
        if (envFile.exists()) {
            try {
                Properties props = new Properties();
                props.load(new FileInputStream(envFile));
                
                Map<String, Object> envMap = new HashMap<>();
                props.forEach((key, value) -> {
                    String keyStr = key.toString();
                    String valueStr = value.toString();
                    
                    // 去除注释和空白
                    if (!keyStr.startsWith("#") && !keyStr.trim().isEmpty()) {
                        envMap.put(keyStr.trim(), valueStr.trim());
                        
                        // 同时设置为系统属性，确保 ${} 占位符能够解析
                        System.setProperty(keyStr.trim(), valueStr.trim());
                    }
                });
                
                environment.getPropertySources().addFirst(
                    new MapPropertySource("dotenvProperties", envMap)
                );
                
                System.out.println("✅ 成功加载 .env 文件: " + envFile.getAbsolutePath());
                
            } catch (IOException e) {
                System.err.println("⚠️  加载 .env 文件失败: " + e.getMessage());
            }
        } else {
            System.out.println("ℹ️  未找到 .env 文件，将使用环境变量或默认配置");
        }
    }
}

