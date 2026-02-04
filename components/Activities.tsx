
import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar, History, MessageSquare, Minus, Plus, Filter, LayoutList, Clock, Trash2, Edit2, X, Save } from 'lucide-react';
import { Client, Activity, ActivityType, ActivityCategory, Department } from '../types';
import { 
  ACTIVITY_TYPES_WEB, ACTIVITY_CATEGORIES_WEB, 
  ACTIVITY_TYPES_SOCIAL, ACTIVITY_CATEGORIES_SOCIAL 
} from '../constants';

interface ActivitiesProps {
  clients: Client[];
  history: Activity[];
  onAdd: (activity: Activity) => void;
  onUpdateHistory: (history: Activity[]) => void;
  department: Department;
}

const Activities: React.FC<ActivitiesProps> = ({ clients, onAdd, history, onUpdateHistory, department }) => {
  // Determinar opções baseado no departamento
  const currentTypes = department === 'social' ? ACTIVITY_TYPES_SOCIAL : ACTIVITY_TYPES_WEB;
  const currentCategories = department === 'social' ? ACTIVITY_CATEGORIES_SOCIAL : ACTIVITY_CATEGORIES_WEB;

  const [selectedClient, setSelectedClient] = useState('');
  const [type, setType] = useState<ActivityType>(currentTypes[0]);
  const [category, setCategory] = useState<ActivityCategory>(currentCategories[0]);
  const [quantity, setQuantity] = useState(1);
  const [otherDetails, setOtherDetails] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Forçar reset de tipo/categoria quando o departamento mudar
  useEffect(() => {
    setType(currentTypes[0]);
    setCategory(currentCategories[0]);
  }, [department]);

  const filteredHistory = history.filter(h => h.department === department);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    if (editingId) {
      const updatedHistory = history.map(h => h.id === editingId ? {
        ...h,
        clientId: selectedClient,
        type,
        category,
        quantity,
        otherDetails: category === 'Outros' ? otherDetails : undefined,
      } as Activity : h);
      onUpdateHistory(updatedHistory);
      setEditingId(null);
    } else {
      const newActivity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        clientId: selectedClient,
        date: new Date().toISOString().split('T')[0],
        type,
        category,
        quantity,
        otherDetails: category === 'Outros' ? otherDetails : undefined,
        timestamp: Date.now(),
        department: department
      };
      onAdd(newActivity);
    }

    setOtherDetails('');
    setQuantity(1);
    setSelectedClient('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este log?')) {
      onUpdateHistory(history.filter(h => h.id !== id));
    }
  };

  const handleEdit = (act: Activity) => {
    setEditingId(act.id);
    setSelectedClient(act.clientId);
    setType(act.type);
    setCategory(act.category);
    setQuantity(act.quantity);
    setOtherDetails(act.otherDetails || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const adjustQuantity = (amount: number) => setQuantity(prev => Math.max(1, prev + amount));
  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Cliente Excluído';

  return (
    <div className="p-8 h-full flex flex-col gap-8 max-w-[1400px] mx-auto overflow-hidden">
      {/* Runrun.it Style Tracker Bar */}
      <div className={`bg-white border rounded p-6 shadow-sm transition-all duration-300 ${editingId ? 'border-primary ring-2 ring-primary/10' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             {editingId ? '✏️ Editando Log de Produção' : '➕ Novo Registro de Atividade'}
           </h3>
           {editingId && (
             <button onClick={() => { setEditingId(null); setSelectedClient(''); setOtherDetails(''); }} className="text-slate-400 hover:text-rose-500"><X size={16} /></button>
           )}
        </div>
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Cliente / Projeto</label>
            <select required className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded px-4 py-2.5 outline-none font-bold focus:border-primary transition-all" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
              <option value="">Selecione o destino do log...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Ação</label>
            <div className="flex bg-slate-100 p-1 rounded gap-1">
              {currentTypes.map(t => (
                <button key={t} type="button" onClick={() => setType(t as ActivityType)} 
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded transition-all ${type === t ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Categoria</label>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded px-4 py-2.5 outline-none font-bold focus:border-primary" value={category} onChange={(e) => setCategory(e.target.value as ActivityCategory)}>
              {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="w-32">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Qtd.</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded px-2">
              <button type="button" onClick={() => adjustQuantity(-1)} className="p-2 text-slate-400 hover:text-primary"><Minus size={14} /></button>
              <input type="number" className="w-full bg-transparent text-center font-bold text-xs text-slate-800 outline-none" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
              <button type="button" onClick={() => adjustQuantity(1)} className="p-2 text-slate-400 hover:text-primary"><Plus size={14} /></button>
            </div>
          </div>

          <button onClick={handleSubmit} className="bg-primary hover:brightness-110 text-white font-bold uppercase text-[10px] tracking-widest px-8 py-3 rounded transition-all shadow-md active:scale-95 flex items-center gap-2">
            {editingId ? <><Save size={14} /> Atualizar Log</> : 'Registrar Log'}
          </button>
        </div>
        {category === 'Outros' && (
          <div className="mt-4 animate-in slide-in-from-top-2">
            <input type="text" className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded text-xs outline-none font-medium placeholder:text-slate-300 focus:border-primary shadow-inner" placeholder="Especifique os detalhes desta ação..." value={otherDetails} onChange={(e) => setOtherDetails(e.target.value)} />
          </div>
        )}
      </div>

      {/* History View */}
      <div className="flex-1 bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
             <LayoutList size={16} className="text-slate-400" />
             <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Logs Recentes - {department === 'social' ? 'Social Media' : 'Webdesigner'}</h3>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-primary uppercase transition-all">
             <Filter size={14} /> Filtros Avançados
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredHistory.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest w-40">Data</th>
                  <th className="px-8 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tarefa</th>
                  <th className="px-8 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Qtd</th>
                  <th className="px-8 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredHistory.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-4 text-[11px] font-medium text-slate-400">{act.date}</td>
                    <td className="px-8 py-4 font-bold text-slate-800 text-sm">{getClientName(act.clientId)}</td>
                    <td className="px-8 py-4">
                       <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                         act.type === 'Inclusão' || act.type === 'Desenvolvimento' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                         act.type === 'Exclusão' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                         'bg-primary/5 text-primary border-primary/20'
                       }`}>
                         {act.type} • {act.category}
                       </span>
                    </td>
                    <td className="px-8 py-4 text-center font-bold text-slate-600 text-xs">x{act.quantity}</td>
                    <td className="px-8 py-4 text-right">
                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleEdit(act)} className="p-1.5 text-slate-300 hover:text-primary transition-all rounded hover:bg-white border border-transparent hover:border-slate-100"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(act.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-all rounded hover:bg-white border border-transparent hover:border-slate-100"><Trash2 size={14} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-slate-300">
              <Clock size={48} className="opacity-10 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Sem logs registrados hoje</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activities;
