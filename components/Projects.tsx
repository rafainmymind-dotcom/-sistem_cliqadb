
import React, { useState, useEffect } from 'react';
import { 
  Plus, MessageSquare, X, Save, Trash2, Send, 
  ChevronDown, Check, AlertTriangle, Clock, Kanban, User as UserIcon,
  ArrowRightLeft, MoreHorizontal
} from 'lucide-react';
import { Project, ProjectStatus, ProjectPriority, ProjectComment, Client, Department, User } from '../types';

interface ProjectsProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
  clients: Client[];
  department: Department;
  users: User[];
  currentUser: User;
}

const Projects: React.FC<ProjectsProps> = ({ projects, onUpdate, clients, department, users, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '', description: '', clientId: '', status: 'nao_iniciado', priority: 'Média', responsibleId: '', endDate: '', comments: []
  });

  const filteredProjects = projects.filter(p => p.department === department);

  const handleOpenModal = (project: Project | null = null) => {
    if (project) {
      setActiveProject(project);
      setFormData(project);
    } else {
      setActiveProject(null);
      setFormData({
        title: '', description: '', clientId: '', status: 'nao_iniciado', priority: 'Média', responsibleId: currentUser.id, endDate: '', comments: [], createdAt: Date.now()
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.clientId) return;
    
    const selectedClient = clients.find(c => c.id === formData.clientId);
    
    let updatedProjects;
    if (activeProject) {
      updatedProjects = projects.map(p => p.id === activeProject.id ? { 
        ...p, 
        ...formData, 
        clientName: selectedClient?.name || '', 
        domain: selectedClient?.domain || '' 
      } as Project : p);
    } else {
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title || '',
        description: formData.description || '',
        clientId: formData.clientId || '',
        clientName: selectedClient?.name || '',
        domain: selectedClient?.domain || '',
        status: formData.status as ProjectStatus || 'nao_iniciado',
        priority: formData.priority as ProjectPriority || 'Média',
        responsibleId: formData.responsibleId || currentUser.id,
        endDate: formData.endDate,
        progress: 0,
        createdAt: Date.now(),
        comments: [],
        department: department
      };
      updatedProjects = [newProject, ...projects];
    }
    onUpdate(updatedProjects);
    setIsModalOpen(false);
  };

  const handleQuickStatusChange = (e: React.MouseEvent, projectId: string, newStatus: ProjectStatus) => {
    e.stopPropagation();
    const updated = projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p);
    onUpdate(updated);
    setOpenStatusMenuId(null);
  };

  const handleAddComment = () => {
    if (!activeProject || !newComment.trim()) return;
    const comment: ProjectComment = {
      id: Math.random().toString(36).substr(2, 9),
      text: newComment,
      authorId: currentUser.id,
      authorName: currentUser.username,
      timestamp: Date.now()
    };
    const updatedComments = [...(activeProject.comments || []), comment];
    const updatedProject = { ...activeProject, ...formData, comments: updatedComments } as Project;
    const updatedProjects = projects.map(p => p.id === activeProject.id ? updatedProject : p);
    onUpdate(updatedProjects);
    setActiveProject(updatedProject);
    setFormData(updatedProject);
    setNewComment('');
  };

  const formatTimestamp = (ts: number) => {
    return new Date(ts).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status: ProjectStatus) => {
    switch(status) {
      case 'em_andamento': return { label: 'Em Andamento', color: 'bg-blue-500 text-white', dot: 'bg-blue-500' };
      case 'concluido': return { label: 'Concluído', color: 'bg-emerald-500 text-white', dot: 'bg-emerald-500' };
      case 'cancelado': return { label: 'Cancelado', color: 'bg-slate-400 text-white', dot: 'bg-slate-400' };
      default: return { label: 'Pendente', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-300' };
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white px-8 py-5 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
            <Kanban size={20} className="text-primary" /> 
            Projetos {department === 'web' ? 'Webdesigner' : 'Social Media'}
          </h2>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-primary text-white px-5 py-2.5 rounded font-bold text-xs flex items-center gap-2">
          <Plus size={16} /> Novo Projeto
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto px-8 pb-10 flex-1 custom-scrollbar">
        {['nao_iniciado', 'em_andamento', 'concluido'].map(statusId => (
          <div key={statusId} className="min-w-[340px] flex flex-col gap-4">
            <h3 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider px-2">
              {statusId === 'nao_iniciado' ? 'Backlog' : statusId === 'em_andamento' ? 'Em Execução' : 'Concluídos'}
            </h3>
            
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
              {filteredProjects.filter(p => p.status === statusId).map(project => (
                <div key={project.id} onClick={() => handleOpenModal(project)} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-primary/40 cursor-pointer transition-all relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold uppercase text-slate-400">{project.clientName}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${project.priority === 'Alta' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>{project.priority}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-4">{project.title}</h4>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenStatusMenuId(openStatusMenuId === project.id ? null : project.id); }}
                        className={`text-[9px] font-black uppercase px-2 py-1 rounded flex items-center gap-1.5 transition-all hover:brightness-95 ${getStatusConfig(project.status).color}`}
                      >
                        {getStatusConfig(project.status).label}
                        <ArrowRightLeft size={10} />
                      </button>

                      {openStatusMenuId === project.id && (
                        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-xl z-10 py-1 animate-in fade-in slide-in-from-top-1">
                          {(['nao_iniciado', 'em_andamento', 'concluido'] as ProjectStatus[]).map(s => (
                            <button 
                              key={s} 
                              onClick={(e) => handleQuickStatusChange(e, project.id, s)}
                              className={`w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-slate-50 transition-colors ${project.status === s ? 'text-primary' : 'text-slate-500'}`}
                            >
                              {getStatusConfig(s).label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                       <div className="text-[10px] text-slate-300 font-bold flex items-center gap-1"><MessageSquare size={12} /> {project.comments.length}</div>
                       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-400 border border-slate-200">
                         {users.find(u => u.id === project.responsibleId)?.username.charAt(0).toUpperCase()}
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-8 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">{activeProject ? 'Editar Projeto' : 'Novo Projeto'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto flex">
              <div className="flex-1 p-10 space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Título do Projeto</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-slate-300 p-3 rounded-md text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
                    placeholder="Ex: Novo Site Institucional"
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Cliente Vinculado</label>
                    <select 
                      className="w-full bg-white border border-slate-300 p-3 rounded-md text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
                      value={formData.clientId} 
                      onChange={e => setFormData({...formData, clientId: e.target.value})}
                    >
                      <option value="" className="text-slate-400">Selecione um cliente...</option>
                      {clients.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Responsável</label>
                    <select 
                      className="w-full bg-white border border-slate-300 p-3 rounded-md text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
                      value={formData.responsibleId} 
                      onChange={e => setFormData({...formData, responsibleId: e.target.value})}
                    >
                      {users.map(u => <option key={u.id} value={u.id} className="text-slate-900">{u.username}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Status Atual</label>
                    <select 
                      className="w-full bg-white border border-slate-300 p-3 rounded-md text-sm font-bold uppercase text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value as ProjectStatus})}
                    >
                      <option value="nao_iniciado">Pendente</option>
                      <option value="em_andamento">Execução</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Prioridade</label>
                    <select 
                      className="w-full bg-white border border-slate-300 p-3 rounded-md text-sm font-bold uppercase text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" 
                      value={formData.priority} 
                      onChange={e => setFormData({...formData, priority: e.target.value as ProjectPriority})}
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Descrição do Escopo</label>
                  <textarea 
                    className="w-full bg-white border border-slate-300 p-3 rounded-md text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm min-h-[120px]" 
                    placeholder="Descreva os detalhes e objetivos deste projeto..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="w-[350px] bg-slate-50 p-8 border-l border-slate-200 flex flex-col">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Notas e Logs</h4>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                  {activeProject?.comments.map(c => (
                    <div key={c.id} className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-bold text-slate-800">{c.authorName}</p>
                        <p className="text-[8px] text-slate-400 font-bold">{formatTimestamp(c.timestamp)}</p>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                  {(!activeProject?.comments || activeProject.comments.length === 0) && (
                    <div className="text-center py-10 text-slate-300 text-[10px] font-bold uppercase">Nenhuma nota registrada</div>
                  )}
                </div>
                {activeProject && (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-white border border-slate-300 p-2 rounded text-xs text-slate-900 outline-none focus:border-primary transition-all shadow-sm" 
                      placeholder="Adicionar nota..." 
                      value={newComment} 
                      onChange={e => setNewComment(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleAddComment()} 
                    />
                    <button onClick={handleAddComment} className="bg-primary text-white p-2 rounded hover:brightness-110 transition-all shadow-md"><Send size={14} /></button>
                  </div>
                )}
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-200 bg-white flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600 transition-all">Cancelar</button>
              <button onClick={handleSave} className="bg-primary text-white px-10 py-3 rounded font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all active:scale-[0.98] shadow-lg">
                Salvar Projeto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
