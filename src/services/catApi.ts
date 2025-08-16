const API_CONFIG = {
  apiKey: import.meta.env.VITE_CAT_API_KEY,
  baseUrl: "https://api.thecatapi.com/v1",
} as const;

type ApiParams = Record<string, string | number | boolean | null | undefined>;

const buildUrl = (endpoint: string, params: ApiParams = {}) => {
  const url = new URL(`${API_CONFIG.baseUrl}${endpoint}`);

  // always add API key
  url.searchParams.set("api_key", API_CONFIG.apiKey);

  // add other params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value.toString());
    }
  });

  return url.toString();
};

const apiRequest = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const catApi = {
  getRandomCats: (limit = 10, page = 0) =>
    apiRequest(buildUrl("/images/search", { limit, page, has_breeds: 1 })),

  getBreeds: () => apiRequest(buildUrl("/breeds")),

  getBreedImages: (breedId: string, limit = 12) =>
    apiRequest(buildUrl("/images/search", { breed_ids: breedId, limit })),

  getCatById: (id: string) => apiRequest(buildUrl(`/images/${id}`)),
};
