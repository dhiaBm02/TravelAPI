import axios from 'axios';
import { response } from 'express';

const apiKey = process.env.OW_API_KEY;

export const getWeatherData = async (destinationName: any) => {
  if (!apiKey) {
    console.error('API key not found');
    response.status(500).json({ error: 'Failed to fetch weather data' });
  }
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${destinationName}&units=metric&appid=${apiKey}`;
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    response.status(500).json({ error: 'Failed to fetch weather data' });
  }

};

