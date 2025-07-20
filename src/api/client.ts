export const fetchMockApi = async <T>(endpoint: string): Promise<T> => {
  const res = await fetch(`/api/${endpoint}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};