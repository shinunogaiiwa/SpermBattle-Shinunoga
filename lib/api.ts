const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Specific API functions (will be implemented later)
export const api = {
  uploadFile: async (file: File) => {
    // TODO: Implement
    console.log("Upload:", file.name);
  },

  getAnalysis: async (id: number) => {
    // TODO: Implement
    console.log("Get analysis:", id);
  },

  getLeaderboard: async (type: "global" | "shame" | "gaming") => {
    // TODO: Implement
    console.log("Get leaderboard:", type);
  },
};

