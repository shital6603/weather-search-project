package com.example.weather.dto;

import java.util.Map;

public class WeatherResponseDto {
    public String provider = "openweathermap";
    public Long id;
    public String name;
    public String country;
    public Map<String, Object> coord;
    public Object weather;
    public Map<String, Object> main;
    public Map<String, Object> wind;
    public Map<String, Object> clouds;
    public Integer visibility;
    public Long dt;
    public Long sunrise;
    public Long sunset;
    public Integer timezone;
    public Object raw;
}
