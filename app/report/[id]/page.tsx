export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Analysis Report #{params.id}</h1>
      <div className="mt-8 space-y-4">
        <div>Title: [Loading...]</div>
        <div>Score: [Loading...]</div>
        <div>Radar Chart: [Coming soon]</div>
        <div>Annotated Image: [Coming soon]</div>
      </div>
    </main>
  );
}

