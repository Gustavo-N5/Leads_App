export type LeadStatus = 'New' | 'Qualified' | 'Won' | 'Lost';

export interface Lead {
  id: number;
  name: string;
  email: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  tasksCount: number;
}

export interface LeadCreateDto {
  name: string;
  email: string;
  status: LeadStatus;
}

export interface LeadUpdateDto {
  name: string;
  email: string;
  status: LeadStatus;
}

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Qualified', 'Won', 'Lost'];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  New: 'Novo',
  Qualified: 'Qualificado',
  Won: 'Ganho',
  Lost: 'Perdido'
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  New: 'primary',
  Qualified: 'accent',
  Won: 'warn',
  Lost: ''
};