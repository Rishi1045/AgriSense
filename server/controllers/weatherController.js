const weatherService = require('../services/weatherService');
const advisoryService = require('../services/advisoryService');
const SearchHistory = require('../models/SearchHistory');

const getWeather = async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ message: 'City parameter is required' });
    }

    try {
        const weatherData = await weatherService.fetchWeatherData(city);
        const advisories = advisoryService.generateAdvisories(weatherData);

        // Save search to history
        const historyItem = new SearchHistory({
            city: weatherData.current.name,
            country: weatherData.current.sys.country,
            temp: weatherData.current.main.temp,
            condition: weatherData.current.weather[0].main,
        });
        await historyItem.save();

        res.json({
            weather: weatherData.current,
            forecast: weatherData.forecast,
            advisories
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

module.exports = {
    getWeather
};
