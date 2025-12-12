const axios = require('axios');

const fetchWeatherData = async (city) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const [weatherRes, forecastRes] = await Promise.all([
            axios.get(weatherUrl),
            axios.get(forecastUrl)
        ]);

        return {
            current: weatherRes.data,
            forecast: forecastRes.data
        };
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        if (error.response) {
            console.error("API Response Status:", error.response.status);
            console.error("API Response Data:", JSON.stringify(error.response.data));
        }
        const keyStatus = apiKey ? `Present (starts with ${apiKey.substring(0, 4)})` : 'Missing';
        console.error(`API Key Status: ${keyStatus}`);

        throw new Error(error.response?.data?.message || 'City not found or API error');
    }
};

module.exports = {
    fetchWeatherData
};
