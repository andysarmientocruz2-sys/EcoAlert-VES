import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Search, Trash2, MapPin, Calendar, Zap, Filter, X, ChevronRight, Plus,
  AlertTriangle, CheckCircle2, Clock, Eye, FileText, TrendingUp, Share2,
  Camera, Navigation, Brain, ArrowLeft, ChevronDown, ChevronUp, Image,
  Map, Sparkles, User, Circle
} from 'lucide-react';
import { POLLUTION_TYPES, SEVERITY_CONFIG, STATUS_CONFIG } from '@shared/constants';

type PollutionTypeKey = keyof typeof POLLUTION_TYPES;
type SeverityKey = keyof typeof SEVERITY_CONFIG;
type StatusKey = keyof typeof STATUS_CONFIG;

interface AIMetaAnalysis {
  confidence: number;
  recommendation: string;
}

interface MockReport {
  id: string;
  reportCode: string;
  title: string;
  description: string;
  type: PollutionTypeKey;
  location: string;
  district: string;
  reference: string;
  date: Date;
  status: StatusKey;
  severity: SeverityKey;
  points: number;
  aiAnalysis?: AIMetaAnalysis;
  timeline: TimelineStep[];
}

interface TimelineStep {
  key: string;
  icon: typeof CheckCircle2;
  title: string;
  description: string;
  timestamp: Date | null;
  completed: boolean;
  current: boolean;
}

const NOW = Date.now();
const HOUR = 3600000;
const DAY = 86400000;

const MOCK_REPORTS: MockReport[] = [
  {
    id: '1',
    reportCode: '#RPT-2026-0001',
    title: 'Basura acumulada en parque central',
    description: 'Se observa gran cantidad de residuos sólidos en el parque central del distrito, incluyendo plásticos, cartón y restos orgánicos. El acumulo cubre aproximadamente 20 metros cuadrados y genera malos olores que afectan a los vecinos del sector. Se requiere intervención urgente antes de que la situación empeore.',
    type: 'basura',
    location: 'Parque Central, Mz. A Lote 5',
    district: 'Villa El Salvador',
    reference: 'Frente a la Municipalidad Distrital',
    date: new Date(NOW - 2 * DAY),
    status: 'analyzed',
    severity: 'high',
    points: 150,
    aiAnalysis: {
      confidence: 94,
      recommendation: 'Enviar brigada de limpieza al sector norte del parque. Se recomienda coordinar con Serenazgo para resguardo del área mientras se realiza la limpieza.',
    },
    timeline: [
      { key: 'created', icon: CheckCircle2, title: 'Reporte creado', description: 'Tu reporte fue registrado exitosamente', timestamp: new Date(NOW - 2 * DAY + 2 * HOUR), completed: true, current: false },
      { key: 'received', icon: CheckCircle2, title: 'Recibido', description: 'El sistema confirmó la recepción', timestamp: new Date(NOW - 2 * DAY + 2 * HOUR + 5 * 60000), completed: true, current: false },
      { key: 'review', icon: CheckCircle2, title: 'En revisión', description: 'Nuestro equipo está analizando la información', timestamp: new Date(NOW - 1 * DAY), completed: true, current: false },
      { key: 'assigned', icon: Clock, title: 'Asignado', description: 'Se asignó una brigada de respuesta', timestamp: null, completed: false, current: true },
      { key: 'resolved', icon: Circle, title: 'Resuelto', description: 'El problema fue atendido', timestamp: null, completed: false, current: false },
    ],
  },
  {
    id: '2',
    reportCode: '#RPT-2026-0002',
    title: 'Contaminación del río Lurín',
    description: 'El agua del río presenta coloración anómala verdosa y olor fuerte a químicos. Se observan residuos industriales cercanos al cauce. Pescadores de la zona reportan mortalidad de peces en los últimos días. Situación que puede afectar la salud de comunidades aledañas.',
    type: 'agua',
    location: 'Río Lurín, sector Sur',
    district: 'Villa El Salvador',
    reference: 'Puente peatonal sobre el río',
    date: new Date(NOW - 5 * DAY),
    status: 'in_review',
    severity: 'critical',
    points: 250,
    aiAnalysis: {
      confidence: 97,
      recommendation: 'Notificar de inmediato a las autoridades ambientales (OEFA). Restringir acceso al río y realizar monitoreo de calidad del agua. Coordinar con la DIRSA para análisis toxicológicos.',
    },
    timeline: [
      { key: 'created', icon: CheckCircle2, title: 'Reporte creado', description: 'Tu reporte fue registrado exitosamente', timestamp: new Date(NOW - 5 * DAY + 3 * HOUR), completed: true, current: false },
      { key: 'received', icon: CheckCircle2, title: 'Recibido', description: 'El sistema confirmó la recepción', timestamp: new Date(NOW - 5 * DAY + 3 * HOUR + 3 * 60000), completed: true, current: false },
      { key: 'review', icon: CheckCircle2, title: 'En revisión', description: 'Nuestro equipo está analizando la información', timestamp: new Date(NOW - 4 * DAY), completed: true, current: false },
      { key: 'assigned', icon: CheckCircle2, title: 'Asignado', description: 'Se asignó una brigada de respuesta', timestamp: new Date(NOW - 3 * DAY), completed: true, current: false },
      { key: 'resolved', icon: Circle, title: 'Resuelto', description: 'El problema fue atendido', timestamp: null, completed: false, current: true },
    ],
  },
  {
    id: '3',
    reportCode: '#RPT-2026-0003',
    title: 'Quema de residuos industriales',
    description: 'Humo negro persistente proveniente del área industrial cercana al mercado. Olor acre que afecta a residentes del sector 3 y 4. La quema se realiza de forma habitual en horas de la madrugada, generando contaminación atmosférica significativa.',
    type: 'quema',
    location: 'Av. Industrial 456, Mz. C',
    district: 'Villa El Salvador',
    reference: 'Junto al Mercado Mayorista',
    date: new Date(NOW - 1 * DAY),
    status: 'pending',
    severity: 'high',
    points: 120,
    timeline: [
      { key: 'created', icon: CheckCircle2, title: 'Reporte creado', description: 'Tu reporte fue registrado exitosamente', timestamp: new Date(NOW - 1 * DAY + 18 * HOUR), completed: true, current: false },
      { key: 'received', icon: Clock, title: 'Recibido', description: 'El sistema confirmó la recepción', timestamp: null, completed: false, current: true },
      { key: 'review', icon: Circle, title: 'En revisión', description: 'Nuestro equipo está analizando la información', timestamp: null, completed: false, current: false },
      { key: 'assigned', icon: Circle, title: 'Asignado', description: 'Se asignó una brigada de respuesta', timestamp: null, completed: false, current: false },
      { key: 'resolved', icon: Circle, title: 'Resuelto', description: 'El problema fue atendido', timestamp: null, completed: false, current: false },
    ],
  },
  {
    id: '4',
    reportCode: '#RPT-2026-0004',
    title: 'Deforestación en zona verde',
    description: 'Se están talando árboles de forma ilegal en la zona verde del sector 8. Se observan troncos cortados y maquinaria pesada trabajando sin autorización municipal. El área afectada es aproximadamente media hectárea de vegetación nativa.',
    type: 'deforestacion',
    location: 'Sector 8, Mz. D Lote 12',
    district: 'Villa El Salvador',
    reference: 'Detrás de la UGEL',
    date: new Date(NOW - 8 * DAY),
    status: 'in_review',
    severity: 'critical',
    points: 300,
    aiAnalysis: {
      confidence: 91,
      recommendation: 'Solicitar inspección de la SERFOR y la Policía Nacional. Documentar evidencia fotográfica y georreferenciar el área afectada para procedimiento legal.',
    },
    timeline: [
      { key: 'created', icon: CheckCircle2, title: 'Reporte creado', description: 'Tu reporte fue registrado exitosamente', timestamp: new Date(NOW - 8 * DAY + 7 * HOUR), completed: true, current: false },
      { key: 'received', icon: CheckCircle2, title: 'Recibido', description: 'El sistema confirmó la recepción', timestamp: new Date(NOW - 8 * DAY + 7 * HOUR + 2 * 60000), completed: true, current: false },
      { key: 'review', icon: CheckCircle2, title: 'En revisión', description: 'Nuestro equipo está analizando la información', timestamp: new Date(NOW - 7 * DAY), completed: true, current: false },
      { key: 'assigned', icon: Clock, title: 'Asignado', description: 'Se asignó una brigada de respuesta', timestamp: null, completed: false, current: true },
      { key: 'resolved', icon: Circle, title: 'Resuelto', description: 'El problema fue atendido', timestamp: null, completed: false, current: false },
    ],
  },
  {
    id: '5',
    reportCode: '#RPT-2026-0005',
    title: 'Ruido excesivo en vía pública',
    description: 'Música a extremo volumen en establecimiento comercial después de las 11pm. Los vecinos del sector han reportado que esta situación se repite todos los viernes y sábados, afectando el descanso de familias y especialmente de adultos mayores.',
    type: 'ruido',
    location: 'Av. La Paz 789',
    district: 'Villa El Salvador',
    reference: 'Esquina con Jr. Los Pinos',
    date: new Date(NOW - 12 * DAY),
    status: 'resolved',
    severity: 'medium',
    points: 80,
    aiAnalysis: {
      confidence: 88,
      recommendation: 'Verificar horarios de funcionamiento del establecimiento. Aplicar multa por infracción a la ordenanza de ruido municipal si la violación se confirma.',
    },
    timeline: [
      { key: 'created', icon: CheckCircle2, title: 'Reporte creado', description: 'Tu reporte fue registrado exitosamente', timestamp: new Date(NOW - 12 * DAY + 23 * HOUR), completed: true, current: false },
      { key: 'received', icon: CheckCircle2, title: 'Recibido', description: 'El sistema confirmó la recepción', timestamp: new Date(NOW - 12 * DAY + 23 * HOUR + 4 * 60000), completed: true, current: false },
      { key: 'review', icon: CheckCircle2, title: 'En revisión', description: 'Nuestro equipo está analizando la información', timestamp: new Date(NOW - 11 * DAY), completed: true, current: false },
      { key: 'assigned', icon: CheckCircle2, title: 'Asignado', description: 'Se asignó una brigada de respuesta', timestamp: new Date(NOW - 10 * DAY), completed: true, current: false },
      { key: 'resolved', icon: CheckCircle2, title: 'Resuelto', description: 'El problema fue atendido', timestamp: new Date(NOW - 9 * DAY), completed: true, current: false },
    ],
  },
  {
    id: '6',
    reportCode: '#RPT-2026-0006',
    title: 'Contaminación del aire por emisiones',
    description: 'Fábrica de cerámicas emite humo gris denso durante todo el día. Los residentes del sector cercano reportan dificultad para respirar y ardor en los ojos. Niños y ancianos son los más afectados por esta contaminación constante.',
    type: 'aire',
    location: 'Av. Las Industrias 234',
    district: 'Villa El Salvador',
    reference: 'Cerca al cruce con Av. Progreso',
    date: new Date(NOW - 3 * DAY),
    status: 'analyzed',
    severity: 'high',
    points: 170,
    aiAnalysis: {
      confidence: 92,
      recommendation: 'Coordinar con OEFA para medición de calidad del aire. Solicitar cese temporal de operaciones hasta implementar filtros de contención de partículas.',
    },
    timeline: [
      { key: 'created', icon: CheckCircle2, title: 'Reporte creado', description: 'Tu reporte fue registrado exitosamente', timestamp: new Date(NOW - 3 * DAY + 10 * HOUR), completed: true, current: false },
      { key: 'received', icon: CheckCircle2, title: 'Recibido', description: 'El sistema confirmó la recepción', timestamp: new Date(NOW - 3 * DAY + 10 * HOUR + 8 * 60000), completed: true, current: false },
      { key: 'review', icon: CheckCircle2, title: 'En revisión', description: 'Nuestro equipo está analizando la información', timestamp: new Date(NOW - 2 * DAY), completed: true, current: false },
      { key: 'assigned', icon: Clock, title: 'Asignado', description: 'Se asignó una brigada de respuesta', timestamp: null, completed: false, current: true },
      { key: 'resolved', icon: Circle, title: 'Resuelto', description: 'El problema fue atendido', timestamp: null, completed: false, current: false },
    ],
  },
  {
    id: '7',
    reportCode: '#RPT-2026-0007',
    title: 'Escombros abandonados en vía pública',
    description: 'Acumulación de escombros de construcción en la esquina de dos cuadras. Material incluye concreto, varillas y ladrillos que obstruyen la acera y representan un peligro para peatones y ciclistas. El predio no muestra actividad de construcción.',
    type: 'basura',
    location: 'Jr. San Martín 456',
    district: 'Villa El Salvador',
    reference: 'Frente a la I.E. 12345',
    date: new Date(NOW - 6 * DAY),
    status: 'pending',
    severity: 'medium',
    points: 90,
    timeline: [
      { key: 'created', icon: CheckCircle2, title: 'Reporte creado', description: 'Tu reporte fue registrado exitosamente', timestamp: new Date(NOW - 6 * DAY + 14 * HOUR), completed: true, current: false },
      { key: 'received', icon: Clock, title: 'Recibido', description: 'El sistema confirmó la recepción', timestamp: null, completed: false, current: true },
      { key: 'review', icon: Circle, title: 'En revisión', description: 'Nuestro equipo está analizando la información', timestamp: null, completed: false, current: false },
      { key: 'assigned', icon: Circle, title: 'Asignado', description: 'Se asignó una brigada de respuesta', timestamp: null, completed: false, current: false },
      { key: 'resolved', icon: Circle, title: 'Resuelto', description: 'El problema fue atendido', timestamp: null, completed: false, current: false },
    ],
  },
  {
    id: '8',
    reportCode: '#RPT-2026-0008',
    title: 'Contaminación de agua en canal de riego',
    description: 'El canal de riego del sector 5 presenta espuma blanca y residuos de detergentes. Agricultores reportan que el agua contaminada está afectando los cultivos de la zona. Se sospecha de vertimiento de aguas servidas desde viviendas cercanas.',
    type: 'agua',
    location: 'Canal de Riego, Sector 5',
    district: 'Villa El Salvador',
    reference: 'Puente vehicular del canal',
    date: new Date(NOW - 14 * DAY),
    status: 'resolved',
    severity: 'low',
    points: 60,
    timeline: [
      { key: 'created', icon: CheckCircle2, title: 'Reporte creado', description: 'Tu reporte fue registrado exitosamente', timestamp: new Date(NOW - 14 * DAY + 8 * HOUR), completed: true, current: false },
      { key: 'received', icon: CheckCircle2, title: 'Recibido', description: 'El sistema confirmó la recepción', timestamp: new Date(NOW - 14 * DAY + 8 * HOUR + 10 * 60000), completed: true, current: false },
      { key: 'review', icon: CheckCircle2, title: 'En revisión', description: 'Nuestro equipo está analizando la información', timestamp: new Date(NOW - 13 * DAY), completed: true, current: false },
      { key: 'assigned', icon: CheckCircle2, title: 'Asignado', description: 'Se asignó una brigada de respuesta', timestamp: new Date(NOW - 12 * DAY), completed: true, current: false },
      { key: 'resolved', icon: CheckCircle2, title: 'Resuelto', description: 'El problema fue atendido', timestamp: new Date(NOW - 10 * DAY), completed: true, current: false },
    ],
  },
];

function timeAgo(date: Date): string {
  const diffMs = NOW - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return 'Ahora mismo';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem`;
  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
}

function formatDateFull(date: Date): string {
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const FILTER_SEVERITIES: { key: string; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'low', label: 'Baja' },
  { key: 'medium', label: 'Media' },
  { key: 'high', label: 'Alta' },
  { key: 'critical', label: 'Crítica' },
];

const SORT_OPTIONS = [
  { key: 'newest', label: 'Más reciente' },
  { key: 'oldest', label: 'Más antiguo' },
  { key: 'priority', label: 'Mayor prioridad' },
] as const;

const SEVERITY_ORDER: Record<string, number> = {
  critical: 4,
  critica: 4,
  high: 3,
  alta: 3,
  medium: 2,
  media: 2,
  low: 1,
  baja: 1,
};

export default function ReportsEnhancedPage() {
  const [, setLocation] = useLocation();
  const [reports, setReports] = useState<MockReport[]>(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterType !== 'all') count++;
    if (filterStatus !== 'all') count++;
    if (filterSeverity !== 'all') count++;
    return count;
  }, [filterType, filterStatus, filterSeverity]);

  const filtered = useMemo(() => {
    let result = reports.filter((r) => {
      const matchSearch =
        searchTerm === '' ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || r.type === filterType;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchSeverity = filterSeverity === 'all' || r.severity === filterSeverity;
      return matchSearch && matchType && matchStatus && matchSeverity;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') return b.date.getTime() - a.date.getTime();
      if (sortBy === 'oldest') return a.date.getTime() - b.date.getTime();
      return (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0);
    });

    return result;
  }, [reports, searchTerm, filterType, filterStatus, filterSeverity, sortBy]);

  const totalPoints = reports.reduce((s, r) => s + r.points, 0);
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const resolutionRate = reports.length > 0 ? Math.round((resolvedCount / reports.length) * 100) : 0;

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
    setFilterSeverity('all');
    setSortBy('newest');
  };

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (selectedReport?.id === id) setSelectedReport(null);
    toast.success('Reporte eliminado correctamente');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation('/dashboard')}
              className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Mis Reportes</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Gestiona y monitorea tus reportes ambientales
              </p>
            </div>
          </div>
          <Button
            onClick={() => setLocation('/report')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nuevo Reporte</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Total reportes',
              value: reports.length.toString(),
              icon: FileText,
              color: 'text-[#4ADE80]',
              bg: 'bg-[#4ADE80]/10',
              border: 'border-[#4ADE80]/20',
            },
            {
              label: 'Resueltos',
              value: resolvedCount.toString(),
              sub: `${resolutionRate}%`,
              icon: CheckCircle2,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
              border: 'border-green-500/20',
            },
            {
              label: 'EcoPuntos',
              value: totalPoints.toLocaleString(),
              icon: Zap,
              color: 'text-[#00D4FF]',
              bg: 'bg-[#00D4FF]/10',
              border: 'border-[#00D4FF]/20',
            },
            {
              label: 'Tiempo resolución',
              value: '3.2',
              sub: 'días',
              icon: TrendingUp,
              color: 'text-[#FBBF24]',
              bg: 'bg-[#FBBF24]/10',
              border: 'border-[#FBBF24]/20',
            },
          ].map((s) => (
            <Card key={s.label} className={`p-4 bg-card ${s.border} border rounded-xl transition-all duration-300`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-xl font-bold">{s.value}</p>
                    {s.sub && <span className="text-xs text-muted-foreground">{s.sub}</span>}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{s.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por título, descripción o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border h-11"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 px-4 gap-2 border-border transition-all ${
              showFilters || activeFilterCount > 0
                ? 'border-[#4ADE80]/30 text-[#4ADE80] bg-[#4ADE80]/5'
                : 'text-muted-foreground'
            }`}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#4ADE80] text-black text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>

        {showFilters && (
          <Card className="p-4 bg-card border-border rounded-xl space-y-4 transition-all duration-300">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Tipo de contaminación
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-[#4ADE80] text-black shadow-lg shadow-[#4ADE80]/20'
                      : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  Todos
                </button>
                {(Object.entries(POLLUTION_TYPES) as [string, { label: string; emoji: string; color: string }][]).map(
                  ([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setFilterType(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filterType === key
                          ? 'bg-[#4ADE80] text-black shadow-lg shadow-[#4ADE80]/20'
                          : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                      }`}
                    >
                      {val.emoji} {val.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <Separator className="bg-border" />

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Estado
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterStatus === 'all'
                      ? 'bg-[#4ADE80] text-black shadow-lg shadow-[#4ADE80]/20'
                      : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  Todos
                </button>
                {(Object.entries(STATUS_CONFIG) as [string, { label: string; color: string; bg: string }][]).map(
                  ([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setFilterStatus(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filterStatus === key
                          ? 'bg-[#4ADE80] text-black shadow-lg shadow-[#4ADE80]/20'
                          : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                      }`}
                    >
                      {val.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <Separator className="bg-border" />

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Prioridad
              </p>
              <div className="flex flex-wrap gap-1.5">
                {FILTER_SEVERITIES.map((sev) => (
                  <button
                    key={sev.key}
                    onClick={() => setFilterSeverity(sev.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filterSeverity === sev.key
                        ? 'bg-[#4ADE80] text-black shadow-lg shadow-[#4ADE80]/20'
                        : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Ordenar por
                </p>
                <div className="flex gap-1.5">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSortBy(opt.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        sortBy === opt.key
                          ? 'bg-[#4ADE80] text-black shadow-lg shadow-[#4ADE80]/20'
                          : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground gap-1"
                >
                  <X size={14} />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} reporte{filtered.length !== 1 ? 's' : ''}
            {activeFilterCount > 0 && ' filtrado' + (filtered.length !== 1 ? 's' : '')}
          </p>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-16 bg-card border-border rounded-xl text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#4ADE80]/10 flex items-center justify-center mx-auto mb-4">
              <FileText size={36} className="text-[#4ADE80]/40" />
            </div>
            <p className="font-semibold text-lg mb-1">
              {reports.length === 0 ? 'No hay reportes aún' : 'No se encontraron reportes'}
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              {reports.length === 0
                ? 'Crea tu primer reporte ambiental para ayudar a Villa El Salvador'
                : 'Intenta ajustar los filtros de búsqueda para encontrar lo que buscas'}
            </p>
            <div className="flex gap-2 justify-center">
              {reports.length === 0 ? (
                <Button
                  onClick={() => setLocation('/report')}
                  className="bg-[#4ADE80] text-black font-semibold hover:bg-[#4ADE80]/90 gap-2"
                >
                  <Plus size={18} />
                  Crear reporte
                </Button>
              ) : (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-border text-muted-foreground gap-2"
                >
                  <X size={16} />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((report) => {
              const pType = POLLUTION_TYPES[report.type] || POLLUTION_TYPES.otro;
              const sev = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.low;
              const statusCfg = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;

              return (
                <Card
                  key={report.id}
                  className="p-4 sm:p-5 bg-card border border-border rounded-xl hover:border-[#4ADE80]/20 hover:shadow-lg hover:shadow-[#4ADE80]/5 transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-card border border-border flex items-center justify-center text-2xl sm:text-3xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                      {pType.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-bold text-sm sm:text-base truncate group-hover:text-[#4ADE80] transition-colors">
                          {report.title}
                        </h3>
                        <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                          {report.reportCode}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">
                        {report.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-[#4ADE80] shrink-0" />
                          <span className="truncate max-w-[200px]">{report.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="shrink-0" />
                          {timeAgo(report.date)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <Badge
                          variant="outline"
                          className={`${sev.color} ${sev.bg} ${sev.border} text-[10px] font-medium`}
                        >
                          {sev.label}
                        </Badge>
                        <Badge variant="outline" className={`${statusCfg.color} ${statusCfg.bg} text-[10px] font-medium`}>
                          {statusCfg.label}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/20 text-[10px] font-medium gap-0.5"
                        >
                          <Zap size={10} />
                          +{report.points} pts
                        </Badge>
                      </div>

                      {report.aiAnalysis && (
                        <div className="p-3 rounded-xl bg-[#4ADE80]/5 border border-[#4ADE80]/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={12} className="text-[#4ADE80]" />
                            <span className="text-[11px] font-semibold text-[#4ADE80]">Análisis IA</span>
                            <Badge
                              variant="outline"
                              className="text-[10px] border-[#4ADE80]/20 text-[#4ADE80] bg-transparent"
                            >
                              {report.aiAnalysis.confidence}% confianza
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {report.aiAnalysis.recommendation}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 self-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-border text-muted-foreground hover:text-[#4ADE80] hover:border-[#4ADE80]/30 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                        }}
                      >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Ver detalle</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-border text-muted-foreground hover:text-[#EF4444] hover:border-[#EF4444]/30 hover:bg-[#EF4444]/5 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

function ReportDetailModal({
  report,
  onClose,
  onDelete,
}: {
  report: MockReport;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const pType = POLLUTION_TYPES[report.type] || POLLUTION_TYPES.otro;
  const sev = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.low;
  const statusCfg = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-2xl sm:mx-4 max-h-[92vh] sm:max-h-[85vh] bg-background border border-border rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 sm:animate-in sm:slide-in-from-bottom-4 sm:duration-300">
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-xl border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl">{pType.emoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{report.title}</p>
              <p className="text-xs text-muted-foreground">{report.reportCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={`${statusCfg.color} ${statusCfg.bg} text-xs font-semibold px-3 py-1`}
            >
              {statusCfg.label}
            </Badge>
            <Badge
              variant="outline"
              className={`${sev.color} ${sev.bg} ${sev.border} text-xs font-semibold px-3 py-1`}
            >
              {sev.label}
            </Badge>
            <Badge
              variant="outline"
              className="text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/20 text-xs font-semibold px-3 py-1 gap-1"
            >
              <Zap size={12} />
              +{report.points} EcoPuntos
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <FileText size={14} className="text-[#4ADE80]" />
              Descripción
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{report.description}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Calendar size={12} />
              {formatDateFull(report.date)}
            </div>
          </div>

          <Separator className="bg-border" />

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Camera size={14} className="text-[#00D4FF]" />
              Fotos del reporte
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                'bg-[#4ADE80]/15 border-[#4ADE80]/20',
                'bg-[#00D4FF]/15 border-[#00D4FF]/20',
                'bg-[#818CF8]/15 border-[#818CF8]/20',
              ].map((bg, i) => (
                <div
                  key={i}
                  className={`aspect-[4/3] rounded-xl ${bg} border border-dashed flex items-center justify-center`}
                >
                  <Image size={20} className="text-muted-foreground/30" />
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-[#FBBF24]" />
              Ubicación
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[80px]">Dirección:</span>
                <span className="text-foreground">{report.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[80px]">Distrito:</span>
                <span className="text-foreground">{report.district}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground min-w-[80px]">Referencia:</span>
                <span className="text-foreground">{report.reference}</span>
              </div>
            </div>
            <div className="mt-3 aspect-[2/1] rounded-xl bg-card border border-border overflow-hidden relative">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-border/30" />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#EF4444]/20 border-2 border-[#EF4444] flex items-center justify-center animate-bounce">
                    <Navigation size={10} className="text-[#EF4444]" />
                  </div>
                  <span className="text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full">
                    {report.district}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded-lg">
                <Map size={10} />
                Mapa simulado
              </div>
            </div>
          </div>

          {report.aiAnalysis && (
            <>
              <Separator className="bg-border" />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Brain size={14} className="text-[#818CF8]" />
                  Análisis de Inteligencia Artificial
                </h3>
                <div className="p-4 rounded-xl bg-[#4ADE80]/5 border border-[#4ADE80]/15 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-card border border-border flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-[#4ADE80]">{report.aiAnalysis.confidence}</span>
                      <span className="text-[9px] text-muted-foreground">%</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#4ADE80]">Nivel de confianza</p>
                      <Progress
                        value={report.aiAnalysis.confidence}
                        className="h-2 mt-1.5 bg-card"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Recomendación</p>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {report.aiAnalysis.recommendation}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Sparkles size={10} className="text-[#4ADE80]" />
                    Análisis realizado por IA — EcoAlert VES
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator className="bg-border" />

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock size={14} className="text-[#FBBF24]" />
              Historial del reporte
            </h3>
            <div className="relative ml-3">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4ADE80] via-[#4ADE80]/50 to-border" />
              <div className="space-y-0">
                {report.timeline.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isLast = idx === report.timeline.length - 1;

                  return (
                    <div key={step.key} className={`relative flex gap-4 ${!isLast ? 'pb-6' : ''}`}>
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                          step.completed
                            ? 'bg-[#4ADE80]/20 border-[#4ADE80] text-[#4ADE80]'
                            : step.current
                            ? 'bg-[#4ADE80]/10 border-[#4ADE80] text-[#4ADE80] animate-pulse'
                            : 'bg-card border-border text-muted-foreground/50'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <StepIcon size={14} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p
                            className={`text-sm font-semibold ${
                              step.completed
                                ? 'text-foreground'
                                : step.current
                                ? 'text-[#4ADE80]'
                                : 'text-muted-foreground/60'
                            }`}
                          >
                            {step.title}
                          </p>
                          {step.completed && (
                            <span className="text-[10px] text-[#4ADE80]/60">✓</span>
                          )}
                          {step.current && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-ping" />
                          )}
                        </div>
                        <p
                          className={`text-xs leading-relaxed ${
                            step.completed || step.current
                              ? 'text-muted-foreground'
                              : 'text-muted-foreground/40'
                          }`}
                        >
                          {step.description}
                        </p>
                        {step.timestamp && (
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {formatDateShort(step.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background/90 backdrop-blur-xl border-t border-border px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Cerrar
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => toast.info('Función de compartir próximamente disponible')}
              className="border-border text-muted-foreground hover:text-[#00D4FF] hover:border-[#00D4FF]/30 gap-2"
            >
              <Share2 size={16} />
              Compartir
            </Button>
            <Button
              onClick={() => {
                onDelete(report.id);
                onClose();
              }}
              variant="outline"
              className="border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 gap-2"
            >
              <Trash2 size={16} />
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
