import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Camera,
  Heart,
  Instagram,
  Phone,
  Sparkles,
  User,
  Compass,
  Briefcase,
  Trash2
} from 'lucide-react';
import { UserProfile, Gender, PersonalityType } from '../types/profile';
import { STANDARD_INTERESTS, SITUATIONAL_QUESTIONS } from '../data/seedData';

interface RegistrationWizardProps {
  onCancel: () => void;
  onComplete: (profile: UserProfile) => void;
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({
  onCancel,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    gender: 'mulher' as Gender,
    age: 23,
    ward: '',
    stake: '',
    whatsapp: '',
    instagram: '',
    photoUrl: '' as string | undefined,
    aboutMePhrase: '',
    occupation: '',
    servedMission: true,
    missionLocation: '',
    personality: 'ambivertido' as PersonalityType,
    situations: {
      arrivalAtParty: 'ajudar',
      rainySaturday: 'pizza',
      surpriseTrip: 'historica',
    },
    interests: [] as string[],
    minAge: 20,
    maxAge: 30,
    missionRequirement: 'any' as 'must_have_served' | 'any',
    indispensable: [] as string[],
    niceToHave: [] as string[],
    consentGiven: false,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle Photo Upload (Gallery / Camera)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photoUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleInterest = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter((i) => i !== item)
        : [...prev.interests, item],
    }));
  };

  const handleToggleIndispensable = (item: string) => {
    setFormData((prev) => {
      const isSelected = prev.indispensable.includes(item);
      return {
        ...prev,
        indispensable: isSelected
          ? prev.indispensable.filter((i) => i !== item)
          : [...prev.indispensable, item],
        niceToHave: prev.niceToHave.filter((i) => i !== item),
      };
    });
  };

  const handleToggleNiceToHave = (item: string) => {
    setFormData((prev) => {
      const isSelected = prev.niceToHave.includes(item);
      return {
        ...prev,
        niceToHave: isSelected
          ? prev.niceToHave.filter((i) => i !== item)
          : [...prev.niceToHave, item],
        indispensable: prev.indispensable.filter((i) => i !== item),
      };
    });
  };

  const handleNext = () => {
    setValidationError(null);

    if (step === 1) {
      if (!formData.name.trim()) {
        setValidationError('Por favor, informe seu nome.');
        return;
      }
      if (!formData.age || formData.age < 18) {
        setValidationError('Por favor, informe uma idade válida (a partir de 18 anos).');
        return;
      }
      if (!formData.ward.trim() || !formData.stake.trim()) {
        setValidationError('Por favor, preencha sua Ala e Estaca para que seu par saiba de onde você é.');
        return;
      }
      if (!formData.whatsapp.trim() || formData.whatsapp.replace(/\D/g, '').length < 10) {
        setValidationError('Por favor, informe seu número de WhatsApp com DDD para avisarmos sobre os matches.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.interests.length === 0) {
        setValidationError('Selecione pelo menos 1 coisa que você gosta de fazer.');
        return;
      }
      if (formData.servedMission && !formData.missionLocation.trim()) {
        setValidationError('Por favor, informe onde você serviu missão (ou selecione "Não").');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (formData.minAge > formData.maxAge) {
        setValidationError('A idade mínima não pode ser maior que a idade máxima.');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      setValidationError('Você precisa aceitar os termos de consentimento para prosseguir.');
      return;
    }

    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      gender: formData.gender,
      age: Number(formData.age),
      ward: formData.ward.trim(),
      stake: formData.stake.trim(),
      whatsapp: formData.whatsapp.trim(),
      instagram: formData.instagram.trim()
        ? formData.instagram.startsWith('@')
          ? formData.instagram.trim()
          : `@${formData.instagram.trim()}`
        : undefined,
      photoUrl: formData.photoUrl || undefined,
      aboutMePhrase: formData.aboutMePhrase.trim() || undefined,
      occupation: formData.occupation.trim() || undefined,
      mission: {
        served: formData.servedMission,
        location: formData.servedMission ? formData.missionLocation.trim() : undefined,
      },
      personality: formData.personality,
      situations: formData.situations,
      interests: formData.interests,
      preferences: {
        minAge: Number(formData.minAge),
        maxAge: Number(formData.maxAge),
        missionRequirement: formData.missionRequirement,
        indispensable: formData.indispensable,
        niceToHave: formData.niceToHave,
      },
      consentGiven: true,
      createdAt: new Date().toISOString(),
    };

    onComplete(newProfile);
  };

  return (
    <div className="min-h-screen bg-paper py-8 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E7E0D3] shadow-xl shadow-[#0B4A72]/5 transition-all">
        
        {/* Event Header Banner */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0B4A72] bg-[#0B4A72]/10 px-2.5 py-0.5 rounded-full">
              Caxingui + SP Norte
            </span>
            <span className="font-script text-2xl text-[#D92B27] font-bold">
              Encontro Marcado
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-[#D92B27]">
            Passo {step} de 4
          </span>
        </div>

        {/* Navigation & Progress Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => {
              if (step > 1) {
                setStep((s) => (s - 1) as any);
              } else {
                onCancel();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6E675D] hover:text-[#242220] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancelar' : 'Voltar'}</span>
          </button>

          <span className="text-[11px] font-medium text-[#7A7369]">
            {step === 1 && 'Dados Básicos'}
            {step === 2 && 'Sobre Mim & Estilo'}
            {step === 3 && 'O Que Procura'}
            {step === 4 && 'Consentimento'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#EAE4D7] h-2 rounded-full overflow-hidden mb-6">
          <div
            className="bg-[#D92B27] h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 text-[#D92B27] text-xs font-semibold border border-red-200 animate-in fade-in">
            {validationError}
          </div>
        )}

        {/* ======================================================== */}
        {/* PASSO 1: DADOS BÁSICOS DO PERFIL                        */}
        {/* ======================================================== */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-2xl font-bold text-[#242220] tracking-tight">
                Criando Seu Perfil
              </h2>
              <p className="text-xs text-[#6E675D] mt-1">
                Informações para que seu par do baile saiba quem você é.
              </p>
            </div>

            {/* Photo Upload: Gallery or Camera (OPTIONAL) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#3B3731]">
                  Foto do Perfil (Opcional)
                </label>
                <span className="text-[11px] text-[#7A7369]">Não é obrigatório</span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D3]">
                {formData.photoUrl ? (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[#D92B27] shrink-0">
                    <img
                      src={formData.photoUrl}
                      alt="Sua foto"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, photoUrl: undefined })}
                      className="absolute top-1 right-1 w-5 h-5 bg-[#D92B27] text-white rounded-full flex items-center justify-center text-xs hover:bg-[#C02420] shadow-sm cursor-pointer"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#EBE5D8] text-[#8C8477] flex items-center justify-center shrink-0">
                    <User className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-white border border-[#DCD5C6] hover:border-[#0B4A72] rounded-xl text-xs font-semibold text-[#242220] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#D92B27]" />
                      <span>{formData.photoUrl ? 'Trocar Foto' : 'Adicionar da Galeria ou Câmera'}</span>
                    </button>

                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photoUrl: undefined })}
                        className="text-xs text-[#7A7369] hover:text-[#D92B27] cursor-pointer"
                      >
                        Deixar sem foto
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A7369]">
                    Você pode escolher uma foto da galeria, tirar agora ou deixar sem foto.
                  </p>
                </div>
              </div>
            </div>

            {/* Gender Selection: Homem / Mulher (Strict) */}
            <div>
              <label className="block text-xs font-bold text-[#3B3731] mb-2">
                Você é: <span className="text-[#D92B27]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'mulher' })}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                    formData.gender === 'mulher'
                      ? 'bg-[#D92B27] text-white border-[#D92B27] shadow-md shadow-[#D92B27]/20'
                      : 'bg-white text-[#3B3731] border-[#E7E0D3] hover:border-[#0B4A72]'
                  }`}
                >
                  <span>Mulher</span>
                  {formData.gender === 'mulher' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'homem' })}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                    formData.gender === 'homem'
                      ? 'bg-[#D92B27] text-white border-[#D92B27] shadow-md shadow-[#D92B27]/20'
                      : 'bg-white text-[#3B3731] border-[#E7E0D3] hover:border-[#0B4A72]'
                  }`}
                >
                  <span>Homem</span>
                  {formData.gender === 'homem' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              </div>
              <p className="text-[11px] text-[#7A7369] mt-1">
                * Os matches para o baile ocorrem exclusivamente entre homem e mulher.
              </p>
            </div>

            {/* Nome & Idade */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#3B3731] mb-1">
                  Seu Nome <span className="text-[#D92B27]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ana Clara"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B3731] mb-1">
                  Idade <span className="text-[#D92B27]">*</span>
                </label>
                <input
                  type="number"
                  min={18}
                  max={99}
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
              </div>
            </div>

            {/* Ala e Estaca */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#3B3731] mb-1">
                  Sua Ala <span className="text-[#D92B27]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ala Perdizes"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B3731] mb-1">
                  Sua Estaca <span className="text-[#D92B27]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Estaca Caxingui"
                  value={formData.stake}
                  onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
              </div>
            </div>

            {/* WhatsApp & Instagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#3B3731] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp com DDD <span className="text-[#D92B27]">*</span></span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 11987654321"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
                <span className="text-[10px] text-[#7A7369] mt-0.5 block">
                  Para envio do link de match do baile.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B3731] mb-1 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-[#0B4A72]" />
                  <span>@ do Instagram (opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: @seu_usuario"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
                <span className="text-[10px] text-[#7A7369] mt-0.5 block">
                  Só revelado se ambos aceitarem o match!
                </span>
              </div>
            </div>

            {/* Frase Sobre Mim */}
            <div>
              <label className="block text-xs font-bold text-[#3B3731] mb-1">
                Uma Frase Sobre Mim (opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Animada para o baile, gosto de conversar e dar boas risadas!"
                value={formData.aboutMePhrase}
                onChange={(e) => setFormData({ ...formData, aboutMePhrase: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PASSO 2: SOBRE MIM (GOSTOS, MISSÃO & PERSONALIDADE)     */}
        {/* ======================================================== */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-2xl font-bold text-[#242220] tracking-tight">
                Sobre Mim: Gostos, Missão & Estilo
              </h2>
              <p className="text-xs text-[#6E675D] mt-1">
                Conte sobre seus gostos, sua missão e estilo para o baile.
              </p>
            </div>

            {/* Gostos / O que gosta de fazer */}
            <div>
              <label className="block text-xs font-bold text-[#3B3731] mb-2">
                O que você gosta de fazer? (Selecione quantos quiser) <span className="text-[#D92B27]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STANDARD_INTERESTS.map((item) => {
                  const isSelected = formData.interests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleInterest(item)}
                      className={`p-3 rounded-xl text-xs font-semibold transition-all border text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#D92B27] text-white border-[#D92B27] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#3B3731] border-[#E7E0D3] hover:border-[#0B4A72]'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Missão */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D3] space-y-3">
              <label className="block text-xs font-bold text-[#242220] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#D92B27]" />
                <span>Você serviu missão de tempo integral?</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, servedMission: true })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    formData.servedMission
                      ? 'bg-[#D92B27] text-white border-[#D92B27] shadow-sm'
                      : 'bg-white text-[#3B3731] border-[#E7E0D3]'
                  }`}
                >
                  Sim, servi missão
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, servedMission: false, missionLocation: '' })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    !formData.servedMission
                      ? 'bg-[#D92B27] text-white border-[#D92B27] shadow-sm'
                      : 'bg-white text-[#3B3731] border-[#E7E0D3]'
                  }`}
                >
                  Não servi
                </button>
              </div>

              {formData.servedMission && (
                <div className="animate-in fade-in">
                  <label className="block text-xs font-bold text-[#3B3731] mb-1">
                    Onde você serviu?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Brasil Curitiba Sul, Portugal Lisboa..."
                    value={formData.missionLocation}
                    onChange={(e) => setFormData({ ...formData, missionLocation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                  />
                  <span className="text-[10px] text-[#7A7369] mt-0.5 block">
                    Essa informação aparecerá para seu par quando o match for enviado.
                  </span>
                </div>
              )}
            </div>

            {/* Personalidade: Introvertido / Ambivertido / Extrovertido */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D3] space-y-2">
              <label className="block text-xs font-bold text-[#242220]">
                Como você se descreve em termos de energia social?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'introvertido', label: 'Introvertido(a)', desc: 'Recarrega no silêncio / poucos amigos' },
                  { key: 'ambivertido', label: 'Ambivertido(a)', desc: 'Equilíbrio flexível' },
                  { key: 'extrovertido', label: 'Extrovertido(a)', desc: 'Adora festas e novas pessoas' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, personality: item.key as PersonalityType })}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      formData.personality === item.key
                        ? 'bg-[#0B4A72] text-white border-[#0B4A72] shadow-sm'
                        : 'bg-white text-[#3B3731] border-[#E7E0D3]'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5 leading-tight">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Perguntas de Situações Diferentes ("O que você faria se...") */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#242220]">
                <Sparkles className="w-4 h-4 text-[#D92B27]" />
                <span>Análise de Situações</span>
              </div>
              <p className="text-[11px] text-[#6E675D]">
                O que você faria em cada uma dessas situações?
              </p>

              {SITUATIONAL_QUESTIONS.map((sq) => {
                const currentVal = (formData.situations as any)[sq.id];
                return (
                  <div
                    key={sq.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#E7E0D3] space-y-2"
                  >
                    <div className="text-xs font-bold text-[#242220]">
                      {sq.question}
                    </div>
                    <div className="space-y-1.5">
                      {sq.options.map((opt) => {
                        const isChosen = currentVal === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                situations: { ...formData.situations, [sq.id]: opt.id },
                              })
                            }
                            className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border flex items-center justify-between cursor-pointer ${
                              isChosen
                                ? 'bg-red-50 border-[#D92B27] text-[#D92B27] font-bold'
                                : 'bg-[#FAF7F2] border-[#E7E0D3] text-[#4A453F]'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isChosen && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0 text-[#D92B27]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* O que trabalha ou estuda */}
            <div>
              <label className="block text-xs font-bold text-[#3B3731] mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#0B4A72]" />
                <span>O que você trabalha ou estuda? (opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Trabalho com tecnologia / Estudo Arquitetura"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PASSO 3: O QUE VOCÊ PROCURA EM ALGUÉM                   */}
        {/* ======================================================== */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-2xl font-bold text-[#242220] tracking-tight">
                O Que Você Procura em Alguém?
              </h2>
              <p className="text-xs text-[#6E675D] mt-1">
                Defina a faixa etária e o que você considera indispensável ou legal ter.
              </p>
            </div>

            {/* Faixa etária */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E7E0D3]">
              <label className="block text-xs font-bold text-[#242220] mb-3">
                Faixa Etária Desejada
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-[#6E675D] block mb-1">Idade Mínima</span>
                  <input
                    type="number"
                    min={18}
                    max={formData.maxAge}
                    value={formData.minAge}
                    onChange={(e) => setFormData({ ...formData, minAge: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD5C6] bg-white text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-[#6E675D] block mb-1">Idade Máxima</span>
                  <input
                    type="number"
                    min={formData.minAge}
                    max={99}
                    value={formData.maxAge}
                    onChange={(e) => setFormData({ ...formData, maxAge: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCD5C6] bg-white text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Preferência sobre Missão */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E7E0D3] space-y-2">
              <label className="block text-xs font-bold text-[#242220]">
                Sobre Missão em Alguém
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, missionRequirement: 'any' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    formData.missionRequirement === 'any'
                      ? 'bg-[#0B4A72] text-white border-[#0B4A72] shadow-sm'
                      : 'bg-white text-[#3B3731] border-[#E7E0D3]'
                  }`}
                >
                  Tudo bem se não serviu
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, missionRequirement: 'must_have_served' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    formData.missionRequirement === 'must_have_served'
                      ? 'bg-[#0B4A72] text-white border-[#0B4A72] shadow-sm'
                      : 'bg-white text-[#3B3731] border-[#E7E0D3]'
                  }`}
                >
                  Indispensável ter servido
                </button>
              </div>
            </div>

            {/* O que é Indispensável */}
            <div>
              <label className="block text-xs font-bold text-[#242220] mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D92B27]" />
                <span>O que é INDISPENSÁVEL para você?</span>
              </label>
              <p className="text-[11px] text-[#6E675D] mb-3">
                Gostos que a outra pessoa DEVE ter para que haja match:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STANDARD_INTERESTS.map((item) => {
                  const isSelected = formData.indispensable.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleIndispensable(item)}
                      className={`p-2.5 rounded-xl text-xs font-semibold transition-all border text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#D92B27] text-white border-[#D92B27] shadow-sm'
                          : 'bg-white text-[#3B3731] border-[#E7E0D3] hover:border-[#D92B27]'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* É legal, mas tudo bem se não tiver */}
            <div>
              <label className="block text-xs font-bold text-[#242220] mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B4A72]" />
                <span>É legal, mas tudo bem se não tiver</span>
              </label>
              <p className="text-[11px] text-[#6E675D] mb-3">
                Gostos complementares que aumentam a afinidade:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STANDARD_INTERESTS.map((item) => {
                  const isSelected = formData.niceToHave.includes(item);
                  const isIndispensable = formData.indispensable.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      disabled={isIndispensable}
                      onClick={() => handleToggleNiceToHave(item)}
                      className={`p-2.5 rounded-xl text-xs font-semibold transition-all border text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B4A72] text-white border-[#0B4A72] shadow-sm'
                          : isIndispensable
                          ? 'opacity-30 bg-slate-100 border-transparent cursor-not-allowed'
                          : 'bg-white text-[#3B3731] border-[#E7E0D3] hover:border-[#0B4A72]'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PASSO 4: TERMOS E FINALIZAÇÃO                           */}
        {/* ======================================================== */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-2xl font-bold text-[#242220] tracking-tight">
                Termo & Notificação
              </h2>
              <p className="text-xs text-[#6E675D] mt-1">
                Quando tiver match compatível com seus gostos, vamos te avisar pelo WhatsApp.
              </p>
            </div>

            {/* Checkbox de Consentimento enxuto */}
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-[#E7E0D3] bg-[#FAF7F2] cursor-pointer hover:bg-[#F5F0E6] transition-colors">
              <input
                type="checkbox"
                required
                checked={formData.consentGiven}
                onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                className="w-4 h-4 rounded text-[#D92B27] accent-[#D92B27] mt-0.5 shrink-0"
              />
              <span className="text-xs text-[#242220] leading-relaxed font-medium">
                Eu autorizo o uso dos meus dados para o evento <strong className="text-[#D92B27]">Encontro Marcado (Aulão e Baile)</strong> e permito o envio de notificações no meu WhatsApp quando houver match.
              </span>
            </label>

            <button
              type="submit"
              className="w-full h-14 bg-[#D92B27] hover:bg-[#C02420] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#D92B27]/25 transition-all cursor-pointer"
            >
              <span>Finalizar Cadastro para o Baile</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        )}

        {/* Step Navigation Buttons (steps 1, 2, 3) */}
        {step < 4 && (
          <div className="mt-8 pt-4 border-t border-[#F0EAE0] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (step > 1) setStep((s) => (s - 1) as any);
                else onCancel();
              }}
              className="text-xs font-semibold text-[#6E675D] hover:text-[#242220] cursor-pointer"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#D92B27] hover:bg-[#C02420] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Próxima Parte</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
