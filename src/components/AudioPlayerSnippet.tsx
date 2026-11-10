import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { VoicePrompt } from '../types/connection';

interface AudioPlayerSnippetProps {
  voicePrompt: VoicePrompt;
}

export const AudioPlayerSnippet: React.FC<AudioPlayerSnippetProps> = ({ voicePrompt }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= voicePrompt.durationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, voicePrompt.durationSec]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700/80 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <Volume2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Áudio de Apresentação</span>
        </div>
        <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
          00:{progress < 10 ? `0${progress}` : progress} / 00:{voicePrompt.durationSec < 10 ? `0${voicePrompt.durationSec}` : voicePrompt.durationSec}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausar áudio' : 'Ouvir áudio de introdução'}
          className="w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white flex items-center justify-center shrink-0 shadow-sm transition-all"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
        </button>

        {/* Waveform graphic */}
        <div className="flex-1 flex items-center gap-1 h-6">
          {[40, 75, 55, 90, 65, 30, 85, 100, 70, 50, 80, 60, 45, 95, 70, 40, 85, 60].map((h, i) => {
            const barFraction = i / 18;
            const currentFraction = progress / (voicePrompt.durationSec || 1);
            const isFilled = currentFraction >= barFraction;
            return (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-rose-500 dark:bg-rose-400'
                    : 'bg-slate-200 dark:bg-slate-700'
                } ${isPlaying ? 'animate-pulse' : ''}`}
              />
            );
          })}
        </div>
      </div>

      <p className="mt-2 text-xs italic text-slate-600 dark:text-slate-400 line-clamp-2">
        "{voicePrompt.transcript}"
      </p>
    </div>
  );
};
