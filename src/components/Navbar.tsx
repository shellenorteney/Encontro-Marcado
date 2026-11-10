import React from 'react';
import { Sparkles, Compass, MapPin, Calendar, MessageCircleHeart, Award, Sun, Moon, User } from 'lucide-react';

interface NavbarProps {
  activeTab: 'discover' | 'radar' | 'events' | 'chat' | 'quiz';
  onSelectTab: (tab: 'discover' | 'radar' | 'events' | 'chat' | 'quiz') => void;
  unreadCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  unreadCount,
  darkMode,
  onToggleDarkMode,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('discover')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Encontre sua Conexão
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('discover')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'discover'
                ? 'text-rose-600 dark:text-rose-400 font-semibold border-b-2 border-rose-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Descobrir</span>
          </button>

          <button
            onClick={() => onSelectTab('radar')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'radar'
                ? 'text-rose-600 dark:text-rose-400 font-semibold border-b-2 border-rose-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Radar & Locais</span>
          </button>

          <button
            onClick={() => onSelectTab('events')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'events'
                ? 'text-rose-600 dark:text-rose-400 font-semibold border-b-2 border-rose-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Eventos & Rodas</span>
          </button>

          <button
            onClick={() => onSelectTab('chat')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'chat'
                ? 'text-rose-600 dark:text-rose-400 font-semibold border-b-2 border-rose-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageCircleHeart className="w-4 h-4" />
            <span>Conversas</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('quiz')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'quiz'
                ? 'text-rose-600 dark:text-rose-400 font-semibold border-b-2 border-rose-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Teste de Sintonia</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action + utility */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            aria-label="Alternar tema claro e escuro"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <User className="w-3.5 h-3.5" />
            <span>Meu Perfil</span>
          </button>
        </div>

      </div>
    </header>
  );
};
