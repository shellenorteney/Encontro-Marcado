import React, { useState } from 'react';
import {
  Users,
  Heart,
  Sparkles,
  Phone,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Search,
  Download
} from 'lucide-react';
import { UserProfile, MatchPair } from '../types/profile';
import { buildWhatsAppLink } from '../utils/matchEngine';

interface AdminDashboardProps {
  profiles: UserProfile[];
  matches: MatchPair[];
  onBack: () => void;
  onLogout: () => void;
  onResetSeed: () => void;
  onUpdateMatchPair: (matchId: string, userAAccepted: boolean, userBAccepted: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profiles,
  matches,
  onBack,
  onLogout,
  onResetSeed,
  onUpdateMatchPair,
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'profiles'>('matches');
  const [genderFilter, setGenderFilter] = useState<'todos' | 'homem' | 'mulher'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const menCount = profiles.filter((p) => p.gender === 'homem').length;
  const womenCount = profiles.filter((p) => p.gender === 'mulher').length;

  const mutualMatches = matches.filter((m) => {
    const woman = m.userA.gender === 'mulher' ? m.userA : m.userB;
    const man = m.userA.gender === 'homem' ? m.userA : m.userB;
    const womanAccepted = woman.id === m.userA.id ? m.userAAccepted : m.userBAccepted;
    const manAccepted = man.id === m.userA.id ? m.userAAccepted : m.userBAccepted;
    return (womanAccepted && manAccepted) || m.status === 'mutual_match';
  });

  const filteredProfiles = profiles.filter((p) => {
    if (genderFilter !== 'todos' && p.gender !== genderFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(term) ||
        p.ward.toLowerCase().includes(term) ||
        p.stake.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleExportCSV = (onlyMutual: boolean = false) => {
    const targetMatches = onlyMutual || mutualMatches.length > 0 ? (mutualMatches.length > 0 ? mutualMatches : matches) : matches;

    if (targetMatches.length === 0) {
      alert('Não há matches para exportar no momento.');
      return;
    }

    const headers = [
      'ID Match',
      'Status do Match',
      'Sintonia (%)',
      'Nome (Mulher)',
      'Idade (Mulher)',
      'Ala (Mulher)',
      'Estaca (Mulher)',
      'WhatsApp (Mulher)',
      'Instagram (Mulher)',
      'Missao (Mulher)',
      'Personalidade (Mulher)',
      'Nome (Homem)',
      'Idade (Homem)',
      'Ala (Homem)',
      'Estaca (Homem)',
      'WhatsApp (Homem)',
      'Instagram (Homem)',
      'Missao (Homem)',
      'Personalidade (Homem)',
      'Gostos em Comum',
      'Gostos Indispensaveis'
    ];

    const escapeCSV = (val: any) => {
      if (val === undefined || val === null) return '""';
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = targetMatches.map((m) => {
      const woman = m.userA.gender === 'mulher' ? m.userA : m.userB;
      const man = m.userA.gender === 'homem' ? m.userA : m.userB;
      const womanAccepted = woman.id === m.userA.id ? m.userAAccepted : m.userBAccepted;
      const manAccepted = man.id === m.userA.id ? m.userAAccepted : m.userBAccepted;
      const isMutual = (womanAccepted && manAccepted) || m.status === 'mutual_match';

      const womanMission = woman.mission?.served
        ? `Serviu (${woman.mission.location || 'Sim'})`
        : 'Nao serviu';

      const manMission = man.mission?.served
        ? `Serviu (${man.mission.location || 'Sim'})`
        : 'Nao serviu';

      return [
        escapeCSV(m.id),
        escapeCSV(isMutual ? 'Mutuo Confirmado' : 'Pendente'),
        escapeCSV(`${m.score}%`),
        escapeCSV(woman.name),
        escapeCSV(woman.age),
        escapeCSV(woman.ward),
        escapeCSV(woman.stake),
        escapeCSV(woman.whatsapp),
        escapeCSV(woman.instagram || 'N/A'),
        escapeCSV(womanMission),
        escapeCSV(woman.personality),
        escapeCSV(man.name),
        escapeCSV(man.age),
        escapeCSV(man.ward),
        escapeCSV(man.stake),
        escapeCSV(man.whatsapp),
        escapeCSV(man.instagram || 'N/A'),
        escapeCSV(manMission),
        escapeCSV(man.personality),
        escapeCSV(m.commonInterests.join(', ')),
        escapeCSV(m.matchedIndispensable.join(', '))
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = mutualMatches.length > 0
      ? `matches_mutuos_baile_${dateStr}.csv`
      : `matches_candidatos_baile_${dateStr}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF9] p-6 rounded-3xl border border-[#E7E0D3] shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE0] text-[#242220] transition-colors cursor-pointer border border-[#E7E0D3]"
              title="Voltar à tela inicial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4A72] bg-[#0B4A72]/10 px-2.5 py-0.5 rounded-full">
                  Caxingui + SP Norte
                </span>
                <span className="font-script text-xl text-[#D92B27] font-bold">
                  Encontro Marcado
                </span>
              </div>
              <h1 className="text-xl font-bold text-[#242220] flex items-center gap-2 mt-0.5">
                <span>Painel do Organizador do Baile</span>
              </h1>
              <p className="text-xs text-[#6E675D] mt-0.5">
                Matches estritos Homem x Mulher com base em gostos e situações.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Export CSV Button */}
            <button
              onClick={() => handleExportCSV(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#0B4A72] hover:bg-[#083857] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Exportar lista de matches mútuos como CSV para o planejamento do baile"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Matches Mútuos (CSV)</span>
            </button>

            <button
              onClick={onResetSeed}
              className="px-3.5 py-2 text-xs font-semibold text-[#4A453F] bg-[#FAF7F2] hover:bg-[#F0EAE0] border border-[#E7E0D3] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Restaurar banco com dados de exemplo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Perfis</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 text-xs font-semibold text-[#D92B27] bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Metric Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E7E0D3]">
            <div className="text-xs text-[#6E675D] mb-1">Total de Cadastros</div>
            <div className="text-2xl font-bold font-mono text-[#242220]">
              {profiles.length}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E7E0D3]">
            <div className="text-xs text-[#6E675D] mb-1">Mulheres</div>
            <div className="text-2xl font-bold font-mono text-[#D92B27]">
              {womenCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E7E0D3]">
            <div className="text-xs text-[#6E675D] mb-1">Homens</div>
            <div className="text-2xl font-bold font-mono text-[#0B4A72]">
              {menCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E7E0D3]">
            <div className="text-xs text-[#6E675D] mb-1">Matches Mútuos / Total</div>
            <div className="text-2xl font-bold font-mono text-emerald-700 flex items-baseline gap-1">
              <span>{mutualMatches.length}</span>
              <span className="text-xs font-normal text-[#8C8477]">/ {matches.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Quick Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E0D3] pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'matches'
                  ? 'bg-[#D92B27] text-white shadow-sm'
                  : 'text-[#6E675D] hover:text-[#242220]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Pares com Match ({matches.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'profiles'
                  ? 'bg-[#0B4A72] text-white shadow-sm'
                  : 'text-[#6E675D] hover:text-[#242220]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Participantes Cadastrados ({profiles.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportCSV(false)}
              className="px-3 py-1.5 text-xs font-semibold text-[#0B4A72] bg-[#0B4A72]/10 hover:bg-[#0B4A72]/20 border border-[#0B4A72]/20 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Baixar planilha de matches para o planejamento"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Planilha CSV</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: MATCHES LIST                                      */}
        {/* ======================================================== */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="p-12 text-center bg-[#FFFDF9] rounded-3xl border border-[#E7E0D3]">
                <Heart className="w-10 h-10 text-[#C5BCAC] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#242220]">
                  Nenhum par compatível encontrado ainda
                </h3>
                <p className="text-xs text-[#6E675D] max-w-sm mx-auto mt-1">
                  Cadastre novos participantes com idades recíprocas e itens indispensáveis em comum para gerar matches automáticos!
                </p>
              </div>
            ) : (
              matches.map((m) => {
                const woman = m.userA.gender === 'mulher' ? m.userA : m.userB;
                const man = m.userA.gender === 'homem' ? m.userA : m.userB;

                const womanAccepted = woman.id === m.userA.id ? m.userAAccepted : m.userBAccepted;
                const manAccepted = man.id === m.userA.id ? m.userAAccepted : m.userBAccepted;
                const isMutual = (womanAccepted && manAccepted) || m.status === 'mutual_match';

                const linkWoman = buildWhatsAppLink(woman, man);
                const linkMan = buildWhatsAppLink(man, woman);

                return (
                  <div
                    key={m.id}
                    className={`p-5 sm:p-6 bg-[#FFFDF9] rounded-3xl border transition-all shadow-sm space-y-4 ${
                      isMutual ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-[#E7E0D3]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EAE0] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#D92B27] text-white">
                          {m.score}% Afinidade
                        </span>
                        <span className="text-xs text-[#6E675D]">
                          Match Homem x Mulher (Baile SP Norte)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        {isMutual ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Match Mútuo Confirmado! 🎉</span>
                          </span>
                        ) : (
                          <span className="text-[#8C8477]">
                            Aguardando autorização mútua
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pair Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Woman Card */}
                      <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 flex items-start gap-3">
                        {woman.photoUrl ? (
                          <img
                            src={woman.photoUrl}
                            alt={woman.name}
                            className="w-14 h-14 rounded-2xl object-cover shrink-0 ring-2 ring-[#D92B27]"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-red-100 text-[#D92B27] font-bold flex items-center justify-center shrink-0 font-display text-xl">
                            {woman.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-[#242220] truncate">
                              {woman.name}, {woman.age}
                            </h4>
                            <span className="text-[10px] font-bold text-[#D92B27] uppercase">
                              Mulher
                            </span>
                          </div>
                          <div className="text-xs text-[#6E675D]">
                            {woman.ward} ({woman.stake})
                          </div>
                          <div className="text-[11px] text-[#D92B27] font-medium mt-0.5">
                            {woman.mission.served ? `Missão: ${woman.mission.location || 'Sim'}` : 'Não serviu missão'} · {woman.personality}
                          </div>
                          <div className="text-xs text-[#4A453F] mt-1 line-clamp-1">
                            Gostos: {woman.interests.join(', ')}
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <a
                              href={linkWoman}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <Phone className="w-3 h-3 fill-current" />
                              <span>Avisar no WhatsApp</span>
                              <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>
                            <span className="text-[10px] text-[#7A7369]">
                              {womanAccepted ? 'Aceitou ✓' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Man Card */}
                      <div className="p-4 rounded-2xl bg-[#0B4A72]/5 border border-[#0B4A72]/15 flex items-start gap-3">
                        {man.photoUrl ? (
                          <img
                            src={man.photoUrl}
                            alt={man.name}
                            className="w-14 h-14 rounded-2xl object-cover shrink-0 ring-2 ring-[#0B4A72]"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-[#0B4A72]/20 text-[#0B4A72] font-bold flex items-center justify-center shrink-0 font-display text-xl">
                            {man.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-[#242220] truncate">
                              {man.name}, {man.age}
                            </h4>
                            <span className="text-[10px] font-bold text-[#0B4A72] uppercase">
                              Homem
                            </span>
                          </div>
                          <div className="text-xs text-[#6E675D]">
                            {man.ward} ({man.stake})
                          </div>
                          <div className="text-[11px] text-[#0B4A72] font-medium mt-0.5">
                            {man.mission.served ? `Missão: ${man.mission.location || 'Sim'}` : 'Não serviu missão'} · {man.personality}
                          </div>
                          <div className="text-xs text-[#4A453F] mt-1 line-clamp-1">
                            Gostos: {man.interests.join(', ')}
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <a
                              href={linkMan}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <Phone className="w-3 h-3 fill-current" />
                              <span>Avisar no WhatsApp</span>
                              <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>
                            <span className="text-[10px] text-[#7A7369]">
                              {manAccepted ? 'Aceitou ✓' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Simulation Trigger */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6E675D]">
                      <span>
                        Itens indispensáveis compatíveis: <strong className="text-[#242220]">{m.matchedIndispensable.join(', ')}</strong>
                      </span>
                      <button
                        onClick={() => onUpdateMatchPair(m.id, !womanAccepted, !manAccepted)}
                        className="text-xs text-[#D92B27] font-semibold hover:underline cursor-pointer text-left sm:text-right"
                      >
                        {isMutual ? 'Desfazer confirmação mútua' : 'Simular aceite de ambos (Mútuo)'}
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PROFILES TABLE                                    */}
        {/* ======================================================== */}
        {activeTab === 'profiles' && (
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7E0D3] overflow-hidden shadow-sm">
            {/* Filter controls */}
            <div className="p-4 border-b border-[#E7E0D3] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#8C8477] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por nome, ala ou estaca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DCD5C6] bg-white text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#0B4A72]"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setGenderFilter('todos')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                    genderFilter === 'todos' ? 'bg-[#242220] text-white' : 'text-[#6E675D] hover:bg-[#FAF7F2]'
                  }`}
                >
                  Todos ({profiles.length})
                </button>
                <button
                  onClick={() => setGenderFilter('mulher')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                    genderFilter === 'mulher' ? 'bg-[#D92B27] text-white' : 'text-[#6E675D] hover:bg-[#FAF7F2]'
                  }`}
                >
                  Mulheres ({womenCount})
                </button>
                <button
                  onClick={() => setGenderFilter('homem')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                    genderFilter === 'homem' ? 'bg-[#0B4A72] text-white' : 'text-[#6E675D] hover:bg-[#FAF7F2]'
                  }`}
                >
                  Homens ({menCount})
                </button>
              </div>
            </div>

            {/* Profiles List */}
            <div className="divide-y divide-[#F0EAE0] max-h-[600px] overflow-y-auto">
              {filteredProfiles.map((p) => (
                <div key={p.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-[#FAF7F2] transition-colors">
                  {p.photoUrl ? (
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="w-12 h-12 rounded-2xl object-cover shrink-0 ring-2 ring-[#E7E0D3]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#EBE5D8] text-[#D92B27] font-bold flex items-center justify-center shrink-0 font-display text-lg">
                      {p.name.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#242220]">
                          {p.name}, {p.age}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.gender === 'mulher' ? 'bg-red-50 text-[#D92B27]' : 'bg-[#0B4A72]/10 text-[#0B4A72]'
                        }`}>
                          {p.gender}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <a
                          href={`https://wa.me/55${p.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-mono font-medium flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{p.whatsapp}</span>
                        </a>
                      </div>
                    </div>

                    <div className="text-xs text-[#6E675D] mt-0.5">
                      {p.ward} · {p.stake} {p.occupation && `· ${p.occupation}`}
                    </div>

                    <div className="text-[11px] text-[#D92B27] mt-0.5 font-medium">
                      {p.mission.served ? `Missão: ${p.mission.location || 'Sim'}` : 'Não serviu missão'} · {p.personality}
                    </div>

                    {p.aboutMePhrase && (
                      <p className="text-xs italic text-[#6E675D] mt-1">
                        "{p.aboutMePhrase}"
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {p.interests.map((it) => (
                        <span
                          key={it}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF7F2] border border-[#E7E0D3] text-[#4A453F]"
                        >
                          {it}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 text-[11px] text-[#8C8477] flex items-center gap-3">
                      <span>Procura: {p.preferences.minAge} a {p.preferences.maxAge} anos</span>
                      {p.preferences.indispensable.length > 0 && (
                        <span>Indispensável: {p.preferences.indispensable.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
