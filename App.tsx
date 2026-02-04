
import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, User as UserIcon, Menu, Bell, Search, PanelLeftClose, PanelLeftOpen, RefreshCcw, Cloud, CloudCheck, AlertCircle } from 'lucide-react';
import { Client, Activity, ChecklistRecord, ChecklistDefinition, Project, User, SystemConfig } from './types';
import { MENU_ITEMS, ADMIN_MENU_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Checklist from './components/Checklist';
import Clients from './components/Clients';
import Projects from './components/Projects';
import UsersManagement from './components/UsersManagement';
import Settings from './components/Settings';
import Login from './components/Login';

const API_URL = 'api.php';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'online' | 'syncing' | 'offline'>('online');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [checklists, setChecklists] = useState<ChecklistRecord[]>([]);
  const [checklistDefinitions, setChecklistDefinitions] = useState<ChecklistDefinition[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    agencyName: 'CliqA',
    agencySlogan: 'Digital Agency',
    agencyLogoUrl: '',
    primaryColor: '#2563EB',
    selectionColor: '#EFF6FF',
    themeFont: 'sans',
    systemVersion: 'v5.3 MySQL Cloud',
    webLabel: 'WEBDESIGNER',
    socialLabel: 'SOCIAL MIDIA'
  });

  const saveToMySQL = useCallback(async (key: string, data: any) => {
    setCloudStatus('syncing');
    setIsSyncing(true);
    try {
      const response = await fetch(`${API_URL}?action=save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data })
      });
      const result = await response.json();
      if (result.status === 'success') {
        setCloudStatus('online');
      } else {
        setCloudStatus('offline');
      }
    } catch (e) {
      console.error('Falha na sincronização MySQL:', e);
      setCloudStatus('offline');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const response = await fetch(`${API_URL}?action=load_all`);
        
        if (!response.ok) {
          throw new Error(`Servidor respondeu com erro HTTP: ${response.status}`);
        }

        const textResponse = await response.text();
        let serverData;
        
        try {
          // Tenta limpar espaços em branco que podem causar o erro relatado
          serverData = JSON.parse(textResponse.trim());
        } catch (parseError) {
          console.error("DEBUG: Conteúdo inválido recebido do PHP:", textResponse);
          throw new Error("O servidor enviou uma resposta inválida. Verifique se o api.php está configurado corretamente.");
        }

        if (serverData.status === 'error') {
          throw new Error(serverData.message);
        }

        if (serverData['cliqa_config']) setSystemConfig(serverData['cliqa_config']);
        if (serverData['cliqa_clients']) setClients(serverData['cliqa_clients']);
        if (serverData['cliqa_activities']) setActivities(serverData['cliqa_activities']);
        if (serverData['cliqa_checklists']) setChecklists(serverData['cliqa_checklists']);
        if (serverData['cliqa_projects']) setProjects(serverData['cliqa_projects']);
        if (serverData['cliqa_checklist_defs']) setChecklistDefinitions(serverData['cliqa_checklist_defs']);
        
        if (serverData['cliqa_users']) {
          setUsers(serverData['cliqa_users']);
        } else {
          const defaultAdmin: User = { 
            id: 'admin-1', username: 'admin', password: '123', role: 'admin', 
            allowedTabs: [...MENU_ITEMS.map(m => m.id), ...ADMIN_MENU_ITEMS.map(m => m.id)] 
          };
          setUsers([defaultAdmin]);
          saveToMySQL('cliqa_users', [defaultAdmin]);
        }

        const savedSession = localStorage.getItem('cliqa_session');
        if (savedSession) {
          const user = JSON.parse(savedSession);
          setCurrentUser(user);
          setIsLoggedIn(true);
          setActiveTab(user.role === 'admin' ? 'dashboard' : (user.allowedTabs[0] || 'dashboard'));
        }
        setErrorMessage(null);
      } catch (e: any) {
        console.error('Erro de Carregamento:', e);
        setCloudStatus('offline');
        setErrorMessage(e.message || "Falha na comunicação com o banco de dados.");
      } finally {
        setIsDataReady(true);
      }
    };
    loadAppData();
  }, [saveToMySQL]);

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair?')) {
      localStorage.removeItem('cliqa_session');
      window.location.reload();
    }
  };

  const renderContent = () => {
    if (!isDataReady) return null;
    const props = {
      clients, activities, checklists, projects,
      onUpdateActivities: (a: Activity[]) => { setActivities(a); saveToMySQL('cliqa_activities', a); },
      onUpdateClients: (c: Client[]) => { setClients(c); saveToMySQL('cliqa_clients', c); },
      onUpdateProjects: (p: Project[]) => { setProjects(p); saveToMySQL('cliqa_projects', p); },
      onUpdateChecklists: (r: ChecklistRecord[]) => { setChecklists(r); saveToMySQL('cliqa_checklists', r); },
      onUpdateDefinitions: (d: ChecklistDefinition[]) => { setChecklistDefinitions(d); saveToMySQL('cliqa_checklist_defs', d); }
    };

    switch (activeTab) {
      case 'dashboard': return <Dashboard {...props} primaryColor={systemConfig.primaryColor} />;
      case 'web-projects':
      case 'social-projects': return <Projects projects={projects} onUpdate={props.onUpdateProjects} clients={clients} department={activeTab.includes('web') ? 'web' : 'social'} users={users} currentUser={currentUser!} />;
      case 'web-activities':
      case 'social-activities': return <Activities key={activeTab} clients={clients} onAdd={(a) => props.onUpdateActivities([a, ...activities])} onUpdateHistory={props.onUpdateActivities} history={activities} department={activeTab.includes('web') ? 'web' : 'social'} />;
      case 'web-checklist': return <Checklist clients={clients} onSave={(r) => props.onUpdateChecklists([r, ...checklists])} history={checklists} definitions={checklistDefinitions} onUpdateDefinitions={props.onUpdateDefinitions} />;
      case 'clients': return <Clients clients={clients} onUpdate={props.onUpdateClients} />;
      case 'users': return <UsersManagement users={users} onUpdate={(u) => { setUsers(u); saveToMySQL('cliqa_users', u); }} currentUser={currentUser!} systemConfig={systemConfig} />;
      case 'settings': return <Settings config={systemConfig} onUpdateConfig={(c) => { setSystemConfig(c); saveToMySQL('cliqa_config', c); }} adminUser={users.find(u => u.role === 'admin')} onUpdateAdmin={(u) => { const nu = users.map(us => us.id === u.id ? u : us); setUsers(nu); saveToMySQL('cliqa_users', nu); }} />;
      default: return <Dashboard {...props} primaryColor={systemConfig.primaryColor} />;
    }
  };

  if (!isDataReady) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 gap-4">
      <RefreshCcw size={32} className="text-primary animate-spin" />
      <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Autenticando na CliqA Cloud...</span>
    </div>
  );

  if (errorMessage && !isLoggedIn) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 p-6 text-center">
        <AlertCircle size={48} className="text-rose-500 mb-4" />
        <h2 className="text-white font-bold mb-2">Erro de Conexão</h2>
        <p className="text-slate-400 text-xs max-w-md mb-6">{errorMessage}</p>
        <button onClick={() => window.location.reload()} className="bg-primary text-white px-8 py-3 rounded font-bold uppercase text-[10px] tracking-widest">Tentar Novamente</button>
      </div>
    );
  }

  const filteredMenuItems = MENU_ITEMS.filter(item => currentUser?.role === 'admin' || currentUser?.allowedTabs.includes(item.id));
  const sections = Array.from(new Set(filteredMenuItems.map(m => m.section)));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        :root { 
          --primary-color: ${systemConfig.primaryColor}; 
          --primary-selection: ${systemConfig.selectionColor}; 
        }
        .active-tab { background-color: var(--primary-color) !important; color: white !important; }
      `}} />

      {!isLoggedIn ? (
        <Login users={users} onLogin={(u) => { setCurrentUser(u); setIsLoggedIn(true); localStorage.setItem('cliqa_session', JSON.stringify(u)); }} config={systemConfig} />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white transition-all duration-300 flex flex-col z-50 shrink-0 shadow-2xl`}>
            <div className="h-16 flex items-center px-6 border-b border-white/5 bg-slate-950 justify-between">
              {!isSidebarCollapsed && <span className="font-black text-xs tracking-widest uppercase">{systemConfig.agencyName}</span>}
              <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-slate-500 hover:text-white"><Menu size={18} /></button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
              {sections.map(section => (
                <div key={section} className="space-y-1">
                  {!isSidebarCollapsed && <span className="px-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{section === 'WEBDESIGNER' ? systemConfig.webLabel : section === 'SOCIAL MIDIA' ? systemConfig.socialLabel : section}</span>}
                  {filteredMenuItems.filter(m => m.section === section).map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-3 py-2.5 rounded transition-all ${activeTab === item.id ? 'active-tab shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                      {item.icon}
                      {!isSidebarCollapsed && <span className="text-[11px] font-bold uppercase tracking-tight">{item.label}</span>}
                    </button>
                  ))}
                </div>
              ))}
            </nav>

            <div className="p-4 bg-slate-950 border-t border-white/5 space-y-1">
              {ADMIN_MENU_ITEMS.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-3 py-2 rounded transition-all ${activeTab === item.id ? 'active-tab' : 'text-slate-500 hover:text-white'}`}>
                  {item.icon}
                  {!isSidebarCollapsed && <span className="text-[11px] font-bold uppercase tracking-tight">{item.label}</span>}
                </button>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-4 px-3 py-2 text-slate-500 hover:text-rose-400 transition-all mt-2">
                <LogOut size={18} />
                {!isSidebarCollapsed && <span className="text-[11px] font-bold uppercase tracking-tight">Encerrar</span>}
              </button>
            </div>
          </aside>

          <main className="flex-1 flex flex-col min-w-0">
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-40">
              <div className="flex items-center gap-4">
                 <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${cloudStatus === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {cloudStatus === 'syncing' ? <RefreshCcw size={10} className="animate-spin" /> : <CloudCheck size={10} />}
                    {cloudStatus === 'online' ? 'MySQL Ativo' : 'Sincronizando...'}
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900 leading-none">{currentUser?.username}</p>
                    <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">ID: {currentUser?.id.substring(0,5)}</p>
                 </div>
                 <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary font-black text-xs uppercase shadow-sm">
                    {currentUser?.username?.charAt(0)}
                 </div>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;