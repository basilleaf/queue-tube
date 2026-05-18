'use client';
import { UrlInput } from './UrlInput';
import { VideoCard } from './VideoCard';
import type { QueueItem } from '@/src/types';

interface Props {
  items: QueueItem[];
  isAdding: boolean;
  onAdd: (url: string) => Promise<void>;
}

export function QueuePanel({ items, isAdding, onAdd }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-zinc-100">
        <h2 className="text-sm font-semibold text-zinc-700">Queue</h2>
        {items.length > 0 && (
          <span className="text-xs text-zinc-400">
            {items.length} video{items.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <UrlInput onAdd={onAdd} isAdding={isAdding} />
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
        {items.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-400 text-center">
            Paste a YouTube URL above to get started
          </p>
        ) : (
          items.map(item => <VideoCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
