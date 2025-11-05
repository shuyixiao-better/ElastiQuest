package com.elasticquest.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 开发环境：允许所有来源（支持局域网 IP 访问）
        // 生产环境：应该配置具体的域名
        config.setAllowedOriginPatterns(Arrays.asList("*"));

        // 允许的 HTTP 方法
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // 允许的请求头
        config.setAllowedHeaders(Arrays.asList("*"));

        // 允许发送凭证
        config.setAllowCredentials(true);

        // 预检请求的缓存时间
        config.setMaxAge(3600L);

        // 暴露的响应头（用于 SSE）
        config.setExposedHeaders(Arrays.asList(
            "Content-Type",
            "Cache-Control",
            "Content-Encoding",
            "Date",
            "Keep-Alive",
            "Connection"
        ));

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
