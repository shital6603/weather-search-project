package com.example.weather.service;

import com.example.weather.dto.WeatherResponseDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.github.benmanes.caffeine.cache.Cache;

import reactor.core.publisher.Mono;
import java.util.Map;

@Service
public class WeatherService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();
    private final Cache<String, Object> cache;
    private final String owmKey;

    public WeatherService(Cache<String, Object> cache,
                          @Value("${openweathermap.key:}") String owmKey,
                          WebClient.Builder webClientBuilder) {
        this.cache = cache;
        this.owmKey = owmKey;
        this.webClient = webClientBuilder.baseUrl("https://api.openweathermap.org/data/2.5").build();
    }

    public Mono<WeatherResponseDto> getWeatherForCity(String city) {
        String key = city.trim().toLowerCase();
        Object cached = cache.getIfPresent(key);
        if (cached != null) {
            return Mono.just((WeatherResponseDto) cached);
        }

        if (owmKey == null || owmKey.isEmpty()) {
            return Mono.error(new RuntimeException("OpenWeatherMap API key not configured (openweathermap.key)"));
        }

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/weather")
                        .queryParam("q", city)
                        .queryParam("appid", owmKey)
                        .queryParam("units", "metric")
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> {
                    try {
                        WeatherResponseDto dto = new WeatherResponseDto();
                        dto.id = json.path("id").asLong();
                        dto.name = json.path("name").asText(null);
                        dto.country = json.path("sys").path("country").asText(null);
                        dto.coord = mapper.convertValue(json.path("coord"), Map.class);
                        dto.weather = mapper.convertValue(json.path("weather"), Object.class);
                        dto.main = mapper.convertValue(json.path("main"), Map.class);
                        dto.wind = mapper.convertValue(json.path("wind"), Map.class);
                        dto.clouds = mapper.convertValue(json.path("clouds"), Map.class);
                        dto.visibility = json.path("visibility").isMissingNode() ? null : json.path("visibility").asInt();
                        dto.dt = json.path("dt").asLong();
                        dto.sunrise = json.path("sys").path("sunrise").asLong();
                        dto.sunset = json.path("sys").path("sunset").asLong();
                        dto.timezone = json.path("timezone").isMissingNode() ? null : json.path("timezone").asInt();
                        dto.raw = json;
                        cache.put(key, dto);
                        return dto;
                    } catch (Exception ex) {
                        throw new RuntimeException("Failed to parse vendor response: " + ex.getMessage(), ex);
                    }
                });
    }
}
