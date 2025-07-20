

import { fetchMockApi } from "./client";

export const useMockApi = () => ({
  getHotels: () => fetchMockApi('hotels'),
  getGuests: () => fetchMockApi('guests')
});