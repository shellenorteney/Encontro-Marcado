import React from 'react';
import { CheckCircle2, Heart, Home, RefreshCw, Lock, Phone, Instagram } from 'lucide-react';
import type { UserProfile } from '../types/profile';
import type { SharedMatch } from '../services/participants';

interface SuccessAndMatchViewProps {
  currentUser: UserProfile;
  matches: SharedMatch[];
  sessionSaved: boolean;
  refreshing: boolean;
  pendingMatch: string | null;
  error: string | null;
  onRefresh: () => void;
  onAccept: (matchId: string) => void;
  onBackToHome: () => void;
}

export const SuccessAndMatchView: React.FC<SuccessAndMatchViewProps> = ({
  currentUser, matches, sessionSaved, refreshing, pendingMatch, error, onRefresh, onAccept, onBackToHome,
}) => (
  <div className="min-h-screen bg-paper py-4 sm:py-8 px-3 sm:px-4 [&_button]:min-h-11 [&_a]:min-h-11 [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-[#0B4A72]">
    <main className="w-full max-w-xl mx-auto bg-[#FFFDF9] rounded-3xl p-4 sm:p-8 border border-[#E7E0D3] shadow-xl shadow-[#0B4A72]/5">
      <header className="text-center">
        <span className="font-script text-3xl text-[#D92B27] font-bold">Encontro Marcado</span>
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mt-5 mb-3" />
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 break-words">Perfil cadastrado, {currentUser.name}!</h1>
        <p className="text-sm text-[#6E675D]">Seu cadastro foi salvo no sistema da atividade. Você já pode acompanhar as compatibilidades com outros participantes.</p>
      </header>

      <div className="mt-5 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D3] p-4 text-sm space-y-2">
        <p className="flex gap-2 font-semibold"><Lock className="w-4 h-4 shrink-0 mt-0.5" />Seus contatos só aparecem após o aceite dos dois.</p>
        <p>Volte neste mesmo navegador para acessar seu perfil. Seu acesso fica salvo aqui por até 30 dias; evite modo anônimo e não limpe os dados do navegador.</p>
        <p className="text-xs text-[#6E675D]">Não há envio automático de mensagens nem agendamento de encontros.</p>
      </div>
      {!sessionSaved && <p role="alert" className="mt-4 rounded-xl p-3 bg-amber-50 text-amber-950 text-sm">Seu perfil está no sistema, mas este navegador não permitiu salvar o acesso. Mantenha esta página aberta para acompanhar seus matches.</p>}
      {error && <p role="alert" className="mt-4 rounded-xl p-3 bg-red-50 text-red-800 text-sm">{error}</p>}

      <section className="mt-6" aria-labelledby="matches-title">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 id="matches-title" className="font-bold text-base flex items-center gap-2"><Heart className="w-5 h-5 text-[#D92B27]" />Meus matches</h2>
          <button onClick={onRefresh} disabled={refreshing} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#DCD5C6] text-sm font-semibold disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />Atualizar</button>
        </div>
        <p className="text-xs text-[#6E675D] mb-4">Somente compatibilidades acima de 70%. Os resultados se atualizam a cada 30 segundos enquanto esta página estiver aberta.</p>
        {matches.length === 0 ? <p role="status" className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D3] text-sm">{refreshing ? 'Buscando compatibilidades…' : 'Ainda não há matches acima de 70% para seu perfil. Volte quando mais participantes tiverem se cadastrado.'}</p> :
          <ul className="space-y-4">
            {matches.filter(match => match.score > 70).map(match => (
              <li key={match.id} className="p-4 rounded-2xl border border-[#E7E0D3] space-y-3">
                <div className="flex items-start gap-3 justify-between">
                  <div className="min-w-0">
                    <h3 className="font-bold break-words">{match.mutual ? match.partner.name : 'Uma pessoa compatível'}{`, ${match.partner.age} anos`}</h3>
                    {match.mutual && <p className="text-sm text-[#6E675D] break-words">{match.partner.ward} · {match.partner.stake}</p>}
                  </div>
                  <span className="shrink-0 rounded-full px-3 py-1 bg-[#D92B27] text-white text-sm font-bold">{match.score}%</span>
                </div>
                {match.commonInterests.length > 0 && <p className="text-sm break-words"><strong>Em comum:</strong> {match.commonInterests.join(', ')}</p>}
                <p className="text-sm text-[#6E675D]">{match.personalityMatch}</p>
                {match.mutual ? <>
                  <p className="font-semibold text-emerald-800 text-sm" role="status">Vocês dois aceitaram compartilhar o perfil!</p>
                  {match.partner.photoUrl && <img src={match.partner.photoUrl} alt={`Foto de ${match.partner.name}`} className="w-24 h-24 object-cover rounded-2xl" />}
                  {match.partner.aboutMePhrase && <p className="text-sm break-words">{match.partner.aboutMePhrase}</p>}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {match.partner.whatsapp && <a href={`https://wa.me/55${match.partner.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 text-white font-semibold text-sm"><Phone className="w-4 h-4" />Conversar no WhatsApp</a>}
                    {match.partner.instagram && <a href={`https://www.instagram.com/${encodeURIComponent(match.partner.instagram.replace(/^@/, ''))}/`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B4A72] text-white font-semibold text-sm"><Instagram className="w-4 h-4" />Ver Instagram</a>}
                  </div>
                </> : match.accepted ? <p role="status" className="p-3 bg-amber-50 text-amber-950 rounded-xl text-sm">Você aceitou. Aguardando o aceite da outra pessoa para liberar os perfis e contatos.</p> : <>
                  <p className="text-sm">Ao aceitar, você permite que esta pessoa veja seu nome, foto e contatos se ela também aceitar.</p>
                  <button onClick={() => onAccept(match.id)} disabled={pendingMatch !== null} className="w-full px-4 py-3 bg-[#D92B27] hover:bg-[#C02420] text-white font-bold rounded-xl disabled:opacity-50">{pendingMatch === match.id ? 'Registrando aceite…' : 'Aceitar Compartilhar Meu Perfil'}</button>
                </>}
              </li>
            ))}
          </ul>}
      </section>
      <button onClick={onBackToHome} className="mt-6 mx-auto flex items-center gap-2 text-sm font-semibold text-[#0B4A72] px-3 py-2"><Home className="w-4 h-4" />Voltar à tela inicial</button>
    </main>
  </div>
);
