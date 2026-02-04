
import React from 'react';
import { LayoutDashboard, History, CheckSquare, Users, Kanban, Settings, ShieldCheck } from 'lucide-react';

export const MENU_ITEMS = [
  // Grupo Geral
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, section: 'GERAL' },
  { id: 'clients', label: 'Clientes', icon: <Users size={20} />, section: 'GERAL' },

  // Grupo Webdesigner
  { id: 'web-projects', label: 'Projetos', icon: <Kanban size={18} />, section: 'WEBDESIGNER', department: 'web' },
  { id: 'web-activities', label: 'Atividades', icon: <History size={18} />, section: 'WEBDESIGNER', department: 'web' },
  { id: 'web-checklist', label: 'Checklist', icon: <CheckSquare size={18} />, section: 'WEBDESIGNER', department: 'web' },

  // Grupo Social Midia
  { id: 'social-projects', label: 'Projetos', icon: <Kanban size={18} />, section: 'SOCIAL MIDIA', department: 'social' },
  { id: 'social-activities', label: 'Atividades', icon: <History size={18} />, section: 'SOCIAL MIDIA', department: 'social' },
];

export const ADMIN_MENU_ITEMS = [
  { id: 'users', label: 'Usuários', icon: <ShieldCheck size={18} /> },
  { id: 'settings', label: 'Configurações', icon: <Settings size={18} /> },
];

// Configurações Webdesigner
export const ACTIVITY_TYPES_WEB = ['Alteração', 'Inclusão', 'Exclusão'] as const;
export const ACTIVITY_CATEGORIES_WEB = ['Imagens', 'Terapeutas', 'Plugins', 'Vídeo', 'Outros'] as const;

// Configurações Social Media
export const ACTIVITY_TYPES_SOCIAL = ['Desenvolvimento', 'Ajuste'] as const;
export const ACTIVITY_CATEGORIES_SOCIAL = ['Banner', 'Post', 'Reels', 'Outros'] as const;

export const HOSTING_PROVIDERS = ['RunCloud', 'Hostoo', 'GoDaddy', 'Locaweb', 'Outros'];
