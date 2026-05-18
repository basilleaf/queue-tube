'use client';
import { useQueue } from '@/src/hooks/useQueue';
import { QueuePanel } from '@/src/components/QueuePanel';

export default function Home() {
  const { items, isAdding, addVideo } = useQueue();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-zinc-950">
      <div className="flex items-center justify-center p-4 md:flex-1">
        <div className="w-full max-w-3xl aspect-video bg-zinc-900 rounded-xl flex items-center justify-center">
          <p className="text-zinc-500 text-sm">Player — step 2</p>
        </div>
      </div>
      <div className="flex-1 md:flex-none md:w-80 bg-white flex flex-col border-t md:border-t-0 md:border-l border-zinc-800">
        <QueuePanel items={items} isAdding={isAdding} onAdd={addVideo} />
      </div>
    </div>
  );
}
