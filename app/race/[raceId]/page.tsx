export default function RacePage({ params }: { params: { raceId: string } }) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">🏁 Sperm Battle Royale</h1>
      <div className="mt-8">
        <p>Race ID: {params.raceId}</p>
        <p>[Racing game coming soon]</p>
      </div>
    </main>
  );
}

