package com.example.weather.controller;

import com.example.weather.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class WeatherController {

    private final WeatherService service;

    public WeatherController(WeatherService service) {
        this.service = service;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/weather")
    public Mono<ResponseEntity<Object>> getWeather(@RequestParam(name = "city") String city) {
        if (city == null || city.trim().isEmpty()) {
            return Mono.just(
                    ResponseEntity.badRequest()
                            .body((Object) Map.of("error", "Missing 'city' parameter"))
            );
        }

        return service.getWeatherForCity(city)
                .map(dto -> ResponseEntity.ok()
                        .body((Object) Map.of(
                                "cached", false,
                                "source", "openweathermap",
                                "data", dto
                        )))
                .onErrorResume(ex ->
                        Mono.just(
                                ResponseEntity.status(500)
                                        .body((Object) Map.of("error", ex.getMessage()))
                        )
                );
    }
}