import React, { useState } from 'react';
import { MapPin, Navigation, Coffee, Trees, Briefcase, Wine, Users, Sparkles, Check } from 'lucide-react';
import { RadarSpot, Profile } from '../types/connection';

interface RadarViewProps {
  spots: RadarSpot[];
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({ spots, profiles, onSelectProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(5);
  const [checkedInSpotId, setCheckedInSpotId] = useState<string | null>(null);
  const [activeSpotId, setActiveSpotId] = useState<string>(spots[0]?.id || '');

  const filteredSpots = spots.filter((spot) => {
    if (selectedCategory !== 'all' && spot.type !== selectedCategory) return false;
    const distanceVal = parseFloat(spot.distance.replace(' km', ''));
    return distanceVal <= maxDistance;
  });

  const activeSpot = spots.find((s) => s.id === activeSpotId) || spots[0];

  const handleCheckIn = (spotId: string) => {
    if (checkedInSpotId === spotId) {
      setCheckedInSpotId(null);
    } else {
      setCheckedInSpotId(spotId);
    }
  };

  const getSpotIcon = (type: string) => {
    switch (type) {
      case 'Café & Livros':
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'Parque & Natureza':
        return <Trees className="w-4 h-4 text-emerald-500" />;
      case 'Coworking & Hub':
        return <Briefcase className="w-4 h-4 text-sky-500" />;
      case 'Bar & Cultura':
        return <Wine className="w-4 h-4 text-rose-500" />;
      default:
        return <MapPin className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>Geolocalização Ativa em São Paulo</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Radar & Pontos de Conexão
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Descubra cafés, parques e espaços culturais perto de você onde membros da comunidade gostam de se reunir para encontros casuais, coworking ou conversas reais.
          </p>
        </div>

        {/* Distance Slider */}
        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            <span>Raio de Busca</span>
            <span className="font-bold text-rose-500 font-mono tabular-nums">Até {maxDistance} km</span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {['all', 'Café & Livros', 'Parque & Natureza', 'Coworking & Hub', 'Bar & Cultura'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'all' ? 'Todos os Pontos' : cat}
          </button>
        ))}
      </div>

      {/* Grid: Interactive Radar + Spots Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Radar Map Graphic Box (Col 1-7) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Radar de Proximidade em Tempo Real
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pulsando no seu bairro atual
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>88 conexões na sua região</span>
            </div>
          </div>

          {/* Radar Circles Display */}
          <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center my-4">
            
            {/* Concentric rings */}
            <div className="absolute inset-0 rounded-full border border-slate-200/80 dark:border-slate-700/60" />
            <div className="absolute inset-8 rounded-full border border-slate-200/80 dark:border-slate-700/60" />
            <div className="absolute inset-16 rounded-full border border-slate-200/80 dark:border-slate-700/60" />
            <div className="absolute inset-28 rounded-full border border-rose-500/20 dark:border-rose-500/30" />
            <div className="absolute inset-40 rounded-full border border-rose-500/40 dark:border-rose-500/50" />

            {/* Crosshairs */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-200 dark:bg-slate-700" />

            {/* User Center Ping */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 ring-4 ring-rose-200 dark:ring-rose-950">
                <Navigation className="w-5 h-5 fill-current" />
              </div>
              <span className="mt-1 text-[11px] font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                Você (Pinheiros)
              </span>
            </div>

            {/* Glowing spot markers mapped on radar */}
            {filteredSpots.map((spot, i) => {
              // Distribute spots at different angles and radii
              const angles = [45, 135, 220, 310];
              const radii = [32, 42, 28, 38];
              const angle = (angles[i % angles.length] * Math.PI) / 180;
              const r = radii[i % radii.length];
              const x = 50 + r * Math.cos(angle);
              const y = 50 + r * Math.sin(angle);

              const isSelected = activeSpotId === spot.id;

              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveSpotId(spot.id)}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl transition-all ${
                    isSelected
                      ? 'scale-125 z-20 bg-rose-500 text-white shadow-lg ring-4 ring-rose-300 dark:ring-rose-900'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-md border border-slate-200 dark:border-slate-700 hover:scale-110'
                  }`}
                  title={`${spot.name} - ${spot.activePeopleCount} pessoas`}
                >
                  <div className="flex items-center gap-1">
                    {getSpotIcon(spot.type)}
                    <span className="text-[10px] font-bold">{spot.activePeopleCount}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Spot Detail Strip */}
          {activeSpot && (
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {activeSpot.type}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {activeSpot.neighborhood} ({activeSpot.distance})
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {activeSpot.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {activeSpot.highlight}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleCheckIn(activeSpot.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${
                    checkedInSpotId === activeSpot.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                  }`}
                >
                  {checkedInSpotId === activeSpot.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Check-in Feito!</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Fazer Check-in</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Spots & Community Feed (Col 8-12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Locais Populares Recomendados
            </h2>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {filteredSpots.length} encontrados
            </span>
          </div>

          <div className="space-y-3">
            {filteredSpots.map((spot) => {
              const isSelected = activeSpotId === spot.id;
              const isCheckedIn = checkedInSpotId === spot.id;

              return (
                <div
                  key={spot.id}
                  onClick={() => setActiveSpotId(spot.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                        {getSpotIcon(spot.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span>{spot.type}</span>
                          <span>·</span>
                          <span className="font-mono">{spot.distance}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {spot.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                          {spot.address}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-rose-500" />
                        <span className="font-mono">{spot.activePeopleCount}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">por perto</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      {spot.popularModes.map((m) => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          {m === 'romance' && '💫 Romance'}
                          {m === 'friendship' && '🤝 Amizade'}
                          {m === 'networking' && '🚀 Networking'}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckIn(spot.id);
                      }}
                      className={`text-xs font-semibold ${
                        isCheckedIn
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400 hover:underline'
                      }`}
                    >
                      {isCheckedIn ? 'Presente aqui ✓' : 'Avisar presença'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nearby Member Teaser */}
          <div className="bg-gradient-to-tr from-rose-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl p-5 border border-rose-200/60 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conexão Próxima em Destaque</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <img
                src={profiles[0]?.avatarUrl}
                alt={profiles[0]?.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {profiles[0]?.name}, {profiles[0]?.age}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  A {profiles[0]?.distanceKm} km · {profiles[0]?.occupation}
                </div>
              </div>
              <button
                onClick={() => onSelectProfile(profiles[0])}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg whitespace-nowrap shrink-0 transition-colors"
              >
                Ver Perfil
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
