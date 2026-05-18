import type { QueueItem } from '@/src/types';

interface Props {
  item: QueueItem;
  isActive: boolean;
  onDelete: () => void;
  onPlay: () => void;
}

export function VideoCard({ item, isActive, onDelete, onPlay }: Props) {
  return (
    <div className={`relative flex gap-3 p-3 transition-colors group ${
      isActive ? 'bg-fuchsia-50' : 'hover:bg-zinc-50'
    }`}>
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-fuchsia-500 rounded-r" />
      )}
      <div className="relative w-28 aspect-video flex-shrink-0">
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          width={112}
          height={63}
          className="w-full h-full rounded object-cover bg-zinc-200"
        />
        <button
          onClick={onPlay}
          aria-label={`Play ${item.title}`}
          className="absolute inset-0 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-zinc-900 text-sm pl-0.5">
            ▶
          </span>
        </button>
      </div>
      <p className="text-sm font-medium text-zinc-800 line-clamp-2 self-center pr-6">{item.title}</p>
      <button
        onClick={onDelete}
        aria-label="Remove from queue"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-full bg-zinc-200 hover:bg-zinc-300 flex items-center justify-center text-zinc-500 hover:text-zinc-700 text-xs leading-none"
      >
        ×
      </button>
    </div>
  );
}
