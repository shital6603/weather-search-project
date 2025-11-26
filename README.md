# Weather Search (Java Spring Boot backend + React frontend)

Overview:
- Backend: Java Spring Boot (REST) — proxies OpenWeatherMap current weather API
- Frontend: React single-page app (search weather by city)
- Caching: Caffeine (TTL + max entries)


Setup:
1) Get OpenWeatherMap API key: https://openweathermap.org/appid

2) Backend:
cd backend
export OPENWEATHERMAP_KEY=your_key_here
mvn clean package
java -jar target/weather-backend-1.0.0.jar

3) Frontend:
cd frontend
npm install
npm start

API:
GET /api/weather?city={name}

