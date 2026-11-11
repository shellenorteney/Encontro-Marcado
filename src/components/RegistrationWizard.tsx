import React, { useState, useRef, useEffect } from 'react';
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
  Briefcase
} from 'lucide-react';
import { UserProfile, Gender, PersonalityType } from '../types/profile';
import { STANDARD_INTERESTS, SITUATIONAL_QUESTIONS } from '../data/seedData';

interface RegistrationWizardProps {
  onCancel: () => void;
  onComplete: (profile: UserProfile) => void;
  submitting?: boolean;
  serverError?: string | null;
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({
  onCancel,
  onComplete,
  submitting = false,
  serverError = null,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

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
  const [photoProcessing, setPhotoProcessing] = useState(false);

  useEffect(() => {
    stepTitleRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (validationError || serverError) errorRef.current?.focus();
  }, [validationError, serverError]);

  // Handle Photo Upload (Gallery / Camera)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValidationError(null);
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
        setValidationError('Escolha uma imagem JPG, PNG ou WebP de até 10 MB, ou continue sem foto.');
        e.target.value = '';
        return;
      }
      setPhotoProcessing(true);
      try {
        const image = await createImageBitmap(file);
        const scale = Math.min(1, 640 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          image.close();
          throw new Error('Não foi possível processar a imagem.');
        }
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        image.close();
        let photoUrl = canvas.toDataURL('image/jpeg', 0.8);
        if (photoUrl.length > 500 * 1024) photoUrl = canvas.toDataURL('image/jpeg', 0.6);
        if (photoUrl.length > 500 * 1024) throw new Error('A imagem reduzida ainda é muito grande.');
        setFormData((prev) => ({
          ...prev,
          photoUrl,
        }));
      } catch {
        setValidationError('Não foi possível processar a foto. Tente outra imagem ou continue sem foto.');
      } finally {
        setPhotoProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
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
    if (photoProcessing) {
      setValidationError('Aguarde um instante enquanto a foto é reduzida.');
      return;
    }

    if (step === 1) {
      if (!formData.name.trim()) {
        setValidationError('Por favor, informe seu nome.');
        return;
      }
      if (!Number.isInteger(formData.age) || formData.age < 18 || formData.age > 99) {
        setValidationError('Por favor, informe uma idade inteira entre 18 e 99 anos.');
        return;
      }
      if (!formData.ward.trim() || !formData.stake.trim()) {
        setValidationError('Por favor, preencha sua Ala e Estaca para que seu par saiba de onde você é.');
        return;
      }
      if (!/^\d{10,11}$/.test(formData.whatsapp.replace(/\D/g, ''))) {
        setValidationError('Informe seu WhatsApp com DDD e 10 ou 11 dígitos.');
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
      if (![formData.minAge, formData.maxAge].every((age) => Number.isInteger(age) && age >= 18 && age <= 99)) {
        setValidationError('Informe idades inteiras entre 18 e 99 anos na faixa etária desejada.');
        return;
      }
      if (formData.minAge > formData.maxAge) {
        setValidationError('A idade mínima não pode ser maior que a idade máxima.');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || photoProcessing) return;
    if (!formData.consentGiven) {
      setValidationError('Confirme seu consentimento para participar.');
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
    <div className="min-h-screen bg-paper py-4 sm:py-8 px-3 sm:px-4 flex flex-col justify-center items-center [&_button]:min-h-11 [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-[#0B4A72]">
      <div className="w-full min-w-0 max-w-xl bg-[#FFFDF9] rounded-3xl p-4 sm:p-8 border border-[#E7E0D3] shadow-xl shadow-[#0B4A72]/5 transition-all">

        {/* Event Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#F0EAE0]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0B4A72] bg-[#0B4A72]/10 px-2.5 py-0.5 rounded-full">
              Caxingui + SP Norte
            </span>
            <span className="font-script text-2xl text-[#D92B27] font-bold">
              Encontro Marcado
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-[#D92B27] whitespace-nowrap" aria-live="polite">
            Passo {step} de 4
          </span>
        </div>

        {/* Navigation & Progress Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <button
            type="button"
            onClick={() => {
              if (step > 1) {
                setStep((s) => (s - 1) as any);
              } else {
                onCancel();
              }
            }}
            className="px-2 -ml-2 flex items-center gap-1.5 text-sm font-semibold text-[#6E675D] hover:text-[#242220] transition-colors cursor-pointer"
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
        <div role="progressbar" aria-label="Progresso do perfil" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step} className="w-full bg-[#EAE4D7] h-2 rounded-full overflow-hidden mb-6">
          <div
            className="bg-[#D92B27] h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Validation Alert */}
        <div role="note" className="mb-5 p-3.5 rounded-2xl bg-amber-50 text-amber-950 text-xs border border-amber-200">
          <strong>Seus dados são usados para a atividade Encontro Marcado.</strong> A organização tem acesso ao cadastro. Antes do aceite mútuo, o par vê apenas um resumo de compatibilidade, idade e interesses em comum. Nome, foto e contatos aparecem somente depois do aceite dos dois. Não há envio automático de mensagens.
        </div>
        {(validationError || serverError) && (
          <div ref={errorRef} role="alert" tabIndex={-1} className="mb-5 p-3.5 rounded-2xl bg-red-50 text-[#D92B27] text-xs font-semibold border border-red-200 animate-in fade-in">
            {validationError || serverError}
          </div>
        )}

        {/* ======================================================== */}
        {/* PASSO 1: DADOS BÁSICOS DO PERFIL                        */}
        {/* ======================================================== */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h1 ref={stepTitleRef} tabIndex={-1} className="text-2xl font-bold text-[#242220] tracking-tight">
                Criando Seu Perfil
              </h1>
              <p className="text-xs text-[#6E675D] mt-1">
                Preencha seu perfil para participar da atividade de compatibilidade no baile.
              </p>
            </div>

            {/* Photo Upload: Gallery or Camera (OPTIONAL) */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                <label htmlFor="profile-photo" className="text-xs font-bold text-[#3B3731]">
                  Foto do Perfil (Opcional)
                </label>
                <span className="text-[11px] text-[#7A7369]">Não é obrigatório</span>
              </div>

              <input id="profile-photo"
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp" aria-describedby="photo-help"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D3]">
                {formData.photoUrl ? (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[#D92B27] shrink-0">
                    <img
                      src={formData.photoUrl}
                      alt="Sua foto"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#EBE5D8] text-[#8C8477] flex items-center justify-center shrink-0">
                    <User className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 min-w-0 w-full space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={photoProcessing}
                      onClick={() => fileInputRef.current?.click()}
                      className="max-w-full px-3.5 py-2 bg-white border border-[#DCD5C6] hover:border-[#0B4A72] rounded-xl text-xs font-semibold text-[#242220] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4 shrink-0 text-[#D92B27]" />
                      <span>{photoProcessing ? 'Preparando foto…' : formData.photoUrl ? 'Trocar Foto' : 'Adicionar da Galeria ou Câmera'}</span>
                    </button>

                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => { setFormData({ ...formData, photoUrl: undefined }); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="px-2 text-sm text-[#7A7369] hover:text-[#D92B27] cursor-pointer"
                      >
                        Deixar sem foto
                      </button>
                    )}
                  </div>
                  <p id="photo-help" className="text-xs text-[#7A7369]">
                    Foto opcional em JPG, PNG ou WebP. Imagens de até 10 MB são reduzidas antes de salvar.
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
                  onClick={() => setFormData({ ...formData, gender: 'mulher' })} aria-pressed={formData.gender === 'mulher'}
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
                  onClick={() => setFormData({ ...formData, gender: 'homem' })} aria-pressed={formData.gender === 'homem'}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 min-w-0">
                <label htmlFor="profile-name" className="block text-xs font-bold text-[#3B3731] mb-1">
                  Seu Nome <span className="text-[#D92B27]">*</span>
                </label>
                <input id="profile-name" maxLength={80} autoComplete="off"
                  type="text"
                  required
                  placeholder="Ex: Ana Clara"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full min-w-0 min-h-11 px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
              </div>

              <div>
                <label htmlFor="profile-age" className="block text-xs font-bold text-[#3B3731] mb-1">
                  Idade <span className="text-[#D92B27]">*</span>
                </label>
                <input id="profile-age" inputMode="numeric" step={1}
                  type="number"
                  min={18}
                  max={99}
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full min-w-0 min-h-11 px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
              </div>
            </div>

            {/* Ala e Estaca */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="profile-ward" className="block text-xs font-bold text-[#3B3731] mb-1">
                  Sua Ala <span className="text-[#D92B27]">*</span>
                </label>
                <input id="profile-ward" maxLength={100}
                  type="text"
                  required
                  placeholder="Ex: Ala Perdizes"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full min-w-0 min-h-11 px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
              </div>

              <div>
                <label htmlFor="profile-stake" className="block text-xs font-bold text-[#3B3731] mb-1">
                  Sua Estaca <span className="text-[#D92B27]">*</span>
                </label>
                <input id="profile-stake" maxLength={100}
                  type="text"
                  required
                  placeholder="Ex: Estaca Caxingui"
                  value={formData.stake}
                  onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                  className="w-full min-w-0 min-h-11 px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
              </div>
            </div>

            {/* WhatsApp & Instagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="profile-whatsapp" className="block text-xs font-bold text-[#3B3731] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp com DDD <span className="text-[#D92B27]">*</span></span>
                </label>
                <input id="profile-whatsapp" inputMode="tel" autoComplete="off" maxLength={20} aria-describedby="whatsapp-help"
                  type="tel"
                  required
                  placeholder="Ex: 11987654321"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full min-w-0 min-h-11 px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
                <span id="whatsapp-help" className="text-xs text-[#7A7369] mt-0.5 block">
                  Visível para o par somente após o aceite mútuo. Não enviaremos mensagens automaticamente.
                </span>
              </div>

              <div>
                <label htmlFor="profile-instagram" className="block text-xs font-bold text-[#3B3731] mb-1 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-[#0B4A72]" />
                  <span>@ do Instagram (opcional)</span>
                </label>
                <input id="profile-instagram" maxLength={31} autoCapitalize="none" autoComplete="off" aria-describedby="instagram-help"
                  type="text"
                  placeholder="Ex: @seu_usuario"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full min-w-0 min-h-11 px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                />
                <span id="instagram-help" className="text-xs text-[#7A7369] mt-0.5 block">
                  Opcional. Visível para o par somente depois do aceite mútuo.
                </span>
              </div>
            </div>

            {/* Frase Sobre Mim */}
            <div>
              <label htmlFor="profile-about" className="block text-xs font-bold text-[#3B3731] mb-1">
                Uma Frase Sobre Mim (opcional)
              </label>
              <textarea id="profile-about" maxLength={300}
                rows={2}
                placeholder="Ex: Animada para o baile, gosto de conversar e dar boas risadas!"
                value={formData.aboutMePhrase}
                onChange={(e) => setFormData({ ...formData, aboutMePhrase: e.target.value })}
                className="w-full min-w-0 min-h-11 px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
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
              <h1 ref={stepTitleRef} tabIndex={-1} className="text-2xl font-bold text-[#242220] tracking-tight">
                Sobre Mim: Gostos, Missão & Estilo
              </h1>
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
                      onClick={() => handleToggleInterest(item)} aria-pressed={isSelected}
                      className={`p-3 rounded-xl text-xs font-semibold transition-all border text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#D92B27] text-white border-[#D92B27] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#3B3731] border-[#E7E0D3] hover:border-[#0B4A72]'
                      }`}
                    >
                      <span className="min-w-0 break-words">{item}</span>
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
                  onClick={() => setFormData({ ...formData, servedMission: true })} aria-pressed={formData.servedMission}
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
                  onClick={() => setFormData({ ...formData, servedMission: false, missionLocation: '' })} aria-pressed={!formData.servedMission}
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
                  <label htmlFor="profile-mission" className="block text-xs font-bold text-[#3B3731] mb-1">
                    Onde você serviu?
                  </label>
                  <input id="profile-mission" maxLength={100} aria-describedby="mission-help"
                    type="text"
                    required
                    placeholder="Ex: Brasil Curitiba Sul, Portugal Lisboa..."
                    value={formData.missionLocation}
                    onChange={(e) => setFormData({ ...formData, missionLocation: e.target.value })}
                    className="w-full min-w-0 min-h-11 px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
                  />
                  <span id="mission-help" className="text-xs text-[#7A7369] mt-0.5 block">
                    Informação usada no cálculo de compatibilidade.
                  </span>
                </div>
              )}
            </div>

            {/* Personalidade: Introvertido / Ambivertido / Extrovertido */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7E0D3] space-y-2">
              <label className="block text-xs font-bold text-[#242220]">
                Como você se descreve em termos de energia social?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="group" aria-label="Energia social">
                {[
                  { key: 'introvertido', label: 'Introvertido(a)', desc: 'Recarrega no silêncio / poucos amigos' },
                  { key: 'ambivertido', label: 'Ambivertido(a)', desc: 'Equilíbrio flexível' },
                  { key: 'extrovertido', label: 'Extrovertido(a)', desc: 'Adora festas e novas pessoas' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, personality: item.key as PersonalityType })} aria-pressed={formData.personality === item.key}
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
                            aria-pressed={isChosen}
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
              <label htmlFor="profile-occupation" className="block text-xs font-bold text-[#3B3731] mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#0B4A72]" />
                <span>O que você trabalha ou estuda? (opcional)</span>
              </label>
              <input id="profile-occupation" maxLength={100}
                type="text"
                placeholder="Ex: Trabalho com tecnologia / Estudo Arquitetura"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full min-w-0 min-h-11 px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
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
              <h1 ref={stepTitleRef} tabIndex={-1} className="text-2xl font-bold text-[#242220] tracking-tight">
                O Que Você Procura em Alguém?
              </h1>
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
                  <label htmlFor="profile-min-age" className="text-[11px] text-[#6E675D] block mb-1">Idade Mínima</label>
                  <input id="profile-min-age" inputMode="numeric" step={1}
                    type="number"
                    min={18}
                    max={99}
                    value={formData.minAge}
                    onChange={(e) => setFormData({ ...formData, minAge: Number(e.target.value) })}
                    className="w-full min-w-0 min-h-11 px-3 py-2 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm font-mono font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="profile-max-age" className="text-[11px] text-[#6E675D] block mb-1">Idade Máxima</label>
                  <input id="profile-max-age" inputMode="numeric" step={1}
                    type="number"
                    min={18}
                    max={99}
                    value={formData.maxAge}
                    onChange={(e) => setFormData({ ...formData, maxAge: Number(e.target.value) })}
                    className="w-full min-w-0 min-h-11 px-3 py-2 rounded-xl border border-[#DCD5C6] bg-white text-base sm:text-sm font-mono font-bold"
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
                  onClick={() => setFormData({ ...formData, missionRequirement: 'any' })} aria-pressed={formData.missionRequirement === 'any'}
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
                  onClick={() => setFormData({ ...formData, missionRequirement: 'must_have_served' })} aria-pressed={formData.missionRequirement === 'must_have_served'}
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
                      onClick={() => handleToggleIndispensable(item)} aria-pressed={isSelected}
                      className={`p-2.5 rounded-xl text-xs font-semibold transition-all border text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#D92B27] text-white border-[#D92B27] shadow-sm'
                          : 'bg-white text-[#3B3731] border-[#E7E0D3] hover:border-[#D92B27]'
                      }`}
                    >
                      <span className="min-w-0 break-words">{item}</span>
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
                      onClick={() => handleToggleNiceToHave(item)} aria-pressed={isSelected}
                      className={`p-2.5 rounded-xl text-xs font-semibold transition-all border text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B4A72] text-white border-[#0B4A72] shadow-sm'
                          : isIndispensable
                          ? 'opacity-30 bg-slate-100 border-transparent cursor-not-allowed'
                          : 'bg-white text-[#3B3731] border-[#E7E0D3] hover:border-[#0B4A72]'
                      }`}
                    >
                      <span className="min-w-0 break-words">{item}</span>
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
              <h1 ref={stepTitleRef} tabIndex={-1} className="text-2xl font-bold text-[#242220] tracking-tight">
                Confirmar participação
              </h1>
              <p className="text-xs text-[#6E675D] mt-1">
                Seu cadastro será salvo no sistema da atividade. Volte neste mesmo navegador para acompanhar seus matches. A organização não envia notificações automáticas.
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
                Tenho 18 anos ou mais e autorizo o armazenamento do meu perfil pela organização do <strong className="text-[#D92B27]">Encontro Marcado</strong> para calcular compatibilidades e exibir idade e interesses em comum a pares compatíveis. Entendo que nome, foto e contatos serão compartilhados com um par apenas quando nós dois aceitarmos.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting || photoProcessing}
              aria-busy={submitting}
              className="w-full min-h-14 py-3 px-4 bg-[#D92B27] hover:bg-[#C02420] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#D92B27]/25 transition-all cursor-pointer"
            >
              <span>{submitting ? 'Salvando seu perfil…' : 'Concluir Meu Cadastro'}</span>
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
              className="px-3 text-sm font-semibold text-[#6E675D] hover:text-[#242220] cursor-pointer"
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
