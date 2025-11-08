export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">SpermWars</h1>
      <p className="mt-4">
        Your sperm might be garbage, but at least it can game!
      </p>
      <a
        href="/upload"
        className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded"
      >
        Start Analysis
      </a>
    </main>
  );
}
