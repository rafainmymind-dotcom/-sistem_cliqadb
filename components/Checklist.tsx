
import React, { useState, useMemo } from 'react';
import { ClipboardCheck, Save, CheckCircle, MessageSquare, Settings, Plus, Trash2, Edit3, X, Check, Eye, EyeOff, ArrowLeft, Clock, Search, Globe, ChevronRight, Hash } from 'lucide-react';
import { Client, ChecklistRecord, ChecklistItem, ChecklistDefinition } from '../types';

interface ChecklistProps {
  clients: Client[];
  history: ChecklistRecord[];
  definitions: ChecklistDefinition[];
  onSave: (record: ChecklistRecord) => void;
  onUpdateDefinitions: (defs: ChecklistDefinition[]) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ clients, onSave, history, definitions, onUpdateDefinitions }) => {
  const [activeSubTab, setActiveSubTab] = useState<'perform' | 'config'>('perform');
  const [selectedClient, setSelectedClient] = useState('');
  const [summary, setSummary] = useState('');
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [siteFilter, setSiteFilter] = useState('');

  const [defLabel, setDefLabel] = useState('');
  const [defHasQuantity, setDefHasQuantity] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const sitesStatus = useMemo(() => {
    return clients.map(client => {
      const isDone = history.some(h => h.clientId === client.id && h.date === todayStr);
      return { ...client, isDone };
    }).filter(c => c.name.toLowerCase().includes(siteFilter.toLowerCase()));
  }, [clients, history, todayStr, siteFilter]);

  const handleToggle = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: Math.max(0, qty) } : item));
  };

  const handleSaveChecklist = () => {
    if (!selectedClient) return;
    const record: ChecklistRecord = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: selectedClient,
      date: todayStr,
      summary,
      items,
      timestamp: Date.now()
    };
    onSave(record);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedClient('');
      setSummary('');
      setItems([]);
    }, 2000);
  };

  const handleClientSelect = (id: string) => {
    setSelectedClient(id);
    if (!id) return;
    const existing = history.find(h => h.clientId === id && h.date === todayStr);
    if (existing) {
      setItems(existing.items);
      setSummary(existing.summary);
    } else {
      setItems(definitions.filter(def => !def.isHidden).map(def => ({
        id: def.id, label: def.label, checked: false, comment: '', quantity: def.hasQuantity ? 0 : undefined
      })));
      setSummary('');
    }
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center py-40 animate-in fade-in duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} strokeWidth={3} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Relatório Enviado</h3>
          <p className="text-xs text-slate-400 mt-2">Dados persistidos com sucesso no histórico.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      {/* Sub Tabs Runrun Style */}
      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveSubTab('perform')} className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeSubTab === 'perform' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
          Checklist Diário
          {activeSubTab === 'perform' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
        </button>
        <button onClick={() => setActiveSubTab('config')} className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeSubTab === 'config' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
          Configurar Itens
          {activeSubTab === 'config' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
        </button>
      </div>

      {activeSubTab === 'perform' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Site Selector Column */}
          <div className="lg:col-span-1 space-y-4">
             <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                   <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selecione o Site</h4>
                   <div className="relative">
                      <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input type="text" className="pl-7 pr-3 py-1 bg-white border border-slate-200 rounded text-[9px] outline-none w-28 focus:border-primary transition-all" value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} placeholder="Filtrar..." />
                   </div>
                </div>
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                   {sitesStatus.map(site => (
                     <button key={site.id} onClick={() => handleClientSelect(site.id)} className={`w-full flex items-center justify-between p-4 border-b border-slate-50 transition-all text-left ${selectedClient === site.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50'}`}>
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-xs font-bold ${site.isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{site.name}</span>
                          <span className="text-[9px] text-slate-400 font-medium">{site.domain}</span>
                        </div>
                        {site.isDone ? <CheckCircle size={14} className="text-emerald-500" /> : <ChevronRight size={14} className="text-slate-300" />}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          {/* Audit Column */}
          <div className="lg:col-span-2">
             {selectedClient ? (
               <div className="bg-white border border-slate-200 rounded shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                     <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Relatório de Auditoria: {clients.find(c => c.id === selectedClient)?.name}</h3>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Conclua todos os itens para finalizar</p>
                     </div>
                     <button onClick={() => setSelectedClient('')} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase flex items-center gap-1 transition-all"><X size={14} /> Fechar</button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {items.map((item) => (
                      <div key={item.id} className={`p-4 border rounded transition-all ${item.checked ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleToggle(item.id)}>
                             <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-200'}`}>
                                {item.checked && <Check size={12} strokeWidth={4} />}
                             </div>
                             <span className={`text-xs font-bold ${item.checked ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</span>
                          </div>
                          
                          {item.quantity !== undefined && (
                            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded border border-slate-200">
                               <span className="text-[8px] font-black uppercase text-slate-400 px-1">Qtd</span>
                               <input 
                                 type="number" 
                                 className="w-12 bg-white border border-slate-100 rounded text-center text-xs font-bold p-1 outline-none focus:border-primary"
                                 value={item.quantity}
                                 onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 0)}
                               />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Observações Finais / Logs Extras</label>
                     <textarea className="w-full bg-slate-50 border border-slate-200 rounded p-4 text-xs outline-none focus:border-primary transition-all min-h-[1200px] font-medium placeholder:text-slate-300 shadow-inner" placeholder="Digite detalhes relevantes observados durante a revisão..." value={summary} onChange={(e) => setSummary(e.target.value)} />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button onClick={handleSaveChecklist} className="bg-primary hover:brightness-110 text-white px-10 py-3 rounded font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95 flex items-center gap-2">
                      <Save size={16} /> Finalizar Relatório Diário
                    </button>
                  </div>
               </div>
             ) : (
               <div className="bg-slate-50 border border-slate-200 border-dashed rounded h-[600px] flex flex-col items-center justify-center text-slate-300">
                  <ClipboardCheck size={64} className="opacity-10 mb-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Selecione um site na lateral para auditar</p>
               </div>
             )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 border border-slate-200 rounded shadow-sm sticky top-24">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Novo Critério</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Descrição</label>
                  <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:border-primary transition-all font-bold" placeholder="Ex: Verificar Certificado SSL" value={defLabel} onChange={(e) => setDefLabel(e.target.value)} />
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${defHasQuantity ? 'bg-primary border-primary text-white' : 'bg-slate-50 border-slate-200 group-hover:border-primary'}`}>
                    {defHasQuantity && <Check size={12} strokeWidth={4} />}
                  </div>
                  <input type="checkbox" className="hidden" checked={defHasQuantity} onChange={(e) => setDefHasQuantity(e.target.checked)} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Solicitar Quantidade Numérica</span>
                </label>

                <button onClick={() => { if (!defLabel.trim()) return; onUpdateDefinitions([...definitions, { id: Math.random().toString(36).substr(2, 9), label: defLabel, hasQuantity: defHasQuantity, isHidden: false }]); setDefLabel(''); setDefHasQuantity(false); }} className="w-full bg-primary hover:brightness-110 text-white font-bold uppercase text-[10px] py-3 rounded shadow-md transition-all active:scale-95">Adicionar à Lista</button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded shadow-sm flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Matriz de Auditoria</h3>
                 <span className="text-[10px] font-black text-slate-300 uppercase">{definitions.length} itens ativos</span>
              </div>
              <div className="p-4 space-y-2">
                {definitions.map((def) => (
                  <div key={def.id} className="flex items-center justify-between p-3 border border-slate-100 rounded hover:bg-slate-50 group transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700">{def.label}</span>
                      {def.hasQuantity && <Hash size={12} className="text-primary" />}
                    </div>
                    <button onClick={() => onUpdateDefinitions(definitions.filter(d => d.id !== def.id))} className="text-slate-300 hover:text-rose-500 p-1.5 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklist;
