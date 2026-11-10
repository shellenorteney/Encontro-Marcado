import React, { useState } from 'react';
import { Award, Check, Sparkles, X, ArrowRight, RotateCcw } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/mockData';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAnswers: (answers: Record<string, string>) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onApplyAnswers,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({
    energy: 'introvert',
    weekend: 'culture',
    communication: 'deep_chats',
    growth: 'creativity',
  });
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (traitKey: string, traitValue: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [traitKey]: traitValue,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleFinish = () => {
    onApplyAnswers(selectedAnswers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isCompleted ? (
          <div>
            {/* Progress Header */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="flex items-center gap-1 font-semibold text-rose-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Teste de Sintonia & Valores</span>
              </span>
              <span className="font-mono tabular-nums">
                Pergunta {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Details */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
              {currentQ.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {currentQ.description}
            </p>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[opt.traitKey] === opt.traitValue;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.traitKey, opt.traitValue)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 ring-2 ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {opt.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {opt.sublabel}
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-rose-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <span>{currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? 'Concluir Teste' : 'Avançar'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Sintonia Recalculada! ✨
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto mb-6">
              Analisamos suas preferências de energia social, roteiros favoritos e valores. Suas porcentagens de compatibilidade com todos os perfis foram atualizadas!
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto text-left text-xs space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Energia:</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">
                  {selectedAnswers.energy === 'introvert' ? 'Intimista / Calmo' : selectedAnswers.energy === 'extrovert' ? 'Extrovertido / Eventos' : 'Equilíbrio Ambiverte'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Estilo de Fim de Semana:</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">
                  {selectedAnswers.weekend === 'culture' ? 'Cultural & Livros' : selectedAnswers.weekend === 'outdoors' ? 'Esportes & Ar Livre' : 'Descanso em Casa'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Comunicação:</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">
                  {selectedAnswers.communication === 'deep_chats' ? 'Papos Profundos' : 'Encontros Presenciais'}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full sm:w-auto px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/25 transition-colors whitespace-nowrap shrink-0"
            >
              Ver Perfis com Nova Sintonia
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
