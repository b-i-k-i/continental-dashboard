// src/api/useApi.ts
import type { Hotel, Guest } from '../types';

export const useMockApi = () => {
  const getHotels = async (): Promise<Hotel[]> => {
    const response = await fetch('/api/hotels');
    if (!response.ok) throw new Error('Failed to fetch hotels');
    return response.json() as Promise<Hotel[]>;
  };

  const getGuests = async (): Promise<Guest[]> => {
    const response = await fetch('/api/guests');
    if (!response.ok) throw new Error('Failed to fetch guests');
    return response.json() as Promise<Guest[]>;
  };

  return { getHotels, getGuests };
};