import type { PollutionType, Severity } from './types';

export const COLORS = {
  primary: '#4ADE80',
  primaryHover: '#22C55E',
  primaryDark: '#16A34A',
  info: '#00D4FF',
  infoDark: '#0891B2',
  warning: '#FBBF24',
  warningDark: '#D97706',
  danger: '#EF4444',
  dangerDark: '#DC2626',
  gold: '#F59E0B',
  silver: '#94A3B8',
  bronze: '#D97706',
  bg: '#0B0F14',
  card: '#1a1f2e',
  cardHover: '#232a3b',
  border: 'rgba(74, 222, 128, 0.12)',
  borderStrong: 'rgba(74, 222, 128, 0.25)',
  mutedText: '#9CA3AF',
  lightText: '#E5E7EB',
  white: '#FFFFFF',
} as const;

export const POLLUTION_TYPES: Record<PollutionType, { label: string; emoji: string; color: string }> = {
  basura: { label: 'Basura', emoji: '🗑️', color: 'text-amber-400' },
  agua: { label: 'Agua', emoji: '💧', color: 'text-blue-400' },
  aire: { label: 'Aire', emoji: '💨', color: 'text-gray-400' },
  ruido: { label: 'Ruido', emoji: '🔊', color: 'text-purple-400' },
  quema: { label: 'Quema', emoji: '🔥', color: 'text-orange-400' },
  deforestacion: { label: 'Deforestación', emoji: '🌳', color: 'text-green-400' },
  otro: { label: 'Otro', emoji: '⚠️', color: 'text-yellow-400' },
};

export const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  low: { label: 'Baja', color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
  baja: { label: 'Baja', color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
  medium: { label: 'Media', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
  media: { label: 'Media', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
  high: { label: 'Alta', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30' },
  alta: { label: 'Alta', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30' },
  critical: { label: 'Crítica', color: 'text-red-500', bg: 'bg-red-600/15', border: 'border-red-600/30' },
  critica: { label: 'Crítica', color: 'text-red-500', bg: 'bg-red-600/15', border: 'border-red-600/30' },
};

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  analyzed: { label: 'Analizado', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  in_review: { label: 'En revisión', color: 'text-purple-400', bg: 'bg-purple-500/15' },
  resolved: { label: 'Resuelto', color: 'text-green-400', bg: 'bg-green-500/15' },
  rejected: { label: 'Rechazado', color: 'text-red-400', bg: 'bg-red-500/15' },
};

export const LEVEL_NAMES: string[] = [
  'Semilla', 'Brote', 'Guardián', 'Defensor', 'Campeón', 'EcoLeyenda'
];

export const LEVEL_COLORS: string[] = [
  'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'bg-green-500/20 text-green-400 border-green-500/30',
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-red-500/20 text-red-400 border-red-500/30',
];

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return 'Ahora mismo';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
