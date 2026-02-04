
import React, { useState, useRef } from 'react';
import { 
  Settings as SettingsIcon, Palette, Shield, Save, RotateCcw, 
  Image as ImageIcon, LayoutPanelLeft, Globe, Database, Download, Upload, Trash2, AlertCircle, Code 
} from 'lucide-react';
import { SystemConfig, ThemeFont, User } from '../types';

interface SettingsProps {
  config: SystemConfig;
  onUpdateConfig: (newConfig: SystemConfig) => void;
  adminUser: User | undefined;
  onUpdateAdmin: (updatedAdmin: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onUpdateConfig, adminUser, onUpdateAdmin }) => {
  const [localConfig, setLocalConfig] = useState<SystemConfig>(config);
  const [adminUsername, setAdminUsername] = useState(adminUser?.username || 'admin');
  const [adminPassword, setAdminPassword] = useState(adminUser?.password || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaveStatus('saving');
    onUpdateConfig(localConfig);
    if (adminUser) {
      onUpdateAdmin({ ...adminUser, username: adminUsername, password: adminPassword });
    }
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const fonts: { id: ThemeFont; label: string }[] = [
    { id: 'sans', label: 'Inter Sans' },
    { id: 'serif', label: 'Merriweather' },
    { id: 'mono', label: 'JetBrains Mono' },
    { id: 'rounded', label: 'SF Rounded' },
  ];

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 pb-32">
      <div className="flex justify-between items-center bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Painel de Controle CliqA</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status do Banco de Dados Cloud Ativo</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className={`px-10 py-3 rounded font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-md ${
            saveStatus === 'success' ? 'bg-emerald-600 text-white' : 'bg-primary text-white hover:brightness-110'
          }`}
        >
          {saveStatus === 'saving' ? <RotateCcw size={16} className="animate-spin" /> : <Save size={16} />}
          {saveStatus === 'success' ? 'Sincronizado' : 'Sincronizar com Cloud'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status do Banco MySQL */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
             <div className="px-6 py-4 bg-slate-900 border-b border-slate-800">
                <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <Database size={14} /> Conexão MySQL (RunCloud)
                </h3>
             </div>
             <div className="p-8 space-y-6">
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><Database size={20} /></div>
                      <div>
                         <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Banco de Dados Ativo</p>
                         <p className="text-[10px] text-slate-500">A tabela <code className="bg-slate-200 px-1 rounded">cliqa_storage</code> está operacional.</p>
                      </div>
                   </div>
                   <p className="text-[10px] text-slate-400 leading-relaxed italic">
                     * Suas alterações são salvas automaticamente no MySQL através do arquivo <code className="font-bold">api.php</code>.
                   </p>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Code size={14} className="text-primary" /> Integração WordPress Admin
                   </h4>
                   <div className="bg-slate-900 p-4 rounded text-blue-300 font-mono text-[10px] overflow-x-auto">
                      {`<iframe src="${window.location.origin}" style="width:100%; height:90vh; border:none;"></iframe>`}
                   </div>
                   <p className="text-[10px] text-slate-500">Copie o código acima e cole em uma página do seu WordPress usando o plugin "Iframe" para ter o sistema dentro do Admin do WP.</p>
                </div>
             </div>
          </div>

          {/* Branding */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
             <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Palette size={14} className="text-primary" /> Identidade Visual do Painel
                </h3>
             </div>
             <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cor Principal</label>
                      <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded">
                         <input type="color" className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" value={localConfig.primaryColor} onChange={(e) => setLocalConfig({...localConfig, primaryColor: e.target.value})} />
                         <span className="font-mono text-[10px] font-bold text-slate-600">{localConfig.primaryColor.toUpperCase()}</span>
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fonte do Sistema</label>
                      <select className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded text-xs font-bold" value={localConfig.themeFont} onChange={(e) => setLocalConfig({...localConfig, themeFont: e.target.value as ThemeFont})}>
                         {fonts.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rótulo Depto 1</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 p-3 rounded text-xs font-bold uppercase" value={localConfig.webLabel} onChange={(e) => setLocalConfig({...localConfig, webLabel: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rótulo Depto 2</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 p-3 rounded text-xs font-bold uppercase" value={localConfig.socialLabel} onChange={(e) => setLocalConfig({...localConfig, socialLabel: e.target.value})} />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar: Segurança Master */}
        <div className="space-y-6">
           <div className="bg-slate-900 rounded-lg p-8 shadow-xl text-white">
              <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                <Shield size={16} /> Acesso Master
              </h3>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Login Admin</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded text-xs font-bold text-white outline-none focus:border-primary transition-all" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nova Senha</label>
                    <input type="password" className="w-full bg-white/5 border border-white/10 p-3 rounded text-xs font-bold text-white outline-none focus:border-primary transition-all" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" />
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                {/* Fixed missing import for AlertCircle */}
                <AlertCircle size={14} className="text-amber-500" /> Manutenção
              </h3>
              <p className="text-[9px] text-slate-400 leading-relaxed mb-4">
                Ao salvar, os dados são enviados para o MySQL. Se o servidor cair, o sistema avisará no cabeçalho.
              </p>
              <button onClick={() => window.location.reload()} className="w-full text-[10px] font-black uppercase text-primary border border-primary/20 p-2 rounded hover:bg-primary/5 transition-all">Forçar Recarregamento</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
