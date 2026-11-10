import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  Image as ImageIcon,
  Smile,
  CheckCircle2,
  Phone,
  Video,
  Sparkles,
  Search,
  MessageCircle,
  Play,
  Pause
} from 'lucide-react';
import { Match, ChatMessage, Profile } from '../types/connection';
import { ICEBREAKER_SUGGESTIONS } from '../data/mockData';

interface ChatViewProps {
  matches: Match[];
  activeMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
  conversations: Record<string, ChatMessage[]>;
  onSendMessage: (matchId: string, text: string) => void;
  onSendAudioNote: (matchId: string, durationSec: number) => void;
  onToggleReaction: (matchId: string, messageId: string, emoji: string) => void;
  onOpenProfile: (profile: Profile) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  matches,
  activeMatchId,
  onSelectMatch,
  conversations,
  onSendMessage,
  onSendAudioNote,
  onToggleReaction,
  onOpenProfile,
}) => {
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isMatchTyping, setIsMatchTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMatch = matches.find((m) => m.id === activeMatchId) || matches[0];
  const currentMessages = activeMatch ? conversations[activeMatch.id] || [] : [];

  const filteredMatches = matches.filter((m) =>
    m.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.profile.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isMatchTyping]);

  // Audio recording simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatch) return;

    const sentText = inputText.trim();
    setInputText('');
    onSendMessage(activeMatch.id, sentText);

    // Simulate realistic typing and response from match after 2 seconds
    setIsMatchTyping(true);
    setTimeout(() => {
      setIsMatchTyping(false);
      const responses = [
        `Que demais isso! Concordo 100% com você.`,
        `Nossa, adorei sua perspectiva! Faz quanto tempo que você mora aqui em São Paulo?`,
        `Totalmente! A gente deveria marcar um café para trocar mais ideias sobre isso.`,
        `Que incrível! Adoro quando a sintonia acontece tão rápido na conversa.`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      onSendMessage(activeMatch.id, `[reply]:${randomResponse}`);
    }, 2400);
  };

  const handleFinishAudioRecord = () => {
    if (!activeMatch) return;
    setIsRecording(false);
    const duration = Math.max(3, recordSeconds);
    onSendAudioNote(activeMatch.id, duration);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-[780px] grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Column: Matches & Threads List (Cols 1-4) */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full bg-slate-50/50 dark:bg-slate-800/50">
          
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-rose-500" />
                <span>Conversas & Conexões</span>
              </h2>
              <span className="text-xs font-mono text-slate-500 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600">
                {matches.length}
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar conversa ou bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Matches Horizontal Ribbon */}
          <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Novas Conexões
            </div>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelectMatch(m.id)}
                  className="flex flex-col items-center gap-1 shrink-0 group"
                >
                  <div className={`relative w-12 h-12 rounded-full p-0.5 ${
                    activeMatchId === m.id
                      ? 'ring-2 ring-rose-500'
                      : 'hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600'
                  }`}>
                    <img
                      src={m.profile.avatarUrl}
                      alt={m.profile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                    {m.unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-[54px] truncate">
                    {m.profile.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Thread List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
            {filteredMatches.map((m) => {
              const isSelected = activeMatch?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMatch(m.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-rose-50/70 dark:bg-rose-950/20'
                      : 'hover:bg-white dark:hover:bg-slate-700/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={m.profile.avatarUrl}
                      alt={m.profile.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${
                      m.mode === 'romance' ? 'bg-rose-500' : m.mode === 'friendship' ? 'bg-amber-500' : 'bg-sky-500'
                    }`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {m.profile.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {m.lastMessageTime || m.matchedAt}
                      </span>
                    </div>

                    <p className={`text-xs truncate ${
                      m.unreadCount > 0
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {m.lastMessage || 'Vocês se conectaram! Mande um "olá"'}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                      <span>{m.profile.neighborhood}</span>
                      <span>·</span>
                      <span>{m.profile.baseAffinity}% sintonia</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Active Conversation Window (Cols 5-12) */}
        {activeMatch ? (
          <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900">
            
            {/* Chat Top Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div
                onClick={() => onOpenProfile(activeMatch.profile)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={activeMatch.profile.avatarUrl}
                  alt={activeMatch.profile.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                      {activeMatch.profile.name}, {activeMatch.profile.age}
                    </span>
                    {activeMatch.profile.verified && (
                      <CheckCircle2 className="w-4 h-4 text-sky-400 fill-current" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Online agora</span>
                    <span>·</span>
                    <span>{activeMatch.profile.neighborhood}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenProfile(activeMatch.profile)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Ver Perfil
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              
              {/* Match Header Announcement Banner */}
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Vocês têm {activeMatch.profile.baseAffinity}% de compatibilidade de valores</span>
                </div>
                <p className="text-xs text-slate-400">
                  {activeMatch.profile.answers[0]?.prompt}: "{activeMatch.profile.answers[0]?.answer}"
                </p>
              </div>

              {/* Message bubbles */}
              {currentMessages.map((msg) => {
                const isMe = msg.senderId === 'me';
                const displayText = msg.text?.startsWith('[reply]:') ? msg.text.replace('[reply]:', '') : msg.text;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                  >
                    <div
                      className={`max-w-[78%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-rose-500 text-white rounded-br-xs shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs'
                      }`}
                    >
                      {msg.audioSec ? (
                        <div className="flex items-center gap-2.5 py-1">
                          <button
                            onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                            className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center"
                          >
                            {playingAudioId === msg.id ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                          </button>
                          <div className="flex items-center gap-1 h-4">
                            {[40, 80, 50, 90, 70, 30, 85, 60, 95, 45].map((h, i) => (
                              <span
                                key={i}
                                style={{ height: `${h}%` }}
                                className="w-0.5 bg-white rounded-full"
                              />
                            ))}
                          </div>
                          <span className="font-mono text-xs opacity-90 tabular-nums">
                            0:0{msg.audioSec}
                          </span>
                        </div>
                      ) : (
                        <p>{displayText}</p>
                      )}
                    </div>

                    {/* Metadata & Reaction */}
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {msg.timestamp}
                      </span>
                      {msg.reaction && (
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 rounded-full px-1.5 py-0.5 shadow-xs">
                          {msg.reaction}
                        </span>
                      )}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {['❤️', '✨', '👏'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => onToggleReaction(activeMatch.id, msg.id, emoji)}
                            className="text-xs hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isMatchTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span>{activeMatch.profile.name.split(' ')[0]} está digitando...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Icebreakers Suggestions Bar */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span>Quebra-Gelo:</span>
              </span>
              {ICEBREAKER_SUGGESTIONS.slice(0, 2).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(item)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0 transition-colors"
                >
                  "{item}"
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              {isRecording ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 animate-pulse">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    <span>Gravando áudio... 00:{recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRecording(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white px-2 py-1"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishAudioRecord}
                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm"
                    >
                      Enviar Áudio
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRecording(true)}
                    title="Gravar nota de voz rápida"
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Conversar com ${activeMatch.profile.name.split(' ')[0]}...`}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-10 h-10 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-sm transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        ) : (
          <div className="md:col-span-8 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 text-slate-400">
            <MessageCircle className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Nenhuma conversa selecionada
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Escolha uma de suas conexões à esquerda para abrir a conversa ou explore novos perfis na aba Descobrir!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
