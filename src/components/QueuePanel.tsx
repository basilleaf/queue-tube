'use client';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { UrlInput } from './UrlInput';
import { VideoCard } from './VideoCard';
import type { QueueItem } from '@/src/types';

interface Props {
  items: QueueItem[];
  isAdding: boolean;
  currentIndex: number | null;
  onAdd: (url: string) => Promise<void>;
  onRemove: (id: string) => void;
  onPlay: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function QueuePanel({ items, isAdding, currentIndex, onAdd, onRemove, onPlay, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = items.findIndex(i => i.id === active.id);
    const toIndex = items.findIndex(i => i.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) onReorder(fromIndex, toIndex);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-zinc-100">
        <h2 className="text-sm font-semibold text-zinc-700">Queue</h2>
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">
              {items.length} video{items.length !== 1 ? 's' : ''}
            </span>
            <a
              href="/"
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Start over
            </a>
          </div>
        )}
      </div>
      <UrlInput onAdd={onAdd} isAdding={isAdding} />
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
        {items.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-400 text-center">
            Paste a YouTube URL above to get started
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((item, index) => (
                <VideoCard
                  key={item.id}
                  item={item}
                  isActive={index === currentIndex}
                  onDelete={() => onRemove(item.id)}
                  onPlay={() => onPlay(index)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
