import type { QueueItem } from '@/src/types';

interface Props {
  item: QueueItem;
}

export function VideoCard({ item }: Props) {
  return (
    <div className="flex gap-3 p-3 hover:bg-zinc-50 transition-colors">
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
