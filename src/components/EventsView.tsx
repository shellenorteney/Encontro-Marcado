import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Check, Sparkles, Filter } from 'lucide-react';
import { CommunityEvent } from '../types/connection';

interface EventsViewProps {
  events: CommunityEvent[];
  onToggleJoinEvent: (eventId: string) => void;
  onCreateEvent: (newEvent: Omit<CommunityEvent, 'id' | 'attendeesCount' | 'userJoined'>) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  onToggleJoinEvent,
  onCreateEvent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Jogos & Encontros' as CommunityEvent['category'],
    date: 'Sábado, 22 Nov',
    time: '16:00 - 19:00',
    location: '',
    neighborhood: 'Pinheiros, SP',
    description: '',
    coverImage: '/src/assets/images/meetup_community_1794227566590.jpg',
    tags: 'Amizade, Café, Conversa',
  });

  const categories = [
    'all',
    'Jogos & Encontros',
    'Café & Ideias',
    'Esportes & Outdoor',
    'Cultura & Arte',
  ];

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  const handleSubmitNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim()) return;

    onCreateEvent({
      title: formData.title,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      neighborhood: formData.neighborhood,
      description: formData.description || 'Encontro aberto para troca de ideias e novas amizades.',
      coverImage: formData.coverImage,
      tags: formData.tags.split(',').map((t) => t.trim()),
    });

    setShowCreateModal(false);
    setFormData({
      title: '',
      category: 'Jogos & Encontros',
      date: 'Sábado, 22 Nov',
      time: '16:00 - 19:00',
      location: '',
      neighborhood: 'Pinheiros, SP',
      description: '',
      coverImage: '/src/assets/images/meetup_community_1794227566590.jpg',
      tags: 'Amizade, Café, Conversa',
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Encontros em Grupos Pequenos & Temáticos</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Rodas de Conexão & Eventos
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Nada substitui o encontro presencial. Participe de encontros informais pensados para quebrar o gelo naturalmente em cafés, parques e livrarias.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Propor Nova Roda</span>
        </button>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'all' ? 'Todos os Eventos' : cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-all hover:shadow-md"
          >
            {/* Event Cover Photo */}
            <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
              <img
                src={event.coverImage}
                alt={event.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[11px] font-semibold text-white border border-white/10">
                  {event.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  {event.time}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-1.5">
                  {event.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{event.location} · {event.neighborhood}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {event.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {event.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer / RSVP */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <Users className="w-4 h-4 text-rose-500" />
                  <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                    {event.attendeesCount}
                  </span>
                  <span>confirmados</span>
                </div>

                <button
                  onClick={() => onToggleJoinEvent(event.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                    event.userJoined
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
                  }`}
                >
                  {event.userJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Presença Confirmada</span>
                    </>
                  ) : (
                    <span>Confirmar Presença</span>
                  )}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Propor Nova Roda Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Propor uma Nova Roda de Conexão
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Crie um encontro aberto para reunir pessoas com o mesmo interesse no seu bairro.
            </p>

            <form onSubmit={handleSubmitNewEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título do Encontro
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Café & Conversa sobre Fotografia Analógica"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Jogos & Encontros">Jogos & Encontros</option>
                    <option value="Café & Ideias">Café & Ideias</option>
                    <option value="Esportes & Outdoor">Esportes & Outdoor</option>
                    <option value="Cultura & Arte">Cultura & Arte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Data
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Horário
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Local ou Ponto de Encontro
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Livraria da Vila ou Portão 10 do Ibirapuera"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição do Encontro
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Como será a dinâmica? Quem é bem-vindo?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm transition-colors"
                >
                  Publicar Roda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
