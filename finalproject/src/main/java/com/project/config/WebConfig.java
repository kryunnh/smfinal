package com.project.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**") // ✅ URL 패턴: /uploads/
                .addResourceLocations("file:///" + System.getProperty("user.dir") + "/uploads/"); // ✅ 동적으로 경로 설정
    }
}
