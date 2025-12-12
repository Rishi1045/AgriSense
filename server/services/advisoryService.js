const rulesData = require('../data/agro_advisory_rules.json');

// Helper to evaluate a single condition
const evaluateCondition = (condition, context) => {
    const { var: variable, operator, value } = condition;
    const ctxValue = context[variable];

    // If context variable is missing/undefined, we interpret strict rules as false (not safe to trigger)
    // Or we could have distinct logic for missing data. For now, return false.
    if (ctxValue === undefined || ctxValue === null) return false;

    switch (operator) {
        case 'gt': return ctxValue > value;
        case 'lt': return ctxValue < value;
        case 'gte': return ctxValue >= value;
        case 'lte': return ctxValue <= value;
        case 'between': return ctxValue >= value[0] && ctxValue <= value[1];
        case 'eq': return ctxValue === value;
        default: return false;
    }
};

const getIconForType = (ruleIcon, type) => {
    // If rule has an explicit icon, use it. Otherwise default based on type.
    if (ruleIcon) return ruleIcon;

    switch (type) {
        case 'danger': return 'WarningCircle';
        case 'alert': return 'Warning';
        case 'warning': return 'Warning';
        case 'success': return 'CheckCircle';
        default: return 'Info';
    }
}

const mapSeverityToType = (severity) => {
    switch (severity) {
        case 'danger': return 'danger';
        case 'alert': return 'danger'; // Map alert to danger for red styling
        case 'warning': return 'warning';
        case 'info': return 'info'; // Default blue/slate
        default: return 'info';
    }
};

const generateAdvisories = (weatherData) => {
    const advisories = [];
    const current = weatherData.current;
    const forecast = weatherData.forecast;

    // 1. Prepare Context from Weather Data
    // We try to derive as many variables as possible from the API response

    // Rainfall: OWM gives rain['1h'] or rain['3h']. We approximate 24h rain if not available, 
    // or use forecast to sum up next 24h.
    let rainfall_mm = (current.rain && (current.rain['1h'] || current.rain['3h'])) || 0;
    // If we have forecast, let's sum up rain for the next 24 hours for better accuracy
    if (forecast && forecast.list) {
        rainfall_mm = forecast.list.slice(0, 8).reduce((acc, item) => {
            const rain = (item.rain && item.rain['3h']) || 0;
            return acc + rain;
        }, 0);
    }

    // 48h Rainfall
    let rainfall_48h_mm = 0;
    if (forecast && forecast.list) {
        rainfall_48h_mm = forecast.list.slice(0, 16).reduce((acc, item) => {
            const rain = (item.rain && item.rain['3h']) || 0;
            return acc + rain;
        }, 0);
    }

    const context = {
        temperature_c: current.main.temp,
        humidity_pct: current.main.humidity,
        wind_kmph: current.wind.speed * 3.6, // m/s to km/h
        rainfall_mm: rainfall_mm,
        rainfall_48h_mm: rainfall_48h_mm,
        visibility_km: current.visibility / 1000,
        prob_thunderstorm: 0, // Default 0
        soil_moisture_pct: 50, // Mock default (API doesn't provide free soil data)
        consecutive_rain_days: 0, // Hard to know from snapshot
        rain_expected_within_hours: rainfall_mm > 0 ? 0 : 24, // Rough logic
        days_to_harvest: 30, // Default safe value
    };

    // Check for thunderstorm code (2xx)
    const weatherId = current.weather[0].id;
    if (weatherId >= 200 && weatherId < 300) {
        context.prob_thunderstorm = 1.0;
    }

    // 2. Evaluate Rules
    rulesData.rules.forEach(rule => {
        // A rule triggers if ALL its conditions are met
        const isTriggered = rule.conditions.every(cond => evaluateCondition(cond, context));

        if (isTriggered) {
            advisories.push({
                type: mapSeverityToType(rule.severity),
                title: rule.title,
                message: rule.message,
                icon: rule.icon || 'Info'
            });
        }
    });

    // Fallback if no specific rules trigger (Generic "Good" condition)
    if (advisories.length === 0) {
        advisories.push({
            type: 'success',
            title: 'Conditions Stable',
            message: 'No critical weather alerts detected for now. Routine monitoring advised.',
            icon: 'Plant'
        });
    }

    return advisories;
};

module.exports = {
    generateAdvisories
};
