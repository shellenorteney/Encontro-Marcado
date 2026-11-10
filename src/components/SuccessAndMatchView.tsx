import React, { useState } from 'react';
import {
  CheckCircle2,
  Heart,
  Sparkles,
  Phone,
  Instagram,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  Home,
  Calendar,
  MapPin
} from 'lucide-react';
import { UserProfile, MatchPair } from '../types/profile';
import { buildWhatsAppLink } from '../utils/matchEngine';

interface SuccessAndMatchViewProps {
  currentUser: UserProfile;
  foundMatches: MatchPair[];
  onBackToHome: () => void;
  onUpdateMatchAcceptance: (matchId: string, userAAccepted: boolean, userBAccepted: boolean) => void;
}

export const SuccessAndMatchView: React.FC<SuccessAndMatchViewProps> = ({
  currentUser,
  foundMatches,
  onBackToHome,
  onUpdateMatchAcceptance,
}) => {
  const topMatch = foundMatches[0] || null;

  // Track user's own acceptance state and simulated partner acceptance
  const isUserA = topMatch ? topMatch.userA.id === currentUser.id : false;
  const partnerUser = topMatch ? (isUserA ? topMatch.userB : topMatch.userA) : null;

  const [myAccepted, setMyAccepted] = useState(
    topMatch ? (isUserA ? topMatch.userAAccepted : topMatch.userBAccepted) : false
  );
  const [partnerAccepted, setPartnerAccepted] = useState(
    topMatch ? (isUserA ? topMatch.userBAccepted : topMatch.userAAccepted) : false
  );

  const bothAccepted = myAccepted && partnerAccepted;

  const handleAcceptMyShare = () => {
    setMyAccepted(true);
    // Simulate partner also accepting after 800ms for testing flow
    setTimeout(() => {
      setPartnerAccepted(true);
      if (topMatch) {
        onUpdateMatchAcceptance(topMatch.id, true, true);
      }
    }, 800);
  };

  const whatsappLink = topMatch && partnerUser
    ? buildWhatsAppLink(currentUser, partnerUser)
    : '';

  return (
    <div className="min-h-screen bg-paper py-8 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E7E0D3] shadow-xl shadow-[#0B4A72]/5 text-center">
        
        {/* Event Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0B4A72] bg-[#0B4A72]/10 px-2.5 py-0.5 rounded-full">
              Caxingui + SP Norte
            </span>
            <span className="font-script text-2xl text-[#D92B27] font-bold">
              Encontro Marcado
            </span>
          </div>

          <div className="text-[11px] font-bold text-[#D92B27] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>14 Nov · 17h30</span>
          </div>
        </div>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242220] tracking-tight mb-2">
          Perfil Cadastrado com Sucesso!
        </h1>

        <p className="text-xs sm:text-sm text-[#6E675D] max-w-md mx-auto mb-6">
          Suas preferências foram registradas com segurança para o <strong>Aulão e Baile</strong>. Quando houver afinidade real com outro participante, você será avisado!
        </p>

        {/* ======================================================== */}
        {/* CASE A: MATCH FOUND IMMEDIATELY                          */}
        {/* ======================================================== */}
        {topMatch && partnerUser ? (
          <div className="text-left space-y-5 pt-4 border-t border-[#F0EAE0]">
            
            {/* Match Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-red-50 via-[#FAF7F2] to-amber-50 border border-[#E7E0D3]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#D92B27]">
                  <Sparkles className="w-4 h-4" />
                  <span>Encontramos um Par Compatível para Você!</span>
                </div>
                <span className="text-xs font-mono font-bold bg-[#D92B27] text-white px-2.5 py-0.5 rounded-full">
                  {topMatch.score}% Afinidade
                </span>
              </div>

              <p className="text-xs text-[#4A453F] leading-relaxed">
                Um membro da <strong className="text-[#242220]">{partnerUser.ward} ({partnerUser.stake})</strong> preencheu os mesmos gostos e critérios indispensáveis que você para o baile!
              </p>
            </div>

            {/* Step 1 of Match: WhatsApp notification preview */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E7E0D3]">
              <div className="text-xs font-bold text-[#242220] mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Notificação Pronta para WhatsApp</span>
              </div>
              <p className="text-[11px] text-[#6E675D] mb-3">
                Você pode testar e abrir o link que enviamos para o seu número:
              </p>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Abrir Mensagem de Match no WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>

            {/* Step 2 of Match: Mutual Consent flow */}
            {!bothAccepted ? (
              <div className="p-5 rounded-2xl border-2 border-dashed border-[#D92B27]/40 bg-white text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#D92B27] flex items-center justify-center mx-auto">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#242220]">
                    Quer saber mais sobre esse match para o baile?
                  </h4>
                  <p className="text-xs text-[#6E675D] mt-1 max-w-sm mx-auto">
                    "Aceita compartilhar suas informações para se conhecerem no Aulão e Baile?"
                  </p>
                </div>

                {!myAccepted ? (
                  <button
                    onClick={handleAcceptMyShare}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#D92B27] hover:bg-[#C02420] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Sim, Aceito Compartilhar!
                  </button>
                ) : (
                  <div className="text-xs text-[#D92B27] font-semibold flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D92B27] animate-ping" />
                    <span>Você aceitou! Aguardando confirmação mútua...</span>
                  </div>
                )}
              </div>
            ) : (
              /* Step 3 of Match: MUTUAL MATCH REVEALED! */
              <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#D92B27] space-y-4 animate-in fade-in duration-300 shadow-sm">
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D92B27] text-white rounded-full text-xs font-bold mb-2 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Match Mútuo Confirmado! 🎉</span>
                  </div>
                  <h3 className="text-base font-bold text-[#242220]">
                    Vocês dois aceitaram se conhecer no Baile!
                  </h3>
                  <p className="text-xs text-[#6E675D]">
                    Aqui estão as informações do perfil do seu par:
                  </p>
                </div>

                {/* Secure Revealed Profile Card */}
                <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E7E0D3] shadow-sm flex items-start gap-4">
                  {partnerUser.photoUrl ? (
                    <img
                      src={partnerUser.photoUrl}
                      alt={partnerUser.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 ring-2 ring-[#D92B27]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-[#EBE5D8] text-[#D92B27] flex items-center justify-center font-bold text-2xl font-display">
                      {partnerUser.name.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-[#242220] truncate">
                        {partnerUser.name}, {partnerUser.age} anos
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-[#0B4A72] bg-[#0B4A72]/10 px-2 py-0.5 rounded-full">
                        {partnerUser.gender}
                      </span>
                    </div>

                    <div className="text-xs text-[#6E675D] mt-0.5">
                      {partnerUser.ward} · {partnerUser.stake}
                    </div>

                    {/* Informação sobre Missão */}
                    <div className="text-xs text-[#3B3731] mt-1.5 flex items-center gap-1">
                      <span className="font-semibold text-[#D92B27]">Missão:</span>
                      <span>
                        {partnerUser.mission.served && partnerUser.mission.location
                          ? `Serviu em ${partnerUser.mission.location}`
                          : partnerUser.mission.served
                          ? 'Serviu missão de tempo integral'
                          : 'Não serviu missão'}
                      </span>
                    </div>

                    {/* Personalidade */}
                    <div className="text-xs text-[#6E675D] mt-1">
                      <span className="font-semibold">Personalidade: </span>
                      <span className="capitalize">{partnerUser.personality}</span>
                    </div>

                    {partnerUser.instagram && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B4A72] mt-2">
                        <Instagram className="w-3.5 h-3.5" />
                        <span>{partnerUser.instagram}</span>
                      </div>
                    )}

                    {partnerUser.aboutMePhrase && (
                      <p className="text-xs italic text-[#6E675D] mt-2 border-t border-[#E7E0D3] pt-1.5">
                        "{partnerUser.aboutMePhrase}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Direct Action Link to chat */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <a
                    href={`https://wa.me/55${partnerUser.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Olá, ${partnerUser.name}! Nos conectamos pelo Encontro Marcado (Aulão e Baile Caxingui + SP Norte)! Adorei ver nossa afinidade. Você vai no baile dia 14 de Novembro no Instituto?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Chamar no WhatsApp</span>
                  </a>

                  {partnerUser.instagram && (
                    <a
                      href={`https://instagram.com/${partnerUser.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-[#0B4A72] hover:bg-[#083857] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Ver Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        ) : (
          /* ======================================================== */
          /* CASE B: NO IMMEDIATE MATCH YET                          */
          /* ======================================================== */
          <div className="space-y-4 pt-4 border-t border-[#F0EAE0] text-left">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D3]">
              <h3 className="text-xs font-bold text-[#242220] mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0B4A72]" />
                <span>O que acontece agora?</span>
              </h3>
              <p className="text-xs text-[#6E675D] leading-relaxed">
                Mais jovens das estacas Caxingui e SP Norte estão se cadastrando para o baile. Assim que houver um match recíproco entre homem e mulher atendendo aos seus critérios indispensáveis, enviaremos o link no seu WhatsApp:
              </p>
              <div className="mt-2 text-xs font-mono font-semibold text-[#D92B27]">
                {currentUser.whatsapp}
              </div>
            </div>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="mt-8 pt-4 border-t border-[#F0EAE0] flex items-center justify-center">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-semibold text-[#6E675D] hover:text-[#242220] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Voltar à Tela Inicial</span>
          </button>
        </div>

      </div>
    </div>
  );
};
