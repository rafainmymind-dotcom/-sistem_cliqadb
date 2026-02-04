
import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, Shield, X, Save, User as UserIcon, Check, Settings, Mail } from 'lucide-react';
import { User, UserRole, SystemConfig } from '../types';
import { MENU_ITEMS } from '../constants';

interface UsersManagementProps {
  users: User[];
  onUpdate: (users: User[]) => void;
  currentUser: User;
  systemConfig: SystemConfig;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ users, onUpdate, currentUser, systemConfig }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    username: '', password: '', role: 'staff', allowedTabs: ['dashboard']
  });

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({ username: '', password: '', role: 'staff', allowedTabs: ['dashboard'] });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.username || !formData.password) return;
    let updatedUsers = editingUser 
      ? users.map(u => u.id === editingUser.id ? { ...u, ...formData } as User : u)
      : [...users, { id: Math.random().toString(36).substr(2, 9), ...formData } as User];
    onUpdate(updatedUsers);
    setIsModalOpen(false);
  };

  const toggleTab = (tabId: string) => {
    const currentTabs = formData.allowedTabs || [];
    setFormData({ ...formData, allowedTabs: currentTabs.includes(tabId) ? currentTabs.filter(id => id !== tabId) : [...currentTabs, tabId] });
  };

  const getSectionLabel = (sectionId: string) => {
    if (sectionId === 'WEBDESIGNER') return systemConfig.webLabel || 'WEBDESIGNER';
    if (sectionId === 'SOCIAL MIDIA') return systemConfig.socialLabel || 'SOCIAL MIDIA';
    return sectionId;
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Membros da Equipe</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gerenciamento centralizado de acessos</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-primary hover:brightness-110 text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center gap-2">
          <UserPlus size={16} /> Adicionar Membro
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded flex items-center justify-center border transition-all ${user.role === 'admin' ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  {user.role === 'admin' ? <Shield size={22} /> : <UserIcon size={22} />}
                </div>
                <div>
                   <h3 className="font-bold text-slate-800 text-sm leading-tight">{user.username}</h3>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-primary' : 'text-slate-400'}`}>
                     {user.role === 'admin' ? 'Master Admin' : 'Colaborador'}
                   </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenModal(user)} className="p-2 text-slate-300 hover:text-primary hover:bg-primary/5 rounded transition-all"><Edit2 size={16} /></button>
                <button onClick={() => user.id !== currentUser.id && onUpdate(users.filter(u => u.id !== user.id))} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-all"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50">
               <div className="flex flex-wrap gap-1.5">
                  {user.role === 'admin' ? (
                    <div className="text-[9px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2.5 py-1 rounded border border-primary/20 flex items-center gap-1.5 w-full">
                      <Settings size={12} /> Acesso Total ao Workspace
                    </div>
                  ) : (
                    user.allowedTabs.map(t => (
                      <span key={t} className="text-[8px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-500 border border-slate-200">
                        {t.split('-').join(' ')}
                      </span>
                    ))
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-200">
            <div className="px-8 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
               <h3 className="text-lg font-bold text-slate-800">
                 {editingUser ? 'Editar Membro' : 'Novo Membro da Equipe'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all"><X size={20} /></button>
            </div>
            
            <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Usuário / Login</label>
                   <input type="text" className="w-full bg-white border border-slate-200 p-3 rounded text-sm font-medium outline-none focus:border-primary transition-all" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="nome.sobrenome" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Senha Provisória</label>
                   <input type="password" className="w-full bg-white border border-slate-200 p-3 rounded text-sm font-medium outline-none focus:border-primary transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
                </div>
              </div>

              <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Nível de Permissão</label>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFormData({...formData, role: 'admin'})}
                      className={`flex items-center gap-4 p-4 rounded border transition-all text-left ${formData.role === 'admin' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-primary/40'}`}
                    >
                      <Shield size={24} />
                      <div>
                         <p className="text-xs font-bold uppercase tracking-tight">Administrador</p>
                         <p className="text-[9px] opacity-70">Acesso completo a configurações e usuários</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, role: 'staff'})}
                      className={`flex items-center gap-4 p-4 rounded border transition-all text-left ${formData.role === 'staff' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-primary/40'}`}
                    >
                      <UserIcon size={24} />
                      <div>
                         <p className="text-xs font-bold uppercase tracking-tight">Staff Operacional</p>
                         <p className="text-[9px] opacity-70">Acesso restrito a módulos de produção</p>
                      </div>
                    </button>
                 </div>
              </div>

              {formData.role === 'staff' && (
                <div className="space-y-4 animate-in fade-in pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Check size={14} className="text-primary" /> Selecione as áreas de acesso:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                      {MENU_ITEMS.filter(m => !['dashboard', 'clients'].includes(m.id)).map(m => {
                        const isActive = formData.allowedTabs?.includes(m.id);
                        return (
                          <button 
                            key={m.id} 
                            onClick={() => toggleTab(m.id)} 
                            className={`flex items-center gap-3 px-4 py-3 rounded border text-left transition-all ${isActive ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isActive ? 'bg-primary border-primary text-white' : 'bg-slate-100 border-slate-200'}`}>
                              {isActive && <Check size={10} strokeWidth={4} />}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-tight">
                              {m.label} ({getSectionLabel(m.section)})
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            <div className="px-10 py-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600 transition-all">Cancelar</button>
              <button onClick={handleSave} className="bg-primary hover:brightness-110 text-white px-10 py-3 rounded font-bold text-[11px] uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center gap-2">
                <Save size={16} /> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
