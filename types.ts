
export enum ClientStatus {
  ACTIVE = 'Ativo',
  FROZEN = 'Congelado',
  MISSING_INFO = 'Incompleto'
}

export interface Client {
  id: string;
  name: string;
  domain: string;
  otherDomains?: string[];
  logoUrl: string;
  expirationDate: string;
  hosting: string;
  status: ClientStatus;
}

export interface ChecklistDefinition {
  id: string;
  label: string;
  hasQuantity: boolean;
  isHidden?: boolean;
}

export type ActivityType = 'Alteração' | 'Inclusão' | 'Exclusão' | 'Desenvolvimento' | 'Ajuste';
export type ActivityCategory = 'Imagens' | 'Terapeutas' | 'Plugins' | 'Vídeo' | 'Outros' | 'Banner' | 'Post' | 'Reels';
export type Department = 'web' | 'social';

export interface Activity {
  id: string;
  clientId: string;
  date: string;
  type: ActivityType;
  category: ActivityCategory;
  quantity: number;
  otherDetails?: string;
  timestamp: number;
  department: Department;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  comment: string;
  quantity?: number;
}

export interface ChecklistRecord {
  id: string;
  clientId: string;
  date: string;
  summary: string;
  items: ChecklistItem[];
  timestamp: number;
}

export type ProjectStatus = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'cancelado';
export type ProjectPriority = 'Baixa' | 'Média' | 'Alta';

export interface ProjectComment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  timestamp: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string; // Vínculo relacional
  clientName: string; // Cache para exibição rápida
  domain: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  responsibleId: string;
  endDate?: string;
  createdAt: number;
  progress: number; // 0, 25, 50, 75, 100
  comments: ProjectComment[];
  department: Department;
}

export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  allowedTabs: string[];
}

export type ThemeFont = 'sans' | 'serif' | 'mono' | 'rounded';

export interface SystemConfig {
  agencyName: string;
  agencySlogan: string;
  agencyLogoUrl: string;
  primaryColor: string;
  selectionColor: string;
  themeFont: ThemeFont;
  systemVersion: string;
  webLabel?: string;
  socialLabel?: string;
}
