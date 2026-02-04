
import React, { useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { 
  Globe, Kanban, History, AlertCircle, CheckCircle2, Clock, Zap, Database, TrendingUp
} from 'lucide-react';
import { Client, Activity, ChecklistRecord, Project } from '../types';

interface DashboardProps {
  clients: Client[];
  activities: Activity[];
  checklists: ChecklistRecord[];
  projects: Project[];
  primaryColor: string;
}

const Dashboard: React.FC<DashboardProps> = ({ clients, activities, checklists, projects, primaryColor }) => {
  const completionRate = useMemo(() => {
    if (projects.length === 0) return 0;
    const completed = projects.filter(p => p.status === 'concluido').length;
    return Math.round((completed / projects.length) * 100);
  }, [projects]);

  const activityData = useMemo(() => {
    return clients.map(client => ({
      name: client.name.length > 10 ? client.name.substring(0, 8) + '...' : client.name,
      value: activities.filter(a => a.clientId === client.id).reduce((acc, curr) => acc + curr.quantity, 0)
    })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [clients, activities]);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Cards de Status Administrativo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex items-center justify-between group hover:border-primary transition-all">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Clientes Ativos</p>
            <h4 className="text-2xl font-black text-slate-800">{clients.length}</h4>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
            <Globe size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex items-center justify-between group hover:border-primary transition-all">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Projetos Abertos</p>
            <h4 className="text-2xl font-black text-slate-800">{projects.filter(p => p.status !== 'concluido').length}</h4>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
            <Kanban size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex items-center justify-between group hover:border-primary transition-all">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total de Atividades</p>
            <h4 className="text-2xl font-black text-slate-800">{activities.length}</h4>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
            <History size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex items-center justify-between group hover:border-primary transition-all">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saúde do Banco</p>
            <h4 className="text-2xl font-black text-emerald-600">Otimizado</h4>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
            <Database size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-slate-900 rounded-xl p-10 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                   <TrendingUp size={16} className="text-blue-400" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">Production Performance</span>
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-2">Painel de Controle CliqA</h2>
                <p className="text-slate-400 text-xs font-medium max-w-md leading-relaxed">Gestão centralizada de sites, projetos e monitoramento de atividades web e social media.</p>
                
                <div className="mt-10 flex gap-8">
                   <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Conclusão Geral</p>
                      <p className="text-2xl font-black text-white">{completionRate}%</p>
                   </div>
                   <div className="w-px h-10 bg-white/10"></div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Checklists Realizados</p>
                      <p className="text-2xl font-black text-white">{checklists.length}</p>
                   </div>
                </div>
             </div>
             <Zap size={240} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-8">Fluxo de Atendimento por Cliente</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? primaryColor : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Auditoria Hoje
                </h3>
                <span className="text-[10px] font-bold text-slate-400">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="p-6 space-y-3">
                 {clients.slice(0, 5).map(client => {
                   const isDone = checklists.some(h => h.clientId === client.id && h.date === new Date().toISOString().split('T')[0]);
                   return (
                     <div key={client.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-md hover:border-primary transition-all group">
                        <span className="text-[11px] font-bold text-slate-700">{client.name}</span>
                        {isDone ? (
                          <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Ok</span>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-slate-300">Pendente</span>
                        )}
                     </div>
                   );
                 })}
              </div>
           </div>

           <div className="bg-rose-600 rounded-lg p-8 text-white shadow-xl shadow-rose-900/20 relative overflow-hidden">
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                <AlertCircle size={14} /> Expirações Críticas
              </h3>
              <div className="space-y-4 relative z-10">
                 {clients.filter(c => {
                   if (!c.expirationDate) return false;
                   const diff = Math.ceil((new Date(c.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                   return diff <= 30;
                 }).map(c => (
                   <div key={c.id} className="bg-white/10 p-4 rounded-md backdrop-blur-md flex justify-between items-center border border-white/10">
                      <span className="text-[11px] font-bold">{c.name}</span>
                      <span className="text-[10px] font-black bg-white text-rose-600 px-2 py-0.5 rounded">30 Dias</span>
                   </div>
                 ))}
                 {clients.filter(c => c.expirationDate && Math.ceil((new Date(c.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30).length === 0 && (
                    <p className="text-[10px] text-white/60 font-medium text-center py-4">Nenhum domínio em risco.</p>
                 )}
              </div>
              <AlertCircle size={120} className="absolute -right-10 -bottom-10 text-white/5" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
