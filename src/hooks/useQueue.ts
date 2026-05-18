import { useState, useCallback, useEffect, useRef } from 'react';
import type { QueueItem } from '@/src/types';
import { parseVideoId, fetchVideoTitle } from '@/src/utils/youtube';

function getVideoIdsFromUrl(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = new URLSearchParams(window.location.search).get('videos');
  return raw ? raw.split(',').filter(Boolean) : [];
}

function syncToUrl(items: QueueItem[]) {
  const params = new URLSearchParams(window.location.search);
  if (items.length === 0) {
    params.delete('videos');
  } else {
    params.set('videos', items.map(i => i.videoId).join(','));
  }
  const search = params.toString();
  window.history.replaceState(null, '', search ? `?${search}` : window.location.pathname);
}

export function useQueue() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Skip the first sync — it fires with [] before the init effect populates items from URL
  const skipSyncRef = useRef(1);

  useEffect(() => {
    const videoIds = getVideoIdsFromUrl();
    if (videoIds.length === 0) return;

    setItems(videoIds.map(videoId => ({
      id: crypto.randomUUID(),
      videoId,
      title: videoId,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    })));
    setCurrentIndex(0);

    videoIds.forEach((videoId, i) => {
      fetchVideoTitle(videoId).then(title => {
        setItems(prev => prev.map((item, idx) => idx === i ? { ...item, title } : item));
      });
    });
  }, []);

  useEffect(() => {
    if (skipSyncRef.current > 0) {
      skipSyncRef.current--;
      return;
    }
    syncToUrl(items);
  }, [items]);

  const addVideo = useCallback(async (url: string) => {
    const videoId = parseVideoId(url);
    if (!videoId) return;

    setIsAdding(true);
    try {
      const title = await fetchVideoTitle(videoId);
      setItems(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          videoId,
          title,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        },
      ]);
      // Set to 0 only if no video is currently indexed (first item added)
      setCurrentIndex(prev => prev ?? 0);
    } finally {
      setIsAdding(false);
    }
  }, []);

  const reorderVideos = useCallback((fromIndex: number, toIndex: number) => {
    setItems(prev => {
      const next = [...prev];
      next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
      return next;
    });
    setCurrentIndex(ci => {
      if (ci === null) return null;
      if (ci === fromIndex) return toIndex;
      if (fromIndex < ci && toIndex >= ci) return ci - 1;
      if (fromIndex > ci && toIndex <= ci) return ci + 1;
      return ci;
    });
  }, []);

  const removeVideo = useCallback((id: string) => {
    setItems(prev => {
      const idx = prev.findIndex(item => item.id === id);
      if (idx === -1) return prev;
      const next = prev.filter(item => item.id !== id);
      setCurrentIndex(ci => {
        if (ci === null || next.length === 0) return null;
        if (idx < ci) return ci - 1;   // deleted before current → shift down
        if (idx === ci) return Math.min(ci, next.length - 1); // deleted current → clamp
        return ci;                      // deleted after current → unchanged
      });
      return next;
    });
  }, []);

  return { items, isAdding, currentIndex, setCurrentIndex, addVideo, removeVideo, reorderVideos };
}
