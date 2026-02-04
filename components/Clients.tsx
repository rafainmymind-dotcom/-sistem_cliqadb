
import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, Globe, Calendar, Server, Search, ExternalLink, X, Save, Image as ImageIcon, Plus, Minus } from 'lucide-react';
import { Client, ClientStatus } from '../types';
import { HOSTING_PROVIDERS } from '../constants';

interface ClientsProps {
  clients: Client[];
  onUpdate: (clients: Client[]) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOtherHosting, setIsOtherHosting] = useState(false);
  const [customHosting, setCustomHosting] = useState('');

  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    domain: '',
    otherDomains: [],
    logoUrl: '',
    expirationDate: '',
    hosting: '',
    status: ClientStatus.ACTIVE
  });

  const handleOpenModal = (client: Client | null = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        ...client,
        otherDomains: client.otherDomains || []
      });
      const isPreset = HOSTING_PROVIDERS.filter(h => h !== 'Outros').includes(client.hosting);
      if (!isPreset && client.hosting) {
        setIsOtherHosting(true);
        setCustomHosting(client.hosting);
      } else {
        setIsOtherHosting(client.hosting === 'Outros');
        setCustomHosting('');
      }
    } else {
      setEditingClient(null);
      setFormData({
        name: '', domain: '', otherDomains: [], logoUrl: '', expirationDate: '', hosting: '', status: ClientStatus.ACTIVE
      });
      setIsOtherHosting(false);
      setCustomHosting('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.domain) return;
    const finalHosting = isOtherHosting ? customHosting : formData.hosting;
    let status = formData.status || ClientStatus.ACTIVE;
    
    let updatedClients;
    if (editingClient) {
      updatedClients = clients.map(c => c.id === editingClient.id ? { ...c, ...formData, hosting: finalHosting, status } as Client : c);
    } else {
      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        hosting: finalHosting,
        status
      } as Client;
      updatedClients = [newClient, ...clients];
    }
    onUpdate(updatedClients);
    setIsModalOpen(false);
  };

  const addOtherDomain = () => {
    setFormData({
      ...formData,
      otherDomains: [...(formData.otherDomains || []), '']
    });
  };

  const removeOtherDomain = (index: number) => {
    const updated = [...(formData.otherDomains || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, otherDomains: updated });
  };

  const updateOtherDomain = (index: number, value: string) => {
    const updated = [...(formData.otherDomains || [])];
    updated[index] = value;
    setFormData({ ...formData, otherDomains: updated });
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar site ou cliente..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold outline-none focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => handleOpenModal()} className="bg-primary hover:brightness-110 text-white px-6 py-2.5 rounded font-bold text-[11px] uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center gap-2">
          <UserPlus size={16} /> Registrar Site
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Identificação</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Endereço Web</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expiração</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Provedor</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredClients.length > 0 ? filteredClients.map(client => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                      {client.logoUrl ? (
                        <img src={client.logoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={14} /></div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs">
                      {client.domain}
                      <a href={`https://${client.domain}`} target="_blank" className="text-slate-300 hover:text-primary transition-colors"><ExternalLink size={12} /></a>
                    </div>
                    {client.otherDomains?.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-400 font-medium text-[9px]">
                        {d}
                        <a href={`https://${d}`} target="_blank" className="text-slate-200 hover:text-slate-400 transition-colors"><ExternalLink size={10} /></a>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-[11px] font-medium text-slate-500">{client.expirationDate || '---'}</td>
                <td className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{client.hosting || 'Indefinido'}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                    client.status === ClientStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleOpenModal(client)} className="p-2 text-slate-400 hover:text-primary transition-all rounded"><Edit2 size={14} /></button>
                    <button onClick={() => onUpdate(clients.filter(c => c.id !== client.id))} className="p-2 text-slate-400 hover:text-rose-600 transition-all rounded"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-300 uppercase font-bold text-[10px] tracking-widest">Sem registros encontrados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
               <h3 className="text-lg font-bold text-slate-800">{editingClient ? 'Ficha do Site' : 'Cadastro de Site'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-all"><X size={20} /></button>
            </div>
            
            <div className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nome Comercial</label>
                    <input type="text" className="w-full bg-white border border-slate-200 p-3 rounded text-sm font-medium outline-none focus:border-primary transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nome do Cliente" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Logotipo (Link Externo)</label>
                    <div className="flex items-center gap-2">
                       <input type="text" className="w-full bg-white border border-slate-200 p-3 rounded text-sm font-medium outline-none focus:border-primary transition-all" value={formData.logoUrl} onChange={(e) => setFormData({...formData, logoUrl: e.target.value})} placeholder="https://dominio.com/logo.png" />
                       {formData.logoUrl && <img src={formData.logoUrl} className="w-10 h-10 object-contain rounded border border-slate-100" />}
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Domínio Principal</label>
                    <input type="text" className="w-full bg-white border border-slate-200 p-3 rounded text-sm font-medium outline-none focus:border-primary transition-all" value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})} placeholder="exemplo.com.br" />
                  </div>

                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outros Domínios ou Subdomínios</label>
                        <button onClick={addOtherDomain} className="text-primary text-[9px] font-bold flex items-center gap-1 uppercase hover:underline"><Plus size={10} /> Adicionar</button>
                     </div>
                     <div className="space-y-2">
                        {formData.otherDomains?.map((d, i) => (
                           <div key={i} className="flex gap-2">
                              <input type="text" className="flex-1 bg-slate-50 border border-slate-200 p-2 rounded text-xs outline-none focus:border-primary" value={d} onChange={(e) => updateOtherDomain(i, e.target.value)} placeholder="sub.exemplo.com" />
                              <button onClick={() => removeOtherDomain(i)} className="text-rose-400 hover:text-rose-600 p-2"><Minus size={14} /></button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Expiração Domínio</label>
                    <input type="date" className="w-full bg-white border border-slate-200 p-3 rounded text-sm font-medium outline-none focus:border-primary transition-all" value={formData.expirationDate} onChange={(e) => setFormData({...formData, expirationDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Servidor Hospedagem</label>
                    <select className="w-full bg-white border border-slate-200 p-3 rounded text-sm font-medium outline-none focus:border-primary transition-all" value={isOtherHosting ? 'Outros' : formData.hosting} onChange={(e) => { const v = e.target.value; setIsOtherHosting(v === 'Outros'); setFormData({...formData, hosting: v}); }}>
                      <option value="">Selecione...</option>
                      {HOSTING_PROVIDERS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
               </div>

               {isOtherHosting && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Hospedagem Personalizada</label>
                    <input type="text" className="w-full bg-primary/5 border border-primary/20 p-3 rounded text-sm font-bold text-primary outline-none" placeholder="Qual o provedor?" value={customHosting} onChange={(e) => setCustomHosting(e.target.value)} />
                  </div>
               )}

               <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Estado da Parceria</label>
                  <div className="flex gap-2">
                    {[ClientStatus.ACTIVE, ClientStatus.FROZEN].map(s => (
                      <button key={s} onClick={() => setFormData({...formData, status: s})} className={`flex-1 py-3 rounded border text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === s ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="px-10 py-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600 transition-all">Cancelar</button>
              <button onClick={handleSave} className="bg-primary hover:brightness-110 text-white px-10 py-3 rounded font-bold text-[11px] uppercase tracking-widest shadow-md flex items-center gap-2 transition-all">
                <Save size={16} /> Confirmar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
