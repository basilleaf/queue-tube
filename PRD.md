# QueueTube — Product Requirements

## Problem

A simple, no-friction way to queue YouTube videos for continuous unattended playback.

## Users

Single user. MVP is local/session only — no accounts required.

## MVP Features

### Adding Videos to a Queue

- User pastes a YouTube URL into a text field and presses Enter or clicks Add
- Video is appended to the queue list
- Text field clears and refocuses immediately
- Queue displays as a list of titles/thumbnails, not individual players
- User can also click any video in the queue to start the queue at that video

### Autoplay queue

- User hits play on the first video; the rest play automatically in order
- No interaction required after starting the first video
- When a video ends, the next video ID is loaded into the same player via `loadVideoById()`
- when the last video ends, it should start the queue over at the first video

## UI Layout

- Single YouTube player on the left (or top on mobile)
- Queue list on the right (or below on mobile) showing all videos
- Currently playing video is highlighted in the queue
- URL input field at the bottom or top of the queue panel

## Playback Model

- One player instance is used for all videos
- When a video ends, the next video in the queue loads into the
  same player automatically (no page interaction required)
- This means fullscreen works seamlessly across the whole queue —
  the player never unmounts between videos
- Active video is tracked by index in the queue

### Delete

- Small delete button on each video card
- Removes that video from the queue immediately
- No confirmation needed

### Drag to reorder

- Drag-to-reorder the queue (grab handle on each card)

### URL-based persistence

- Queue state is stored in the URL as a query parameter: `?videos=ID1,ID2,ID3`
- URL updates automatically as videos are added or removed
- On page load, video IDs are parsed from the URL and queue is restored
- Titles and thumbnails are fetched async via oEmbed on load — thumbnails
  appear immediately (no fetch needed), titles load in shortly after
- No localStorage required
- Queue links are inherently shareable and bookmarkable

## Out of Scope (MVP)

- Auth / accounts
- Saving named playlists
- Shareable links

## Acceptance Criteria

- Submit a URL → video appears in queue, input clears and focuses
- Play first video → subsequent videos play automatically with no interaction
- Delete a video → removed from queue and localStorage immediately
- Drag-to-reorder (grab handle on each card)
- Click any video in queue to start at that video
- Refresh page → queue is restored from URL params
- Share/bookmark the URL → recipient sees the same queue

## Phase 2

- Auth + saved playlists with shareable public links

## Build Order

- [x] Queue display — URL input → adds to list → renders queue panel with thumbnails
- [x] Autoplay — when video ends, next player starts automatically
- [x] Delete — remove individual videos from queue
- [x] Drag-to-reorder (grab handle on each card)
- [x] Persistence + shareability — queue state lives in URL params, restored on page load
