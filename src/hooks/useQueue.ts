import { useState, useCallback } from 'react';
import type { QueueItem } from '@/src/types';
import { parseVideoId, fetchVideoTitle } from '@/src/utils/youtube';

export function useQueue() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);

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
    } finally {
      setIsAdding(false);
    }
  }, []);

  const removeVideo = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return { items, isAdding, addVideo, removeVideo };
}
