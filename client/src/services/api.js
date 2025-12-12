import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:5001/api';

export const fetchWeather = async (city) => {
    try {
        const response = await axios.get(`${API_URL}/weather`, {
            params: { city }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error fetching weather data';
    }
};

export const fetchHistory = async () => {
    try {
        const response = await axios.get(`${API_URL}/history`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error fetching history';
    }
};
