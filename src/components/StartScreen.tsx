import React from 'react';
import { ArrowRight, ShieldCheck, Lock, Heart, Sparkles } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  onOpenAdmin: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  onOpenAdmin,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-6 sm:py-8 bg-paper">
      
      {/* Top minimal bar */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#D92B27] text-white flex items-center justify-center shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-black tracking-widest uppercase text-[#0B4A72]">
            Caxingui + SP Norte
          </span>
        </div>

        <span className="text-xs text-[#5C564E] flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#0B4A72]" />
          <span>Privacidade Garantida</span>
        </span>
      </header>

      {/* Main hero with flyer image in background without text */}
      <main className="max-w-md mx-auto w-full flex flex-col items-center py-2 sm:py-4">
        
        {/* Flyer Poster Container (Image in background, NO text overlay) */}
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-[#E7E0D3] bg-[#FAF7F2] mb-6 transition-transform hover:scale-[1.01]">
          <img
            src="/assets/aistudio/_E3DE9451-082D-47BF-8C5B-2F57473A8A08__d3aebdc4.png"
            alt="Encontro Marcado - Aulão e Baile (Caxingui + SP Norte)"
            className="w-full h-auto object-cover block select-none pointer-events-none"
          />
        </div>

        {/* Primary CTA */}
        <button
          onClick={onStart}
          className="w-full sm:w-84 h-14 bg-[#D92B27] hover:bg-[#C02420] active:scale-[0.98] text-white font-bold text-base rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#D92B27]/25 transition-all cursor-pointer"
        >
          <span>Criar Meu Perfil para o Baile</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Reassurances */}
        <div className="flex items-center justify-center gap-3 text-[11px] text-[#7A7369] mt-3 font-medium">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D92B27]" />
            Rápido (2 min)
          </span>
          <span>•</span>
          <span>Foto opcional</span>
          <span>•</span>
          <span>Notificação via WhatsApp</span>
        </div>

      </main>

      {/* Footer with organizer login */}
      <footer className="max-w-md mx-auto w-full pt-6 flex items-center justify-between border-t border-[#EAE3D4] text-[11px] text-[#7A7369]">
        <span>Encontro Marcado © 2026</span>
        <button
          onClick={onOpenAdmin}
          className="hover:text-[#0B4A72] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
        >
          <Lock className="w-3 h-3 text-[#0B4A72]" />
          <span>Acesso do Organizador</span>
        </button>
      </footer>

    </div>
  );
};
