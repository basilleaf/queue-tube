import type { QueueItem } from '@/src/types';

interface Props {
  item: QueueItem;
  isActive: boolean;
}

export function VideoCard({ item, isActive }: Props) {
  return (
    <div className={`relative flex gap-3 p-3 transition-colors ${
      isActive ? 'bg-fuchsia-50' : 'hover:bg-zinc-50'
    }`}>
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-fuchsia-500 rounded-r" />
      )}
      <img
        src={item.thumbnailUrl}
        alt={item.title}
        width={112}
        height={63}
        className="w-28 aspect-video rounded object-cover flex-shrink-0 bg-zinc-200"
      />
      <p className="text-sm font-medium text-zinc-800 line-clamp-2 self-center">{item.title}</p>
    </div>
  );
}
