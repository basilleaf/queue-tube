import { useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

export function useYouTubePlayer(playerId: string, onEnd: () => void) {
  const playerRef = useRef<YT.Player | null>(null);
  const onEndRef = useRef(onEnd);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  // Stores a videoId to cue once the player is ready (handles race between
  // API load and first video being added to the queue).
  const pendingCueRef = useRef<string | null>(null);

  useEffect(() => {
    const init = () => {
      const el = document.getElementById(playerId);
      if (!el) return;
      playerRef.current = new window.YT.Player(playerId, {
        width: '100%',
        height: '100%',
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            if (pendingCueRef.current) {
              playerRef.current?.cueVideoById(pendingCueRef.current);
              pendingCueRef.current = null;
            }
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) onEndRef.current();
          },
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        init();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [playerId]);

  const cueVideo = useCallback((videoId: string) => {
    if (playerRef.current) {
      playerRef.current.cueVideoById(videoId);
    } else {
      pendingCueRef.current = videoId;
    }
  }, []);

  const loadVideo = useCallback((videoId: string) => {
    playerRef.current?.loadVideoById(videoId);
  }, []);

  return { cueVideo, loadVideo };
}
