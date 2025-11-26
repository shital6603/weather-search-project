package com.example.weather.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class CaffeineConfig {

    @Value("${cache.maxEntries:200}")
    private int maxEntries;

    @Value("${cache.ttlSeconds:600}")
    private int ttlSeconds;

    @Bean
    public com.github.benmanes.caffeine.cache.Cache<String, Object> cache() {
        return Caffeine.newBuilder()
                .maximumSize(maxEntries)
                .expireAfterWrite(ttlSeconds, TimeUnit.SECONDS)
                .build();
    }
}
