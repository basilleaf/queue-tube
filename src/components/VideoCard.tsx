'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { QueueItem } from '@/src/types';

interface Props {
  item: QueueItem;
  isActive: boolean;
  onDelete: () => void;
  onPlay: () => void;
}

export function VideoCard({ item, isActive, onDelete, onPlay }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className={`relative flex items-center gap-2 p-3 transition-colors group ${
        isActive ? 'bg-fuchsia-50' : 'hover:bg-zinc-50'
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-fuchsia-500 rounded-r" />
      )}

      {/* drag handle */}
      <button
        {...listeners}
        {...attributes}
        className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none text-zinc-300 hover:text-zinc-400"
        aria-label="Drag to reorder"
      >
        <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
          <circle cx="4"  cy="3"  r="1.4" />
          <circle cx="4"  cy="8"  r="1.4" />
          <circle cx="4"  cy="13" r="1.4" />
          <circle cx="8"  cy="3"  r="1.4" />
          <circle cx="8"  cy="8"  r="1.4" />
          <circle cx="8"  cy="13" r="1.4" />
        </svg>
      </button>

      {/* thumbnail + play overlay */}
      <div className="relative w-24 aspect-video flex-shrink-0">
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          width={96}
          height={54}
          className="w-full h-full rounded object-cover bg-zinc-200"
        />
        <button
          onClick={onPlay}
          aria-label={`Play ${item.title}`}
          className="absolute inset-0 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-zinc-900 text-xs pl-0.5">
            ▶
          </span>
        </button>
      </div>

      <p className="text-sm font-medium text-zinc-800 line-clamp-2 flex-1 pr-6">{item.title}</p>

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
