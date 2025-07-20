// netlify/functions/api-proxy.ts
import type { Handler } from '@netlify/functions';
import mockData from '../../src/api/mockData.json';

const validEndpoints = ['hotels', 'guests'] as const;
type Endpoint = typeof validEndpoints[number];

export const handler: Handler = async (event) => {
  // 1. Authentication
  const apiKey = event.headers['x-api-key'];
  if (apiKey !== process.env.VITE_API_KEY) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  // 2. Endpoint Validation
  const endpoint = event.path.split('/').pop() as Endpoint;
  if (!validEndpoints.includes(endpoint)) {
    return { statusCode: 404, body: 'Invalid endpoint' };
  }

  // 3. Data Processing
  const responseData = {
    hotels: mockData.hotels.map(h => ({ 
      id: h.id, 
      name: h.name,
      location: h.location
    })),
    guests: mockData.guests
  }[endpoint];

  // 4. Response
  return {
    statusCode: 200,
    headers: { 
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': '100'
    },
    body: JSON.stringify(responseData)
  };
};