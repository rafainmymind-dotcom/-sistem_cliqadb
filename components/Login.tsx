
import React, { useState } from 'react';
import { Lock, User as UserIcon, LogIn, AlertCircle } from 'lucide-react';
import { User, SystemConfig } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
  config: SystemConfig;
}

const Login: React.FC<LoginProps> = ({ onLogin, users, config }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Acesso negado. Verifique usuário e senha.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 text-center bg-slate-900">
            <div className="mb-4 flex justify-center">
              {config?.agencyLogoUrl ? (
                <img src={config.agencyLogoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-12 h-12 bg-primary rounded flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {config?.agencyName?.charAt(0) || 'C'}
                </div>
              )}
            </div>
            <h1 className="text-sm font-bold text-white tracking-widest uppercase">{config?.agencyName || 'CliqA Panel'}</h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
              {config?.agencySlogan || 'Enterprise Workspace'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-3 rounded flex items-center gap-3 text-rose-600 animate-in shake duration-300">
                <AlertCircle size={14} />
                <p className="text-[11px] font-bold">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Identificação</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    placeholder="E-mail ou Usuário"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded text-sm font-medium outline-none focus:border-primary transition-all shadow-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded text-sm font-medium outline-none focus:border-primary transition-all shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:brightness-110 text-white font-bold uppercase text-[11px] tracking-widest py-3.5 rounded transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer min-h-[44px]"
            >
              Entrar no Sistema <LogIn size={16} />
            </button>
            
            <div className="text-center pt-4 border-t border-slate-50">
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                Versão {config?.systemVersion || '4.0'} • CliqA Produtividade
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
