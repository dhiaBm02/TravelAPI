import { response } from 'express';

const apiKey = process.env.CSC_API_KEY;

export const getCountryData = async (countryCode: any) => {
  if (!apiKey) {
    console.error('API key not found');
    response.status(500).json({ error: 'Failed to fetch country data' });
  }
  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", apiKey!);

  var requestOptions: RequestInit = {
    method: 'GET',
    headers: headers,
    redirect: 'follow' as RequestRedirect
  };
  try {
    const apiUrl = `https://api.countrystatecity.in/v1/countries/${countryCode}`;
    const response = fetch(apiUrl, requestOptions);
    return (await response).json();
  } catch (error) {
    console.error('Error fetching country data:', error);
    response.status(500).json({ error: 'Failed to fetch country data' });
  }
};

