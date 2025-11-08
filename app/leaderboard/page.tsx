'use client';

import { useState } from "react";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"global" | "shame" | "gaming">("global");

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Leaderboards</h1>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => setTab("global")}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          🏆 Global
        </button>
        <button
          onClick={() => setTab("shame")}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          😂 Hall of Shame
        </button>
        <button
          onClick={() => setTab("gaming")}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          🎮 Gaming
        </button>
      </div>

      <div className="mt-8">
        <p>Tab: {tab}</p>
        <p>[Leaderboard table coming soon]</p>
      </div>
    </main>
  );
}

