import Board from '@/components/Board/Board';

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">FlowBoard</h1>

      </header>

      <Board />
    </main>
  );
}
