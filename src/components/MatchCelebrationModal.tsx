import React, { useState } from 'react';
import { Heart, Sparkles, Send, X } from 'lucide-react';
import { Profile } from '../types/connection';
import { ICEBREAKER_SUGGESTIONS } from '../data/mockData';

interface MatchCelebrationModalProps {
  matchedProfile: Profile | null;
  myAvatarUrl: string;
  onClose: () => void;
  onSendMessage: (profile: Profile, message: string) => void;
  onGoToChat: (profile: Profile) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  matchedProfile,
  myAvatarUrl,
  onClose,
  onSendMessage,
  onGoToChat,
}) => {
  const [message, setMessage] = useState('');

  if (!matchedProfile) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(matchedProfile, message.trim());
    setMessage('');
    onGoToChat(matchedProfile);
  };

  const handlePickIcebreaker = (icebreaker: string) => {
    setMessage(icebreaker);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Tagline */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sintonia confirmada ({matchedProfile.baseAffinity}%)</span>
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Deu Conexão! 🎉
        </h2>
        
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
          Você e <strong className="text-slate-900 dark:text-white">{matchedProfile.name}</strong> demonstraram interesse mútuo. Que tal quebrar o gelo com uma pergunta autêntica?
        </p>

        {/* Avatar Pair */}
        <div className="flex items-center justify-center -space-x-4 mb-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-lg">
            <img
              src={myAvatarUrl}
              alt="Você"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="z-10 w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md animate-bounce">
            <Heart className="w-5 h-5 fill-current" />
          </div>

          <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-lg">
            <img
              src={matchedProfile.avatarUrl}
              alt={matchedProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Icebreaker Suggestions */}
        <div className="text-left mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
            Sugestões para Iniciar a Conversa
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {ICEBREAKER_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePickIcebreaker(item)}
                className="w-full text-left p-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
              >
                "{item}"
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Escreva algo simpático para ${matchedProfile.name.split(' ')[0]}...`}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="absolute right-2 top-2 bottom-2 px-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Continuar Descobrindo
            </button>
            <button
              type="button"
              onClick={() => onGoToChat(matchedProfile)}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:opacity-90 transition-opacity"
            >
              Abrir Conversa Agora
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
