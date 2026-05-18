'use client';
import { useRef, useEffect, useCallback } from 'react';
import { useQueue } from '@/src/hooks/useQueue';
import { useYouTubePlayer } from '@/src/hooks/useYouTubePlayer';
import { Player } from '@/src/components/Player';
import { QueuePanel } from '@/src/components/QueuePanel';

const PLAYER_ID = 'yt-player';

export default function Home() {
  const { items, isAdding, currentIndex, setCurrentIndex, addVideo, removeVideo, reorderVideos } = useQueue();

  // Refs so the onEnd callback always sees fresh values without needing to be recreated
  const itemsRef = useRef(items);
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  // loadVideo is returned by the hook below; we forward it through a ref so
  // handleEnd can call it without creating a circular dependency.
  const loadVideoRef = useRef<(id: string) => void>(() => {});

  const handleEnd = useCallback(() => {
    if (itemsRef.current.length === 0) return;
    const next = ((currentIndexRef.current ?? -1) + 1) % itemsRef.current.length;
    setCurrentIndex(next);
    loadVideoRef.current(itemsRef.current[next].videoId);
  }, [setCurrentIndex]);

  const { cueVideo, loadVideo } = useYouTubePlayer(PLAYER_ID, handleEnd);
  useEffect(() => { loadVideoRef.current = loadVideo; }, [loadVideo]);

  const handlePlay = useCallback((index: number) => {
    const item = itemsRef.current[index];
    if (!item) return;
    setCurrentIndex(index);
    loadVideoRef.current(item.videoId);
  }, [setCurrentIndex]);

  // Cue the first video exactly once: when currentIndex transitions null → 0
  const prevIndexRef = useRef<number | null>(null);
  useEffect(() => {
    if (currentIndex === 0 && prevIndexRef.current === null && items[0]) {
      cueVideo(items[0].videoId);
    }
    prevIndexRef.current = currentIndex;
  }, [currentIndex, items, cueVideo]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-zinc-950">
      <div className="flex items-center justify-center p-4 md:flex-1">
        <Player id={PLAYER_ID} />
      </div>
      <div className="flex-1 md:flex-none md:w-80 bg-white flex flex-col border-t md:border-t-0 md:border-l border-zinc-800">
        <QueuePanel
          items={items}
          isAdding={isAdding}
          currentIndex={currentIndex}
          onAdd={addVideo}
          onRemove={removeVideo}
          onPlay={handlePlay}
          onReorder={reorderVideos}
        />
      </div>
    </div>
  );
}
