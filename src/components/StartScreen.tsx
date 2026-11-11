import React from 'react';
import { ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  hasProfile?: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  hasProfile = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-6 sm:py-8 bg-paper [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-[#0B4A72]">
      
      {/* Top minimal bar */}
      <header className="max-w-md mx-auto w-full flex flex-wrap items-center justify-between gap-3 pb-3">
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
          <span>Aceite mútuo</span>
        </span>
      </header>

      {/* Main hero with flyer image in background without text */}
      <main className="max-w-md mx-auto w-full flex flex-col items-center py-2 sm:py-4">
        
        {/* Flyer Poster Container (Image in background, NO text overlay) */}
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-[#E7E0D3] bg-[#FAF7F2] mb-6 transition-transform hover:scale-[1.01]">
          <img
            src={`${import.meta.env.BASE_URL}assets/aistudio/_E3DE9451-082D-47BF-8C5B-2F57473A8A08__d3aebdc4.png`}
            alt="Encontro Marcado - Aulão e Baile (Caxingui + SP Norte)"
            className="w-full h-auto object-cover block select-none pointer-events-none"
          />
        </div>

        <div className="w-full p-4 mb-5 rounded-2xl border border-amber-200 bg-amber-50 text-sm text-[#4A453F] space-y-2">
          <h1 className="font-bold text-[#242220]">Conheça pessoas para o baile</h1>
          <p>Crie seu perfil e veja compatibilidades acima de 70%. Foto opcional. Seus contatos só aparecem para o par depois que vocês dois aceitarem.</p>
          <p>Volte pelo mesmo navegador para acompanhar seus matches. Não há envio automático de WhatsApp nem agendamento de encontros.</p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onStart}
          className="w-full sm:w-84 h-14 bg-[#D92B27] hover:bg-[#C02420] active:scale-[0.98] text-white font-bold text-base rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#D92B27]/25 transition-all cursor-pointer"
        >
          <span>{hasProfile ? 'Ver Meus Matches' : 'Criar Meu Perfil'}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Reassurances */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#7A7369] mt-3 font-medium">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D92B27]" />
            Rápido (2 min)
          </span>
          <span>•</span>
          <span>Foto opcional</span>
          <span>•</span>
          <span>Compatibilidade &gt;70%</span>
        </div>

      </main>

      {/* Demo footer */}
      <footer className="max-w-md mx-auto w-full pt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#EAE3D4] text-xs text-[#7A7369]">
        <span>Encontro Marcado © 2026</span>
        <span>Somente maiores de 18 anos</span>
      </footer>

    </div>
  );
};
