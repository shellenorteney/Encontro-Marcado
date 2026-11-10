import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Valid credentials: 'organizador', 'admin' or user email, with password 'conexao2026' or 'admin123'
    const validUsers = ['organizador', 'admin', 'shellenorteney@gmail.com', 'shellenorteney'];
    const validPasswords = ['conexao2026', 'admin123', 'conexao'];

    if (validUsers.includes(cleanUser) && validPasswords.includes(cleanPass)) {
      onLoginSuccess();
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setErrorMessage('Credenciais incorretas. Acesso restrito ao organizador responsável pelo baile.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242220]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#E7E0D3] shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF7F2] text-[#7A7369] hover:text-[#242220] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D92B27] flex items-center justify-center mx-auto mb-3 shadow-sm border border-red-100">
          <Lock className="w-6 h-6" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-wider text-[#0B4A72] bg-[#0B4A72]/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
          Caxingui + SP Norte
        </span>

        <h2 className="text-xl font-bold text-[#242220] tracking-tight">
          Acesso do Organizador
        </h2>
        <p className="text-xs text-[#6E675D] mt-1 mb-5">
          Gestão e acompanhamento dos matches do Aulão e Baile.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-[#D92B27] text-xs font-semibold border border-red-200 flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div>
            <label className="block text-xs font-bold text-[#3B3731] mb-1">
              Usuário ou E-mail
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ex: organizador"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B3731] mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Sua senha de organizador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C6] bg-white text-xs text-[#242220] focus:outline-none focus:ring-2 focus:ring-[#D92B27] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#7A7369] hover:text-[#242220] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-[#7A7369] mt-1">
              Dica: usuário <strong className="text-[#242220]">organizador</strong> e senha <strong className="text-[#242220]">conexao2026</strong>
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#0B4A72] hover:bg-[#083857] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Entrar no Painel do Baile
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
