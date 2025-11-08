export default function BattlePage({
  params,
}: {
  params: { battleId: string };
}) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">⚔️ Battle Arena</h1>
      <div className="mt-8">
        <p>Battle ID: {params.battleId}</p>
        <p>[PK battle coming soon]</p>
      </div>
    </main>
  );
}

