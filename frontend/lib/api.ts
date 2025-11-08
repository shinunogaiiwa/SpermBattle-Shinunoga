import type { Analysis, Battle, LeaderboardEntry } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export type LeaderboardCategory = "global" | "shame" | "gaming";

export const api = {
  uploadFile: async (file: File): Promise<Analysis> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient<Analysis>("/api/analysis/upload", {
      method: "POST",
      body: formData,
    });
  },

  getAnalysis: async (id: number): Promise<Analysis> => {
    return apiClient<Analysis>(`/api/analysis/${id}`);
  },

  getLeaderboard: async (
    category: LeaderboardCategory,
  ): Promise<LeaderboardEntry[]> => {
    return apiClient<LeaderboardEntry[]>(
      `/api/leaderboard?category=${category}`,
    );
  },

  createBattle: async (analysisId: number): Promise<Battle> => {
    return apiClient<Battle>("/api/battle", {
      method: "POST",
      body: JSON.stringify({ analysis_id: analysisId }),
    });
  },

  getBattle: async (battleId: number): Promise<Battle> => {
    return apiClient<Battle>(`/api/battle/${battleId}`);
  },
};

export { apiClient };

