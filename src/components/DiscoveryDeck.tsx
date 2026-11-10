import React, { useState } from 'react';
import {
  Heart,
  X,
  Star,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Sparkles,
  Music,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { Profile, ConnectionMode } from '../types/connection';
import { AudioPlayerSnippet } from './AudioPlayerSnippet';

interface DiscoveryDeckProps {
  profiles: Profile[];
  selectedMode: ConnectionMode;
  onSelectMode: (mode: ConnectionMode) => void;
  onLike: (profile: Profile) => void;
  onSuperLike: (profile: Profile) => void;
  onPass: (profile: Profile) => void;
  onDirectIcebreaker: (profile: Profile, message: string) => void;
  onResetDeck: () => void;
  onOpenQuiz: () => void;
}

export const DiscoveryDeck: React.FC<DiscoveryDeckProps> = ({
  profiles,
  selectedMode,
  onSelectMode,
  onLike,
  onSuperLike,
  onPass,
  onDirectIcebreaker,
  onResetDeck,
  onOpenQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIcebreakerInput, setShowIcebreakerInput] = useState(false);
  const [customIcebreaker, setCustomIcebreaker] = useState('');

  // Filter profiles by current mode if not 'all'
  const filteredProfiles = profiles.filter((p) => {
    if (selectedMode === 'all') return true;
    return p.mode === selectedMode;
  });

  const currentProfile = filteredProfiles[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(filteredProfiles.length);
    }
  };

  const handlePass = () => {
    if (!currentProfile) return;
    onPass(currentProfile);
    handleNext();
  };

  const handleLike = () => {
    if (!currentProfile) return;
    onLike(currentProfile);
    handleNext();
  };

  const handleSuperLike = () => {
    if (!currentProfile) return;
    onSuperLike(currentProfile);
    handleNext();
  };

  const handleSendIcebreaker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIcebreaker.trim() || !currentProfile) return;
    onDirectIcebreaker(currentProfile, customIcebreaker.trim());
    setCustomIcebreaker('');
    setShowIcebreakerInput(false);
    handleNext();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      
      {/* Intention / Mode Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Descobrir Conexões
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conexões reais baseadas em interesses, valores e estilo de vida.
          </p>
        </div>

        {/* Mode selector buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              onSelectMode('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedMode === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Todos ✨
          </button>
          <button
            onClick={() => {
              onSelectMode('romance');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedMode === 'romance'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Romance 💫
          </button>
          <button
            onClick={() => {
              onSelectMode('friendship');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedMode === 'friendship'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Amizade 🤝
          </button>
          <button
            onClick={() => {
              onSelectMode('networking');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedMode === 'networking'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Networking 🚀
          </button>
        </div>
      </div>

      {/* Main Deck Container */}
      {!currentProfile ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 border border-slate-200 dark:border-slate-700 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Você viu todos os perfis por enquanto!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Novas conexões chegam todos os dias. Você pode reiniciar os perfis ou fazer nosso Quiz de Sintonia para refinar a compatibilidade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                onResetDeck();
                setCurrentIndex(0);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ver Perfis Novamente</span>
            </button>
            <button
              onClick={onOpenQuiz}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Calcular Sintonia no Quiz</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Card Left / Visual & Primary Bio (Cols 1-7) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
            
            {/* Image Header with Scrim and Badges */}
            <div className="relative aspect-[4/4] sm:aspect-[4/3] w-full bg-slate-900 overflow-hidden">
              <img
                src={currentProfile.avatarUrl}
                alt={currentProfile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              
              {/* Gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

              {/* Top floating chips */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {currentProfile.mode === 'romance' && 'Buscando Romance'}
                  {currentProfile.mode === 'friendship' && 'Buscando Amizade'}
                  {currentProfile.mode === 'networking' && 'Buscando Networking'}
                </span>

                <div className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentProfile.baseAffinity}% Sintonia</span>
                </div>
              </div>

              {/* Bottom photo info */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  {currentProfile.verified && (
                    <CheckCircle2 className="w-5 h-5 text-sky-400 fill-current" />
                  )}
                  <span className="text-xs text-white/80 font-normal">
                    ({currentProfile.pronouns})
                  </span>
                </div>
                
                <p className="text-sm text-white/90 font-medium mt-0.5">
                  {currentProfile.headline}
                </p>

                <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{currentProfile.neighborhood}, {currentProfile.city}</span>
                  <span aria-hidden="true">·</span>
                  <span>A {currentProfile.distanceKm} km de você</span>
                </div>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 space-y-5">
              
              {/* Bio */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Sobre Mim
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {currentProfile.bio}
                </p>
              </div>

              {/* Audio Prompt if exists */}
              {currentProfile.voicePrompt && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    {currentProfile.voicePrompt.title}
                  </h3>
                  <AudioPlayerSnippet voicePrompt={currentProfile.voicePrompt} />
                </div>
              )}

              {/* Passions / Tags (clean unboxed or subtle tag pill) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Paixões & Afinidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.passions.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spotify integration */}
              {currentProfile.spotifyTrack && (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      Música no Repeat
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentProfile.spotifyTrack.title} — {currentProfile.spotifyTrack.artist}
                    </div>
                  </div>
                </div>
              )}

              {/* Prompt Answers */}
              <div className="space-y-3 pt-2">
                {currentProfile.answers.map((ans, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="text-xs font-bold text-rose-500 dark:text-rose-400 mb-1">
                      {ans.prompt}
                    </div>
                    <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {ans.answer}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Right Column / Actions & Deep Compatibility (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Action Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-center mb-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Perfil {currentIndex + 1} de {filteredProfiles.length}
                </span>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all"
                    style={{
                      width: `${((currentIndex + 1) / filteredProfiles.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Big tactile buttons */}
              <div className="flex items-center justify-center gap-4 py-2">
                {/* Pass button */}
                <button
                  onClick={handlePass}
                  title="Passar perfil"
                  className="w-14 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <X className="w-6 h-6 stroke-[2.5]" />
                </button>

                {/* Super Like */}
                <button
                  onClick={handleSuperLike}
                  title="Super Conexão"
                  className="w-12 h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>

                {/* Send Direct Message / Icebreaker */}
                <button
                  onClick={() => setShowIcebreakerInput(!showIcebreakerInput)}
                  title="Enviar Quebra-gelo"
                  className="w-12 h-12 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-500 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>

                {/* Connect / Like */}
                <button
                  onClick={handleLike}
                  title="Conectar"
                  className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/25"
                >
                  <Heart className="w-7 h-7 fill-current" />
                </button>
              </div>

              {/* Direct Icebreaker drawer / form */}
              {showIcebreakerInput && (
                <form onSubmit={handleSendIcebreaker} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mandar Quebra-Gelo Direto para {currentProfile.name.split(' ')[0]}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customIcebreaker}
                      onChange={(e) => setCustomIcebreaker(e.target.value)}
                      placeholder="Ex: Vi que você curte cerâmica! Onde costuma praticar?"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 pr-16"
                    />
                    <button
                      type="submit"
                      disabled={!customIcebreaker.trim()}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-rose-500 disabled:opacity-50 text-white text-[11px] font-semibold rounded-lg hover:bg-rose-600 transition-colors"
                    >
                      Enviar
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    Mensagens personalizadas têm 4x mais chances de resposta imediata!
                  </p>
                </form>
              )}

              {/* Prev / Next controls */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>
                <span className="font-mono tabular-nums">
                  {currentIndex + 1} / {filteredProfiles.length}
                </span>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                >
                  <span>Próximo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Compatibility Insights Box */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>Por que essa conexão tem sintonia</span>
                </h3>
                <span className="text-xs font-bold text-rose-500 font-mono tabular-nums">
                  {currentProfile.baseAffinity}%
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Estilo de Comunicação: </span>
                    {currentProfile.communicationStyle}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">O que busca no momento: </span>
                    {currentProfile.lookingFor}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Valores em comum: </span>
                    {currentProfile.values.join(' · ')}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Quer afinar ainda mais seus resultados?
                </span>
                <button
                  onClick={onOpenQuiz}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Fazer Quiz
                </button>
              </div>
            </div>

            {/* Quick Safety & Community Tip */}
            <div className="bg-rose-50/60 dark:bg-rose-950/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-900/40 flex items-start gap-3">
              <Info className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                <span className="font-bold">Dica de Conexão:</span> Em vez de apenas dizer "Oi, tudo bem?", comente algo específico sobre uma foto, paixão ou resposta do perfil!
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
