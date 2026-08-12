import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Trophy, Zap, MapPin, Target, BookOpen, Newspaper, ArrowRight,
  TrendingUp, Calendar, Clock, ChevronRight, Leaf, Shield, Flame,
  BarChart3, CheckCircle2, Star, Sparkles, Users, Settings, User,
  TrendingDown, Minus, Lock, RefreshCw, Award, Droplets,
  TreePine, Recycle, Eye, Play, ArrowUpRight, Heart,
  Sunrise, Moon, Activity, ThumbsUp, MessageCircle,
} from 'lucide-react';
import { authService, User as UserType } from '@/services/authService';
import { userService, UserStats } from '@/services/userService';
import PointsService from '@/services/pointsService';
import { toast } from 'sonner';

const MOCK_STREAK = 7;
const MOCK_REPORTS_RESUELTOS = 12;
const MOCK_CURSOS_COMPLETADOS = 3;
const MOCK_LIKES_RECEIVED = 34;
const MOCK_COMMENTS_RECEIVED = 8;

const XP_BREAKDOWN = [
  { source: 'Reportes aprobados', points: 320, color: '#4ADE80', pct: 40 },
  { source: 'Cursos completados', points: 180, color: '#00D4FF', pct: 22 },
  { source: 'Misiones diarias', points: 150, color: '#FBBF24', pct: 19 },
  { source: 'Insignias desbloqueadas', points: 100, color: '#818CF8', pct: 12 },
  { source: 'Compartir contenido', points: 50, color: '#F472B6', pct: 7 },
];

const DAILY_MISSIONS = [
  { id: 'm1', title: 'Reporte matutino', desc: 'Realiza tu primer reporte del día', icon: MapPin, points: 50, total: 1, color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10' },
  { id: 'm2', title: 'Lector ambiental', desc: 'Lee 2 artículos del centro educativo', icon: BookOpen, points: 30, total: 2, color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10' },
  { id: 'm3', title: 'Comparte la conciencia', desc: 'Comparte una noticia ambiental en redes sociales', icon: Users, points: 40, total: 1, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10' },
  { id: 'm4', title: 'Explorador del barrio', desc: 'Identifica un punto verde en tu zona de Villa El Salvador', icon: Leaf, points: 35, total: 1, color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10' },
  { id: 'm5', title: 'Reciclador activo', desc: 'Registra una acción de reciclaje en el centro de acopio', icon: Recycle, points: 25, total: 1, color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10' },
];

const WEEKLY_DATA = {
  reportes: [3, 5, 2, 7, 4, 6, 1],
  cursos: [0, 1, 0, 2, 1, 0, 1],
  puntos: [50, 120, 80, 200, 110, 150, 40],
  tiempo: [1.2, 2.5, 1.8, 3.1, 2.0, 2.8, 0.5],
};

const WEEKLY_SUMMARY: Record<string, { total: number; avg: number; best: string; trend: string }> = {
  reportes: { total: 28, avg: 4, best: 'Jueves', trend: '+15%' },
  cursos: { total: 5, avg: 0.7, best: 'Jueves', trend: '+2%' },
  puntos: { total: 750, avg: 107, best: 'Jueves', trend: '+23%' },
  tiempo: { total: 13.9, avg: 2, best: 'Jueves', trend: '+8%' },
};

const ACTIVITY_TIMELINE = [
  { text: 'Reportaste basura acumulada en Av. La Marina, Mz. A Lt. 15, San Juan de Lurigancho', time: 'Hace 2 horas', icon: MapPin, color: 'text-[#4ADE80]', category: 'Reporte',地点: 'SJL' },
  { text: 'Completaste el curso "Reciclaje Básico" con calificación de 95/100 puntos', time: 'Ayer a las 14:30', icon: BookOpen, color: 'text-[#00D4FF]', category: 'Curso' },
  { text: 'Desbloqueaste la insignia "Primer Reporte" — ¡Felicitaciones por tu primer envío!', time: 'Hace 3 días', icon: Trophy, color: 'text-[#FBBF24]', category: 'Logro' },
  { text: 'Tu reporte #5 fue analizado exitosamente por el sistema de IA de EcoAlert', time: 'Hace 4 días', icon: Sparkles, color: 'text-[#818CF8]', category: 'IA' },
  { text: 'Ganaste 50 EcoPuntos por compartir contenido ambiental en redes sociales', time: 'Hace 5 días', icon: Zap, color: 'text-[#4ADE80]', category: 'Puntos' },
  { text: 'Reportaste posible contaminación del río Rímac a las 08:15 AM', time: 'Hace 6 días', icon: Droplets, color: 'text-[#00D4FF]', category: 'Reporte' },
  { text: 'Participaste en la limpieza comunitaria del Parque Zonal de Villa El Salvador', time: 'Hace 1 semana', icon: Users, color: 'text-[#FBBF24]', category: 'Evento' },
  { text: 'Registraste tu primer reciclaje de plásticos en el centro verde de tuMZ', time: 'Hace 1 semana', icon: Recycle, color: 'text-[#4ADE80]', category: 'Acción' },
];

const ECO_TIPS = [
  { text: 'Cerrar el grifo mientras te cepillas los dientes puede ahorrar hasta 8 litros de agua al día. ¡Una acción simple con gran impacto para nuestra comunidad!', author: 'Conservación de agua', category: 'Agua' },
  { text: 'Una botella de plástico tarda aproximadamente 450 años en degradarse. ¡Recíclala siempre y ayuda a reducir la contaminación en Villa El Salvador!', author: 'Gestión de residuos', category: 'Residuos' },
  { text: 'Caminar o usar bicicleta en trayectos cortos reduce las emisiones de CO₂ en un 30%. Villa El Salvador tiene excelentes ciclovías para aprovechar.', author: 'Transporte sustentable', category: 'Transporte' },
  { text: 'Plantar un árbol puede absorber hasta 22 kg de CO₂ al año. ¡Contribuye a reforestar nuestro distrito y mejora el aire que respiramos todos!', author: 'Reforestación', category: 'Naturaleza' },
  { text: 'Compostar residuos orgánicos reduce la basura doméstica en un 30% y genera abono natural para tus plantas y huertos comunitarios del distrito.', author: 'Compostaje', category: 'Orgánico' },
  { text: 'Desconecta cargadores cuando no los uses. El consumo fantasma representa hasta el 10% de tu factura eléctrica mensual. ¡Ahorra energía y dinero!', author: 'Eficiencia energética', category: 'Energía' },
  { text: 'Reutilizar frascos de vidrio como recipientes de almacenamiento reduce la demanda de nuevos materiales y ahorra energía de fabricación significativamente.', author: 'Reutilización creativa', category: 'Reutilizar' },
];

const UPCOMING_EVENTS = [
  { date: '25 Jul', title: 'Limpieza Playa San Pedro', type: 'Campaña', color: 'bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/20', desc: 'Jornada de limpieza costera comunitaria', location: 'Playa San Pedro' },
  { date: '28 Jul', title: 'Taller de Compostaje', type: 'Taller', color: 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/20', desc: 'Aprende a compostar en casa con expertos', location: 'Centro Comunal' },
  { date: '02 Ago', title: 'Carrera Verde 5K', type: 'Evento', color: 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/20', desc: 'Carrera ecológica solidaria por Villa El Salvador', location: 'Av. El Sol' },
  { date: '05 Ago', title: 'Festival del Árbol', type: 'Festival', color: 'bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/20', desc: 'Jornada masiva de reforestación y educación', location: 'Parque Zonal' },
];

const QUICK_ACTIONS = [
  { label: 'Crear Reporte', desc: 'Reporta un problema ambiental en tu zona de Villa El Salvador', icon: MapPin, route: '/report', color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10', hoverBg: 'hover:bg-[#4ADE80]/15', glow: 'shadow-[#4ADE80]/20' },
  { label: 'Continuar Curso', desc: 'Sigue aprendiendo sobre medio ambiente y sostenibilidad', icon: Play, route: '/education', color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10', hoverBg: 'hover:bg-[#00D4FF]/15', glow: 'shadow-[#00D4FF]/20' },
  { label: 'Ver Noticias', desc: 'Entérate de las últimas novedades ambientales del distrito', icon: Newspaper, route: '/news', color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', hoverBg: 'hover:bg-[#FBBF24]/15', glow: 'shadow-[#FBBF24]/20' },
  { label: 'Ver Ranking', desc: 'Conoce a los mejores ciudadanos ambientales del ranking', icon: Trophy, route: '/ranking', color: 'text-[#818CF8]', bg: 'bg-[#818CF8]/10', hoverBg: 'hover:bg-[#818CF8]/15', glow: 'shadow-[#818CF8]/20' },
  { label: 'Mi Perfil', desc: 'Gestiona tu cuenta, logros e historial de actividad', icon: User, route: '/profile', color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10', hoverBg: 'hover:bg-[#4ADE80]/15', glow: 'shadow-[#4ADE80]/20' },
  { label: 'Configuración', desc: 'Ajustes y preferencias de notificaciones de la app', icon: Settings, route: '/settings', color: 'text-[#9CA3AF]', bg: 'bg-[#9CA3AF]/10', hoverBg: 'hover:bg-[#9CA3AF]/15', glow: 'shadow-[#9CA3AF]/20' },
];

const RECOMMENDATIONS = [
  {
    title: 'Curso: Reciclaje Avanzado',
    desc: 'Aprende técnicas avanzadas de separación de residuos y obtén una insignia especial al completarlo con éxito.',
    icon: BookOpen, color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10',
    route: '/education', category: 'Curso', duration: '2h 30min', rating: '4.8', students: '342',
  },
  {
    title: 'Noticia: Día del Árbol 2026',
    desc: 'Evento comunitario este sábado en el Parque de Villa El Salvador. Participa y gana EcoPuntos extra.',
    icon: Newspaper, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10',
    route: '/news', category: 'Noticia', date: '26 Jul 2026', views: '1,204',
  },
  {
    title: 'Campaña: Lima Verde 2026',
    desc: 'Únete a la iniciativa de reforestación urbana en nuestro distrito y gana puntos por cada árbol plantado.',
    icon: TreePine, color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10',
    route: '/news', category: 'Campaña', participants: '1,240', goal: '500 árboles',
  },
];

const MONTHLY_GOALS = [
  { label: 'Reportes este mes', current: 14, target: 20, icon: MapPin, color: 'text-[#4ADE80]' },
  { label: 'Cursos completados', current: 2, target: 4, icon: BookOpen, color: 'text-[#00D4FF]' },
  { label: 'Puntos acumulados', current: 420, target: 800, icon: Zap, color: 'text-[#FBBF24]' },
  { label: 'Misiones completadas', current: 18, target: 30, icon: Target, color: 'text-[#818CF8]' },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function getGreetingIcon() {
  const h = new Date().getHours();
  if (h < 12) return Sunrise;
  if (h < 19) return ({ size, className }: { size?: number; className?: string }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
  return Moon;
}

function formatLastAccess(): string {
  const now = new Date();
  return now.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }) + ' a las ' + now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

function getDayOfWeek(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;
  const days: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

const EVENT_DAYS = [25, 28, 2, 5];

function AnimatedCounter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count}</span>;
}

function CircularProgress({ value, size = 160, strokeWidth = 10 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(74,222,128,0.1)" strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#4ADE80" strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(74,222,128,0.3)" strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={circumference}
        strokeDashoffset={offset - 10}
        className="transition-all duration-1000 ease-out opacity-50 blur-[2px]"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserType | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'reportes' | 'cursos' | 'puntos' | 'tiempo'>('reportes');
  const [missionsDone, setMissionsDone] = useState<string[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [chartAnimated, setChartAnimated] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const cu = authService.getCurrentUser();
      if (!cu) { setLocation('/login'); return; }
      setUser(cu);
      try {
        const ud = await userService.getUserData(cu.uid);
        if (ud) setStats({ level: ud.level, ecoPoints: ud.ecoPoints, reportsCount: ud.reportsCount, achievements: ud.achievements });
      } catch { /* */ }
      setLoading(false);
    };
    load();
  }, [setLocation]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setChartAnimated(true), 300);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const levelInfo = useMemo(() => {
    if (!stats) return null;
    return PointsService.getProgressToNextLevel(stats.ecoPoints);
  }, [stats]);

  const todayIndex = getDayOfWeek();
  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const GreetingIcon = getGreetingIcon();

  const now = new Date();
  const calendarDays = useMemo(() => getCalendarDays(now.getFullYear(), now.getMonth()), []);
  const monthName = now.toLocaleDateString('es-PE', { month: 'long' });

  const toggleMission = useCallback((id: string) => {
    setMissionsDone(prev => {
      const next = prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id];
      if (!prev.includes(id)) {
        toast.success('¡Misión completada! + puntos ganados');
      }
      return next;
    });
  }, []);

  const cycleTip = useCallback(() => {
    setCurrentTipIndex(prev => (prev + 1) % ECO_TIPS.length);
  }, []);

  const unlockedBadges = useMemo(() => {
    if (!stats) return [];
    return PointsService.getUnlockedBadges(stats.achievements);
  }, [stats]);

  if (loading || !user || !stats || !levelInfo) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-[#4ADE80] border-t-transparent" />
          <p className="text-[#9CA3AF] text-sm">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const completedMissions = missionsDone.length;
  const totalMissions = DAILY_MISSIONS.length;
  const metricLabels: Record<string, string> = { reportes: 'Reportes', cursos: 'Cursos', puntos: 'EcoPuntos', tiempo: 'Horas' };
  const metricColors: Record<string, string> = { reportes: '#4ADE80', cursos: '#00D4FF', puntos: '#FBBF24', tiempo: '#818CF8' };
  const weekData = WEEKLY_DATA[selectedMetric];
  const maxWeekVal = Math.max(...weekData, 1);
  const weekSummary = WEEKLY_SUMMARY[selectedMetric];

  return (
    <div className="min-h-screen bg-[#0B0F14]">

      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B0F14 0%, #0d1520 40%, #0f1a12 70%, #0B0F14 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 animate-float" style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 60%)' }} />
          <div className="absolute top-10 right-1/4 w-2 h-2 rounded-full bg-[#4ADE80]/30 animate-pulse-glow" />
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 rounded-full bg-[#00D4FF]/20 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-[15%] w-1 h-1 rounded-full bg-[#FBBF24]/25 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-float">{levelInfo.currentLevel.emoji}</div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#E5E7EB]">
                    {getGreeting()}, <span className="eco-gradient-text">{user.displayName || 'Ciudadano Eco'}</span>! 🌱
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-[#4ADE80]/30 text-[#4ADE80] bg-[#4ADE80]/10 text-xs font-medium">
                      {levelInfo.currentLevel.emoji} Nivel {stats.level} — {levelInfo.currentLevel.name}
                    </Badge>
                    <Badge variant="outline" className="border-[#00D4FF]/30 text-[#00D4FF] bg-[#00D4FF]/10 text-xs">
                      <GreetingIcon size={12} className="mr-1" />
                      Resumen del día activo
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <span className="text-xs text-[#9CA3AF] uppercase tracking-wider">EcoScore</span>
                  <span className="text-4xl sm:text-5xl font-bold text-[#4ADE80]">
                    <AnimatedCounter target={stats.ecoPoints} />
                  </span>
                </div>
                <div className="hidden sm:block w-px h-12 bg-white/10" />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBBF24]/10 border border-[#FBBF24]/20">
                  <Flame size={16} className="text-[#FBBF24]" />
                  <span className="text-sm font-semibold text-[#FBBF24]">{MOCK_STREAK} días de racha</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#818CF8]/10 border border-[#818CF8]/20">
                  <ThumbsUp size={14} className="text-[#818CF8]" />
                  <span className="text-xs text-[#818CF8]">{MOCK_LIKES_RECEIVED} likes</span>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F472B6]/10 border border-[#F472B6]/20">
                  <MessageCircle size={14} className="text-[#F472B6]" />
                  <span className="text-xs text-[#F472B6]">{MOCK_COMMENTS_RECEIVED} comentarios</span>
                </div>
              </div>

              <div className="max-w-md">
                <div className="flex justify-between text-xs text-[#9CA3AF] mb-1.5">
                  <span>{levelInfo.currentLevel.emoji} {levelInfo.currentLevel.name}</span>
                  {levelInfo.nextLevel && <span>{levelInfo.nextLevel.emoji} {levelInfo.nextLevel.name}</span>}
                </div>
                <div className="relative">
                  <Progress value={levelInfo.progress} className="h-2.5" />
                </div>
                {levelInfo.nextLevel && (
                  <p className="text-xs text-[#9CA3AF] mt-1.5">
                    <span className="text-[#4ADE80] font-medium">{levelInfo.pointsNeeded}</span> puntos para {levelInfo.nextLevel.name}
                  </p>
                )}
              </div>

              <p className="text-xs text-[#9CA3AF]">
                Último acceso: {formatLastAccess()}
              </p>
            </div>

            <div className="hidden lg:flex flex-col items-center gap-3">
              <div className="relative">
                <CircularProgress value={levelInfo.progress} size={140} strokeWidth={8} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl">{levelInfo.currentLevel.emoji}</span>
                  <span className="text-xs font-bold text-[#4ADE80]">{Math.round(levelInfo.progress)}%</span>
                </div>
              </div>
              <span className="text-[10px] text-[#9CA3AF] text-center">Progreso de nivel</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'EcoScore', value: stats.ecoPoints, icon: Zap, color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10', trend: 'up' as const, change: '+23%' },
            { label: 'Nivel', value: stats.level, icon: Award, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', trend: 'up' as const, change: 'Actual' },
            { label: 'XP Total', value: stats.ecoPoints * 2, icon: Star, color: 'text-[#818CF8]', bg: 'bg-[#818CF8]/10', trend: 'up' as const, change: '+180' },
            { label: 'Reportes enviados', value: stats.reportsCount, icon: MapPin, color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10', trend: 'up' as const, change: '+3' },
            { label: 'Reportes resueltos', value: MOCK_REPORTS_RESUELTOS, icon: CheckCircle2, color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10', trend: 'up' as const, change: '+2' },
            { label: 'Cursos completados', value: MOCK_CURSOS_COMPLETADOS, icon: BookOpen, color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10', trend: 'same' as const, change: 'Igual' },
            { label: 'Insignias', value: unlockedBadges.length, icon: Trophy, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', trend: 'up' as const, change: '+1' },
            { label: 'Racha', value: MOCK_STREAK, icon: Flame, color: 'text-[#F97316]', bg: 'bg-[#F97316]/10', trend: 'up' as const, change: '+2d' },
          ].map((s: { label: string; value: number; icon: any; color: string; bg: string; trend: string; change: string }) => (
            <Card key={s.label} className="eco-card p-4 sm:p-5 group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div className="flex items-center gap-1">
                  {s.trend === 'up' && <TrendingUp size={12} className="text-[#4ADE80]" />}
                  {s.trend === 'down' && <TrendingDown size={12} className="text-[#EF4444]" />}
                  {s.trend === 'same' && <Minus size={12} className="text-[#9CA3AF]" />}
                  <span className={`text-[10px] font-medium ${s.trend === 'up' ? 'text-[#4ADE80]' : s.trend === 'down' ? 'text-[#EF4444]' : 'text-[#9CA3AF]'}`}>{s.change}</span>
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#E5E7EB]">
                <AnimatedCounter target={s.value} />
              </p>
              <p className="text-xs text-[#9CA3AF] mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        <Card className="eco-card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-[#4ADE80]" />
              <h3 className="font-bold text-[#E5E7EB]">Tu actividad esta semana</h3>
            </div>
            <div className="flex gap-1.5 p-1 rounded-xl bg-[#0B0F14] border border-white/5">
              {(['reportes', 'cursos', 'puntos', 'tiempo'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMetric(m);
                    setChartAnimated(false);
                    setTimeout(() => setChartAnimated(true), 50);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedMetric === m
                      ? 'bg-[#4ADE80]/15 text-[#4ADE80] shadow-sm'
                      : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-white/5'
                  }`}
                >
                  {metricLabels[m]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-3 items-end h-48 sm:h-56 mb-4">
            <div className="flex flex-col justify-between h-full py-1 pr-2 text-right">
              {[maxWeekVal, Math.round(maxWeekVal * 0.75), Math.round(maxWeekVal * 0.5), Math.round(maxWeekVal * 0.25), 0].map((v, i) => (
                <span key={i} className="text-[9px] text-[#9CA3AF]/60 leading-none">{v}</span>
              ))}
            </div>
            <div className="flex items-end gap-2 sm:gap-3 h-full relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-px bg-white/[0.03]" />
                ))}
              </div>
              {weekData.map((val, i) => {
                const heightPct = (val / maxWeekVal) * 100;
                const isToday = i === todayIndex;
                const isHovered = hoveredBar === i;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2 relative z-10"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {(isHovered || isToday) && (
                      <div className="absolute -top-8 bg-[#1a1f2e] border border-white/10 px-2 py-1 rounded-md text-[10px] text-[#E5E7EB] font-medium whitespace-nowrap shadow-lg z-20">
                        {val} {selectedMetric === 'tiempo' ? 'h' : ''}
                      </div>
                    )}
                    <div className="w-full relative flex justify-center" style={{ height: '100%' }}>
                      <div
                        className={`w-full max-w-[48px] rounded-t-lg transition-all duration-700 ease-out ${
                          isToday ? 'ring-1 ring-[#4ADE80]/40 shadow-lg shadow-[#4ADE80]/10' : ''
                        } ${isHovered ? 'brightness-125' : ''}`}
                        style={{
                          height: chartAnimated ? `${Math.max(heightPct, 4)}%` : '0%',
                          background: isToday
                            ? `linear-gradient(180deg, ${metricColors[selectedMetric]} 0%, ${metricColors[selectedMetric]}88 100%)`
                            : `linear-gradient(180deg, ${metricColors[selectedMetric]}66 0%, ${metricColors[selectedMetric]}33 100%)`,
                          transitionDelay: `${i * 80}ms`,
                        }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${isToday ? 'text-[#4ADE80]' : 'text-[#9CA3AF]'}`}>{dayLabels[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-white/5 my-4" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Total semanal</p>
              <p className="text-lg font-bold text-[#E5E7EB] mt-1">{weekSummary.total}{selectedMetric === 'tiempo' ? 'h' : ''}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Promedio</p>
              <p className="text-lg font-bold text-[#E5E7EB] mt-1">{weekSummary.avg}{selectedMetric === 'tiempo' ? 'h' : ''}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Mejor día</p>
              <p className="text-lg font-bold text-[#4ADE80] mt-1">{weekSummary.best}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Tendencia</p>
              <p className="text-lg font-bold text-[#4ADE80] mt-1">{weekSummary.trend}</p>
            </div>
          </div>
        </Card>

        <Card className="eco-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Target size={20} className="text-[#4ADE80]" />
              <h3 className="font-bold text-[#E5E7EB]">Misiones del día</h3>
            </div>
            <Badge variant="outline" className="border-[#4ADE80]/30 text-[#4ADE80] text-xs">
              {completedMissions}/{totalMissions} completadas
            </Badge>
          </div>
          <div className="mb-5">
            <div className="flex justify-between text-xs text-[#9CA3AF] mb-1.5">
              <span>Progreso diario — {completedMissions === totalMissions ? '¡Todas completadas!' : `${totalMissions - completedMissions} restantes`}</span>
              <span>{Math.round((completedMissions / totalMissions) * 100)}%</span>
            </div>
            <Progress value={(completedMissions / totalMissions) * 100} className="h-2.5" />
          </div>
          <div className="space-y-3">
            {DAILY_MISSIONS.map((m) => {
              const isDone = missionsDone.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => toggleMission(m.id)}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer group ${
                    isDone
                      ? 'bg-[#4ADE80]/5 border-[#4ADE80]/20'
                      : 'bg-[#0B0F14]/50 border-white/5 hover:border-[#4ADE80]/15 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isDone
                      ? 'bg-[#4ADE80] border-[#4ADE80] scale-110'
                      : `border-white/15 group-hover:border-[#4ADE80]/40 ${m.bg}`
                  }`}>
                    {isDone ? (
                      <CheckCircle2 size={16} className="text-[#0B0F14]" />
                    ) : (
                      <m.icon size={15} className={m.color} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium transition-all ${isDone ? 'line-through text-[#9CA3AF]' : 'text-[#E5E7EB]'}`}>{m.title}</p>
                      {isDone && <Badge variant="outline" className="text-[9px] border-[#4ADE80]/30 text-[#4ADE80] px-1.5 py-0 h-4">Hecho</Badge>}
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{m.desc}</p>
                  </div>
                  <span className={`text-xs font-bold shrink-0 ${isDone ? 'text-[#4ADE80]' : 'text-[#4ADE80]/70'}`}>+{m.points} pts</span>
                </div>
              );
            })}
          </div>
          {completedMissions === totalMissions && (
            <div className="mt-4 p-3 rounded-xl bg-[#4ADE80]/5 border border-[#4ADE80]/20 text-center">
              <p className="text-sm text-[#4ADE80] font-semibold">🎉 ¡Todas las misiones completadas!</p>
              <p className="text-xs text-[#9CA3AF] mt-1">Has ganado {DAILY_MISSIONS.reduce((sum, m) => sum + m.points, 0)} EcoPuntos hoy</p>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="eco-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target size={20} className="text-[#00D4FF]" />
                  <h3 className="font-bold text-[#E5E7EB]">Tu progreso</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-[#9CA3AF] hover:text-[#4ADE80] h-8" onClick={() => setLocation('/profile')}>
                  Ver perfil <ChevronRight size={14} />
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                <div className="relative shrink-0">
                  <CircularProgress value={levelInfo.progress} size={160} strokeWidth={10} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl mb-1">{levelInfo.currentLevel.emoji}</span>
                    <span className="text-xl font-bold text-[#4ADE80]">{Math.round(levelInfo.progress)}%</span>
                    <span className="text-[10px] text-[#9CA3AF]">{levelInfo.currentLevel.name}</span>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-center flex flex-col items-center">
                      <span className="text-lg">{levelInfo.currentLevel.emoji}</span>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{levelInfo.currentLevel.name}</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex-1 h-px bg-gradient-to-r from-[#4ADE80]/40 via-[#4ADE80]/20 to-[#00D4FF]/40" />
                      <ArrowRight size={16} className="text-[#4ADE80] mx-2" />
                      <div className="flex-1 h-px bg-gradient-to-r from-[#00D4FF]/40 via-[#00D4FF]/20 to-transparent" />
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <span className="text-lg">{levelInfo.nextLevel ? levelInfo.nextLevel.emoji : '👑'}</span>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{levelInfo.nextLevel ? levelInfo.nextLevel.name : 'Máximo'}</p>
                    </div>
                  </div>
                  <Separator className="bg-white/5" />
                  <div className="space-y-3">
                    {[
                      { label: 'Reportes realizados', value: stats.reportsCount, pct: Math.min((stats.reportsCount / 50) * 100, 100), color: '#4ADE80' },
                      { label: 'Cursos completados', value: MOCK_CURSOS_COMPLETADOS, pct: Math.min((MOCK_CURSOS_COMPLETADOS / 10) * 100, 100), color: '#00D4FF' },
                      { label: 'Insignias obtenidas', value: unlockedBadges.length, pct: (unlockedBadges.length / PointsService.BADGES.length) * 100, color: '#FBBF24' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-[#9CA3AF]">{item.label}</span>
                          <span className="text-[#E5E7EB] font-medium">{item.value}</span>
                        </div>
                        <div className="relative">
                          <Progress value={item.pct} className="h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#4ADE80]/5 border border-[#4ADE80]/10 text-center">
                      <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">XP total</p>
                      <p className="text-lg font-bold text-[#4ADE80] mt-1">{stats.ecoPoints * 2}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#00D4FF]/5 border border-[#00D4FF]/10 text-center">
                      <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Objetivos</p>
                      <p className="text-lg font-bold text-[#00D4FF] mt-1">{completedMissions}/{totalMissions}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FBBF24]/5 border border-[#FBBF24]/10 text-center">
                      <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Racha</p>
                      <p className="text-lg font-bold text-[#FBBF24] mt-1">{MOCK_STREAK}d</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="eco-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-[#00D4FF]" />
                <h3 className="font-bold text-[#E5E7EB]">Actividad reciente</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-[#9CA3AF] hover:text-[#4ADE80] h-8" onClick={() => setLocation('/reports')}>
                Ver todo <ChevronRight size={14} />
              </Button>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-3 bottom-3 w-px bg-gradient-to-b from-[#4ADE80]/30 via-[#00D4FF]/20 to-transparent" />
              <div className="space-y-1">
                {ACTIVITY_TIMELINE.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${i * 75}ms` }}
                  >
                    <div className="relative z-10 w-8 h-8 rounded-full bg-[#1a1f2e] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <a.icon size={14} className={a.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#E5E7EB] leading-snug">{a.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#9CA3AF]">{a.time}</span>
                        <Badge variant="outline" className="text-[9px] border-white/10 text-[#9CA3AF] px-1.5 py-0 h-4">{a.category}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Card className="eco-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={20} className="text-[#4ADE80]" />
            <h3 className="font-bold text-[#E5E7EB]">Recomendado para ti</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDATIONS.map((r) => (
              <div
                key={r.title}
                onClick={() => { setLocation(r.route); toast.info(`Abriendo: ${r.title}`); }}
                className="p-4 sm:p-5 rounded-xl bg-[#0B0F14]/50 border border-white/5 hover:border-[#4ADE80]/20 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-lg hover:shadow-[#4ADE80]/5"
              >
                <div className={`w-10 h-10 rounded-xl ${r.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <r.icon size={20} className={r.color} />
                </div>
                <Badge variant="outline" className="text-[9px] border-white/10 text-[#9CA3AF] mb-2">{r.category}</Badge>
                <p className="text-sm font-semibold text-[#E5E7EB] group-hover:text-[#4ADE80] transition-colors">{r.title}</p>
                <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">{r.desc}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-white/5">
                  {'duration' in r && <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1"><Clock size={10} />{(r as any).duration}</span>}
                  {'date' in r && <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1"><Calendar size={10} />{(r as any).date}</span>}
                  {'rating' in r && <span className="text-[10px] text-[#FBBF24] flex items-center gap-1"><Star size={10} />{(r as any).rating}</span>}
                  {'students' in r && <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1"><Users size={10} />{(r as any).students}</span>}
                  {'participants' in r && <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1"><Users size={10} />{(r as any).participants}</span>}
                  {'views' in r && <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1"><Eye size={10} />{(r as any).views}</span>}
                  {'goal' in r && <span className="text-[10px] text-[#4ADE80] flex items-center gap-1"><Target size={10} />{(r as any).goal}</span>}
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-[#4ADE80] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Ver más</span>
                  <ArrowUpRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="eco-card overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1520 50%, #111a14 100%)' }}>
          <div className="relative p-6 sm:p-8">
            <div className="absolute top-3 left-5 text-7xl sm:text-9xl text-[#4ADE80]/[0.07] font-serif leading-none select-none">&ldquo;</div>
            <div className="absolute bottom-3 right-5 text-7xl sm:text-9xl text-[#4ADE80]/[0.07] font-serif leading-none select-none rotate-180">&ldquo;</div>
            <div className="relative z-10 pt-6 sm:pt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#4ADE80]/10 flex items-center justify-center">
                  <Leaf size={16} className="text-[#4ADE80]" />
                </div>
                <span className="text-xs font-semibold text-[#4ADE80] uppercase tracking-wider">Tip del día</span>
                <Badge variant="outline" className="text-[9px] border-[#4ADE80]/20 text-[#4ADE80]/60 bg-[#4ADE80]/5 ml-1">
                  {ECO_TIPS[currentTipIndex].category}
                </Badge>
              </div>
              <p className="text-lg sm:text-xl text-[#E5E7EB] font-medium leading-relaxed max-w-3xl">
                {ECO_TIPS[currentTipIndex].text}
              </p>
              <p className="text-sm text-[#9CA3AF] mt-3 flex items-center gap-2">
                <span className="w-6 h-px bg-[#9CA3AF]/50" />
                {ECO_TIPS[currentTipIndex].author}
              </p>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cycleTip}
                    className="border-[#4ADE80]/20 text-[#4ADE80] hover:bg-[#4ADE80]/10 gap-1.5"
                  >
                    <RefreshCw size={14} />
                    Otro tip
                  </Button>
                  <span className="text-[10px] text-[#9CA3AF]">{currentTipIndex + 1} / {ECO_TIPS.length}</span>
                </div>
                <div className="flex gap-1.5">
                  {ECO_TIPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTipIndex(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === currentTipIndex
                          ? 'bg-[#4ADE80] w-5 h-2'
                          : 'bg-white/15 hover:bg-white/25 w-2 h-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="eco-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Calendar size={20} className="text-[#FBBF24]" />
              <h3 className="font-bold text-[#E5E7EB]">Próximos eventos</h3>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#E5E7EB] capitalize">{monthName} {now.getFullYear()}</span>
                <span className="text-[10px] text-[#9CA3AF]">{EVENT_DAYS.length} eventos este mes</span>
              </div>
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                  <div key={d} className="text-center text-[10px] text-[#9CA3AF] font-medium py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.map((day, i) => (
                  <div key={i} className="aspect-square flex flex-col items-center justify-center relative">
                    {day && (
                      <>
                        <span className={`text-xs ${
                          day === now.getDate()
                            ? 'text-[#4ADE80] font-bold bg-[#4ADE80]/10 rounded-full w-6 h-6 flex items-center justify-center'
                            : 'text-[#E5E7EB]/70'
                        }`}>{day}</span>
                        {EVENT_DAYS.includes(day) && (
                          <div className="w-1 h-1 rounded-full bg-[#4ADE80] absolute bottom-0.5" />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/5 mb-4" />

            <div className="space-y-2.5">
              {UPCOMING_EVENTS.map((e, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <div className="w-12 text-center shrink-0">
                    <p className="text-[10px] text-[#9CA3AF]">{e.date.split(' ')[0]}</p>
                    <p className="text-sm font-bold text-[#E5E7EB]">{e.date.split(' ')[1]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#E5E7EB] truncate group-hover:text-[#4ADE80] transition-colors">{e.title}</p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{e.desc}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${e.color}`}>{e.type}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="eco-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={20} className="text-[#4ADE80]" />
                <h3 className="font-bold text-[#E5E7EB]">Acciones rápidas</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {QUICK_ACTIONS.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => { setLocation(a.route); toast.info(`Navegando a ${a.label}`); }}
                    className={`eco-card p-4 text-left ${a.hoverBg} transition-all duration-300 group`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <a.icon size={20} className={a.color} />
                    </div>
                    <p className="text-sm font-semibold text-[#E5E7EB] group-hover:text-[#4ADE80] transition-colors">{a.label}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5 leading-relaxed">{a.desc}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="eco-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart size={20} className="text-[#F472B6]" />
                  <h3 className="font-bold text-[#E5E7EB]">Objetivos alcanzados</h3>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { text: 'Primer reporte enviado', done: true },
                  { text: 'Curso "Reciclaje Básico" completado', done: true },
                  { text: 'Insignia "Primer Reporte" desbloqueada', done: true },
                  { text: '7 días de racha activa', done: true },
                  { text: '10 reportes en total', done: stats.reportsCount >= 10 },
                  { text: 'Primer comentario en reporte ajeno', done: MOCK_COMMENTS_RECEIVED > 0 },
                ].map((obj, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${obj.done ? 'bg-[#4ADE80]' : 'border-2 border-white/15'}`}>
                      {obj.done && <CheckCircle2 size={12} className="text-[#0B0F14]" />}
                    </div>
                    <span className={`text-sm ${obj.done ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}`}>{obj.text}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="eco-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={20} className="text-[#818CF8]" />
                <h3 className="font-bold text-[#E5E7EB]">Objetivos mensuales</h3>
              </div>
              <div className="space-y-3">
                {MONTHLY_GOALS.map((g) => {
                  const pct = Math.min((g.current / g.target) * 100, 100);
                  return (
                    <div key={g.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#9CA3AF] flex items-center gap-1.5">
                          <g.icon size={12} className={g.color} /> {g.label}
                        </span>
                        <span className="text-xs font-bold text-[#E5E7EB]">{g.current}/{g.target}</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-[#818CF8]/5 border border-[#818CF8]/10 text-center">
                <p className="text-xs text-[#9CA3AF]">Progreso mensual general</p>
                <p className="text-lg font-bold text-[#818CF8] mt-1">62%</p>
              </div>
            </Card>
          </div>
        </div>

        <Card className="eco-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-[#FBBF24]" />
              <h3 className="font-bold text-[#E5E7EB]">Insignias destacadas</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-[#FBBF24]/30 text-[#FBBF24] text-xs">
                {unlockedBadges.length}/{PointsService.BADGES.length} desbloqueadas
              </Badge>
              <Button variant="ghost" size="sm" className="text-xs text-[#9CA3AF] hover:text-[#FBBF24] h-8" onClick={() => setLocation('/profile')}>
                Ver todas <ChevronRight size={14} />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {PointsService.BADGES.map((b) => {
              const isUnlocked = stats.achievements.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`flex-shrink-0 w-36 sm:w-40 p-4 rounded-xl border text-center transition-all duration-300 ${
                    isUnlocked
                      ? 'bg-[#FBBF24]/5 border-[#FBBF24]/20 hover:border-[#FBBF24]/40 hover:shadow-lg hover:shadow-[#FBBF24]/5'
                      : 'bg-[#0B0F14]/50 border-white/5 opacity-50 grayscale hover:opacity-70 hover:grayscale-[50%]'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${isUnlocked ? 'animate-float' : ''}`}>{b.emoji}</div>
                  <p className={`text-xs font-semibold ${isUnlocked ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}`}>{b.name}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-1 leading-tight">{b.description}</p>
                  {!isUnlocked && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Lock size={10} className="text-[#9CA3AF]" />
                      <span className="text-[9px] text-[#9CA3AF]">Bloqueada</span>
                    </div>
                  )}
                  {isUnlocked && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <CheckCircle2 size={10} className="text-[#FBBF24]" />
                      <span className="text-[9px] text-[#FBBF24]">Obtenida</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="eco-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={20} className="text-[#818CF8]" />
            <h3 className="font-bold text-[#E5E7EB]">Desglose de XP</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              {XP_BREAKDOWN.map((item) => (
                <div key={item.source} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#E5E7EB] truncate">{item.source}</span>
                      <span className="text-[#9CA3AF] font-medium shrink-0 ml-2">{item.points} pts</span>
                    </div>
                    <Progress value={item.pct} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#0B0F14]/50 border border-white/5">
              <div className="relative mb-4">
                <CircularProgress value={75} size={120} strokeWidth={8} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#4ADE80]">{stats.ecoPoints * 2}</span>
                  <span className="text-[10px] text-[#9CA3AF]">XP total</span>
                </div>
              </div>
              <p className="text-xs text-[#9CA3AF] text-center mt-2">Tu progreso de XP es del 75% hacia la meta mensual de {Math.round((stats.ecoPoints * 2) / 0.75)} XP</p>
            </div>
          </div>
        </Card>

        <div className="text-center py-4">
          <p className="text-xs text-[#9CA3AF]/50">
            EcoAlert VES — Villa El Salvador, Perú · Hecho con 💚 para el medio ambiente
          </p>
        </div>

      </div>
    </div>
  );
}
