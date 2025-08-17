import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { catApi } from "./catApi";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Cat API", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("buildUrl", () => {
    it("should build URL with base endpoint and API key", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ test: "data" }),
      });

      await catApi.getBreeds();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.thecatapi.com/v1/breeds?api_key=test-api-key-123"
      );
    });

    it("should build URL with parameters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ test: "data" }),
      });

      await catApi.getRandomCats(5, 2);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.thecatapi.com/v1/images/search?api_key=test-api-key-123&limit=5&page=2&has_breeds=1"
      );
    });

    it("should handle null and undefined parameters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ test: "data" }),
      });

      await catApi.getBreedImages("persian", 0); // 0 should be included

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.thecatapi.com/v1/images/search?api_key=test-api-key-123&breed_ids=persian&limit=0"
      );
    });

    it("should handle boolean parameters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ test: "data" }),
      });

      await catApi.getRandomCats(); // uses has_breeds: 1

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain("has_breeds=1");
    });

    it("should return JSON data on successful response", async () => {
      const mockData = { id: "1", name: "Test Cat" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await catApi.getBreeds();

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should throw error on failed response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(catApi.getBreeds()).rejects.toThrow(
        "API Error: 404 Not Found"
      );
    });
  });

  describe("getRandomCats", () => {
    it("should call with default parameters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await catApi.getRandomCats();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.thecatapi.com/v1/images/search?api_key=test-api-key-123&limit=10&page=0&has_breeds=1"
      );
    });

    it("should call with custom parameters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await catApi.getRandomCats(20, 1);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.thecatapi.com/v1/images/search?api_key=test-api-key-123&limit=20&page=1&has_breeds=1"
      );
    });
  });

  describe("getBreeds", () => {
    it("should call breeds endpoint", async () => {
      const mockBreeds = [
        { id: "1", name: "Persian" },
        { id: "2", name: "Siamese" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBreeds,
      });

      const result = await catApi.getBreeds();

      expect(result).toEqual(mockBreeds);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.thecatapi.com/v1/breeds?api_key=test-api-key-123"
      );
    });
  });

  describe("getBreedImages", () => {
    it("should call with breed ID and default limit", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await catApi.getBreedImages("persian");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.thecatapi.com/v1/images/search?api_key=test-api-key-123&breed_ids=persian&limit=12"
      );
    });

    it("should call with custom limit", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await catApi.getBreedImages("siamese", 5);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.thecatapi.com/v1/images/search?api_key=test-api-key-123&breed_ids=siamese&limit=5"
      );
    });
  });

  describe("getCatById", () => {
    it("should call with cat ID", async () => {
      const mockCat = { id: "abc123", url: "https://example.com/cat.jpg" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCat,
      });

      const result = await catApi.getCatById("abc123");

      expect(result).toEqual(mockCat);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.thecatapi.com/v1/images/abc123?api_key=test-api-key-123"
      );
    });

    it("should handle special characters in ID", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "test-id-123" }),
      });

      await catApi.getCatById("test-id-123");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.thecatapi.com/v1/images/test-id-123?api_key=test-api-key-123"
      );
    });
  });

  describe("Error handling", () => {
    it("should handle 500 Server Error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(catApi.getBreeds()).rejects.toThrow(
        "API Error: 500 Internal Server Error"
      );
    });
  });
});
