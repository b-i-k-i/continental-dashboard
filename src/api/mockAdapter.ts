// src/api/mockAdapter.ts
import mockData from './mockData.json';

export function initMockAdapter() {
  if (import.meta.env.PROD) return;

  const originalFetch = window.fetch;
  
  window.fetch = async (input, init) => {
    // Handle mock API routes
    if (typeof input === 'string' && input.startsWith('/api/')) {
      const endpoint = input.replace('/api/', '');
      
      if (endpoint === 'hotels') return mockResponse(mockData.hotels);
      if (endpoint === 'guests') return mockResponse(mockData.guests);
      
      return mockResponse({ error: 'Not found' }, 404);
    }
    
    // Fallback to original fetch
    return originalFetch(input, init);
  };

  function mockResponse(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}