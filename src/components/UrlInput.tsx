'use client';
import { useState, useRef } from 'react';

interface Props {
  onAdd: (url: string) => Promise<void>;
  isAdding: boolean;
}

export function UrlInput({ onAdd, isAdding }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed || isAdding) return;
    await onAdd(trimmed);
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex gap-2 p-3 border-b border-zinc-100">
      <input
        ref={inputRef}
        autoFocus
        type="url"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
        placeholder="Paste YouTube URL…"
        disabled={isAdding}
        className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-50"
      />
      <button
        onClick={handleSubmit}
        disabled={isAdding || !value.trim()}
        className="min-w-[60px] rounded-md bg-fuchsia-500 px-3 py-2 text-sm font-semibold text-white hover:bg-fuchsia-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
      >
        {isAdding ? (
          <>
            <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Adding
          </>
        ) : 'Add'}
      </button>
    </div>
  );
}
