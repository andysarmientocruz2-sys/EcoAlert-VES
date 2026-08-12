import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  ChevronRight, ArrowRight, Eye, Camera, MapPin, Leaf, Zap, Users,
  BookOpen, Award, TrendingUp, Star, MessageCircle, Shield, Target,
  Globe, Heart, BarChart3, Bell, Sparkles, Send, Newspaper, Trophy,
  ArrowUpRight, CheckCircle2, Play, Flame, FileText, Clock,
} from 'lucide-react';

// ─── CUSTOM HOOKS ────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(end: number, duration = 2000, startOnView = true) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setVal(Math.floor(p * end));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, end, duration]);

  return { ref, val, start };
}

// ─── REVEAL WRAPPER ──────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── FLOATING ELEMENT ────────────────────────────────────────────────
function FloatingEl({ children, className = '', delay = 0, duration = 3500 }: { children: React.ReactNode; className?: string; delay?: number; duration?: number }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{ animation: `float ${duration}ms ease-in-out ${delay}ms infinite` }}
    >
      {children}
    </div>
  );
}

// ─── DATA ────────────────────────────────────────────────────────────
const STATS = [
  { icon: FileText, value: 12480, suffix: '+', label: 'Reportes registrados', color: '#4ADE80' },
  { icon: Users, value: 3200, suffix: '+', label: 'Ciudadanos activos', color: '#00D4FF' },
  { icon: MapPin, value: 890, suffix: '+', label: 'Incidencias resueltas', color: '#FBBF24' },
  { icon: Leaf, value: 5000, suffix: '+', label: 'Árboles plantados', color: '#4ADE80' },
];

const STEPS = [
  { num: '01', icon: Eye, title: 'Detecta', desc: 'Identificas un problema ambiental en tu comunidad: basura, contaminación, quemas ilegales.', color: '#4ADE80', gradient: 'from-[#4ADE80]/15 to-transparent' },
  { num: '02', icon: Camera, title: 'Reporta', desc: 'Regístralo con foto, descripción y ubicación GPS en menos de 60 segundos.', color: '#00D4FF', gradient: 'from-[#00D4FF]/15 to-transparent' },
  { num: '03', icon: MapPin, title: 'Visualiza', desc: 'La comunidad y las autoridades monitorean cada reporte en un mapa interactivo en tiempo real.', color: '#FBBF24', gradient: 'from-[#FBBF24]/15 to-transparent' },
  { num: '04', icon: Leaf, title: 'Transforma', desc: 'Juntos generamos un Villa El Salvador más limpio, sostenible y conectado.', color: '#A78BFA', gradient: 'from-[#A78BFA]/15 to-transparent' },
];

const BENEFITS = [
  { icon: Zap, title: 'Reportes Rápidos', desc: 'Documenta problemas ambientales con foto y GPS en menos de 60 segundos.', color: '#4ADE80' },
  { icon: Globe, title: 'Mapa en Vivo', desc: 'Visualiza todas las incidencias del distrito en un mapa interactivo actualizado al instante.', color: '#00D4FF' },
  { icon: BookOpen, title: 'Educación Ambiental', desc: 'Cursos interactivos, quizzes y recursos para convertirte en agente de cambio.', color: '#FBBF24' },
  { icon: Trophy, title: 'Gamificación', desc: 'Gana EcoPuntos, desbloquea insignias y compite con tu comunidad por el planeta.', color: '#A78BFA' },
  { icon: Newspaper, title: 'Noticias Verificadas', desc: 'Mantente informado con contenido ambiental curado y verificado por expertos.', color: '#F97316' },
  { icon: Heart, title: 'Comunidad Activa', desc: 'Conecta con vecinos, organizaciones y voluntarios que comparten tu pasión.', color: '#EC4899' },
];

const IMPACT_METRICS = [
  { value: 12480, suffix: '+', label: 'Reportes enviados', icon: '📋', color: '#4ADE80' },
  { value: 5000, suffix: '+', label: 'Árboles protegidos', icon: '🌳', color: '#22C55E' },
  { value: 3200, suffix: '+', label: 'Ciudadanos activos', icon: '👥', color: '#00D4FF' },
  { value: 890, suffix: '+', label: 'Reportes solucionados', icon: '✅', color: '#FBBF24' },
  { value: 24, suffix: '+', label: 'Campañas activas', icon: '📢', color: '#A78BFA' },
  { value: 45, suffix: '', label: 'Sectores cubiertos', icon: '🏘️', color: '#F97316' },
];

const EDU_COURSES = [
  { icon: '♻️', title: 'Fundamentos del Reciclaje', level: 'Principiante', progress: 100, lessons: 8, color: '#4ADE80' },
  { icon: '💧', title: 'Ahorro de Agua', level: 'Principiante', progress: 65, lessons: 6, color: '#00D4FF' },
  { icon: '🌱', title: 'Huerta Urbana', level: 'Intermedio', progress: 40, lessons: 10, color: '#22C55E' },
];

const NEWS_PREVIEW = [
  { emoji: '🌳', title: 'Villa El Salvador Alcanza Meta de 5,000 Árboles Plantados', category: 'Medio Ambiente', date: '18 Jul', readTime: '5 min', gradient: 'from-[#4ADE80] to-[#22C55E]' },
  { emoji: '🌬️', title: 'Nuevo Estudio Revela Mejora en la Calidad del Aire', category: 'Investigación', date: '17 Jul', readTime: '8 min', gradient: 'from-[#00D4FF] to-[#3B82F6]' },
  { emoji: '🧹', title: 'Campaña "Limpia Tu Barrio" Llega a 20 Sectores', category: 'Campañas', date: '16 Jul', readTime: '3 min', gradient: 'from-[#F97316] to-[#EF4444]' },
];

const TESTIMONIALS = [
  { name: 'María García', role: 'Coordinadora Ambiental Municipal', text: 'EcoAlert VES transformó la forma en que gestionamos los reportes ambientales. La participación ciudadana aumentó un 340% en solo 6 meses.', rating: 5, initials: 'MG', gradient: 'from-[#4ADE80] to-[#00D4FF]' },
  { name: 'Carlos Mendoza', role: 'Estudiante de Ingeniería Ambiental', text: 'La sección de educación es increíble. Aprendí más con los cursos de EcoAlert que en todo un semestre universitario. ¡Las insignias son adictivas!', rating: 5, initials: 'CM', gradient: 'from-[#00D4FF] to-[#3B82F6]' },
  { name: 'Ana Torres', role: 'Docente de Ciencias', text: 'Uso EcoAlert VES en mis clases. Mis estudiantes ahora reportan problemas ambientales en su comunidad con entusiasmo real. Es una herramienta educativa poderosa.', rating: 5, initials: 'AT', gradient: 'from-[#FBBF24] to-[#F97316]' },
  { name: 'Roberto Sánchez', role: 'Voluntario Comunitario', text: 'El mapa en vivo me permite ver exactamente dónde hay problemas en mi sector. He participado en 12 campañas de limpieza gracias a esta plataforma.', rating: 4, initials: 'RS', gradient: 'from-[#A78BFA] to-[#EC4899]' },
];

const ALLIES = [
  { name: 'Municipalidad de Villa El Salvador', desc: 'Gobierno local', icon: '🏛️' },
  { name: 'Ministerio del Ambiente', desc: 'Gobierno nacional', icon: '🌿' },
  { name: 'Universidad Nacional de Ingeniería', desc: 'Sector educativo', icon: '🎓' },
  { name: 'Conservamos Perú', desc: 'ONG ambiental', icon: '🌍' },
  { name: 'EcoLabs Peru', desc: 'Innovación tecnológica', icon: '💡' },
  { name: 'Jóvenes por el Clima', desc: 'Movimiento social', icon: '✊' },
];

// ─── PHONE MOCKUP ────────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] lg:w-[300px]">
      {/* Glow behind phone */}
      <div className="absolute -inset-12 bg-[rgba(74,222,128,0.06)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -inset-8 bg-[rgba(0,212,255,0.04)] rounded-full blur-2xl pointer-events-none" />

      {/* Floating notification cards */}
      <FloatingEl className="-top-4 -left-16 lg:-left-20 z-20" delay={0} duration={4000}>
        <div className="bg-[#1a1f2e] border border-[rgba(74,222,128,0.25)] rounded-xl px-3 py-2.5 shadow-xl shadow-black/30 flex items-center gap-2.5 w-44">
          <div className="w-8 h-8 rounded-lg bg-[#4ADE80]/15 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={14} className="text-[#4ADE80]" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white leading-tight">Reporte resuelto</p>
            <p className="text-[9px] text-gray-500">Hace 2 horas</p>
          </div>
        </div>
      </FloatingEl>

      <FloatingEl className="top-20 -right-14 lg:-right-18 z-20" delay={1200} duration={4500}>
        <div className="bg-[#1a1f2e] border border-[rgba(0,212,255,0.25)] rounded-xl px-3 py-2.5 shadow-xl shadow-black/30 flex items-center gap-2.5 w-44">
          <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/15 flex items-center justify-center flex-shrink-0">
            <MapPin size={14} className="text-[#00D4FF]" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white leading-tight">+12 reportes hoy</p>
            <p className="text-[9px] text-gray-500">Sector 3, VES</p>
          </div>
        </div>
      </FloatingEl>

      <FloatingEl className="bottom-16 -left-12 lg:-left-16 z-20" delay={2400} duration={3800}>
        <div className="bg-[#1a1f2e] border border-[rgba(251,191,36,0.25)] rounded-xl px-3 py-2.5 shadow-xl shadow-black/30 flex items-center gap-2.5 w-40">
          <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/15 flex items-center justify-center flex-shrink-0">
            <Trophy size={14} className="text-[#FBBF24]" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white leading-tight">+50 EcoPuntos</p>
            <p className="text-[9px] text-gray-500">¡Sigue así!</p>
          </div>
        </div>
      </FloatingEl>

      {/* Phone Frame */}
      <div className="relative bg-gradient-to-b from-[#2a2f3a] to-[#1a1f2e] rounded-[2.5rem] p-[3px] shadow-2xl shadow-black/50">
        <div className="bg-gradient-to-b from-[#1a1f2e] to-[#0B0F14] rounded-[2.3rem] overflow-hidden">
          {/* Notch */}
          <div className="flex justify-center pt-2">
            <div className="w-24 h-5 bg-black rounded-full" />
          </div>

          {/* Status bar */}
          <div className="flex justify-between items-center px-6 py-1.5">
            <span className="text-[10px] text-gray-400 font-medium">9:41</span>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-2 border border-gray-500 rounded-sm relative">
                <div className="absolute inset-0.5 bg-[#4ADE80] rounded-[1px]" style={{ width: '70%' }} />
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="px-4 pb-6">
            {/* App Header */}
            <div className="text-center mb-4 mt-2">
              <div className="inline-flex items-center gap-1.5 mb-1">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#4ADE80] to-[#00D4FF] flex items-center justify-center">
                  <Leaf size={10} className="text-[#0B0F14]" />
                </div>
                <span className="text-xs font-bold text-[#4ADE80]">EcoAlert VES</span>
              </div>
              <p className="text-[9px] text-gray-500">¿Qué deseas reportar?</p>
            </div>

            {/* Mini Map Placeholder */}
            <div className="w-full h-28 rounded-xl bg-gradient-to-br from-[#0d2818] via-[#0a1628] to-[#0B0F14] border border-white/[0.06] mb-3 relative overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(rgba(74,222,128,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />
              {/* Map pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <MapPin size={20} className="text-[#4ADE80] drop-shadow-lg" fill="rgba(74,222,128,0.3)" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#4ADE80] rounded-full animate-ping opacity-30" />
                </div>
              </div>
              {/* Small pins */}
              <MapPin size={10} className="absolute top-4 left-6 text-[#00D4FF] opacity-50" />
              <MapPin size={10} className="absolute top-8 right-8 text-[#FBBF24] opacity-50" />
              <MapPin size={10} className="absolute bottom-6 left-10 text-[#EF4444] opacity-50" />
            </div>

            {/* Report Options */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🗑️', label: 'Basura', color: '#4ADE80' },
                { icon: '🔥', label: 'Quema', color: '#EF4444' },
                { icon: '💧', label: 'Agua', color: '#00D4FF' },
                { icon: '📍', label: 'Otro', color: '#FBBF24' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-3 flex flex-col items-center gap-1.5 border transition-colors" style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}25` }}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[9px] text-gray-300 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────
export default function Home() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);

  const heroStats = useCountUp(12480, 2200);
  const heroCitizens = useCountUp(3200, 2200);
  const heroResolved = useCountUp(890, 2200);
  const heroTrees = useCountUp(5000, 2200);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white overflow-hidden">
      <div className="h-16" />

      {/* ════════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section id="inicio" className="relative pt-8 pb-20 sm:pt-12 sm:pb-28 px-4 sm:px-6 lg:px-8">
        {/* Background orbs */}
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-[rgba(74,222,128,0.06)] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[rgba(0,212,255,0.04)] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-7">
              {/* Badge */}
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-full px-4 py-2">
                  <Sparkles size={14} className="text-[#4ADE80]" />
                  <span className="text-xs sm:text-sm text-[#4ADE80] font-medium">Plataforma de Inteligencia Ambiental</span>
                </div>
              </Reveal>

              {/* Title */}
              <Reveal delay={80}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight">
                  Protege tu{' '}
                  <span className="bg-gradient-to-r from-[#4ADE80] via-[#22D3EE] to-[#00D4FF] bg-clip-text text-transparent">
                    comunidad
                  </span>
                  <br />
                  con tecnología
                </h1>
              </Reveal>

              {/* Tagline */}
              <Reveal delay={160}>
                <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-lg">
                  EcoAlert VES combina <span className="text-gray-200 font-medium">inteligencia artificial</span> y{' '}
                  <span className="text-gray-200 font-medium">participación ciudadana</span> para detectar, reportar y resolver
                  problemas ambientales en Villa El Salvador.
                </p>
              </Reveal>

              {/* CTA Buttons */}
              <Reveal delay={240}>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    className="bg-[#4ADE80] text-[#0B0F14] hover:bg-[#3AC76F] font-semibold h-12 px-7 text-sm rounded-xl shadow-lg shadow-[#4ADE80]/20 hover:shadow-[#4ADE80]/30 transition-all duration-300 hover:-translate-y-0.5"
                    onClick={() => navigate('/report')}
                  >
                    <Zap size={16} className="mr-2" /> Reportar ahora
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/[0.12] text-gray-300 hover:bg-white/[0.04] hover:border-white/[0.2] font-semibold h-12 px-7 text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                    onClick={() => navigate('/mapa')}
                  >
                    <MapPin size={16} className="mr-2" /> Ver mapa en vivo
                  </Button>
                </div>
              </Reveal>

              {/* Trust indicators */}
              <Reveal delay={320}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Shield size={13} className="text-[#4ADE80]" /> Datos protegidos
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Globe size={13} className="text-[#00D4FF]" /> 100% gratuito
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Heart size={13} className="text-[#EC4899]" /> Comunidad activa
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right - Phone Mockup */}
            <Reveal delay={200} className="hidden lg:flex justify-center items-center">
              <PhoneMockup />
            </Reveal>
          </div>

          {/* Stats Bar */}
          <Reveal delay={400}>
            <div className="mt-20 pt-12 border-t border-white/[0.06]">
              <div ref={heroStats.ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {[
                  { value: heroStats.val, suffix: '+', label: 'Reportes registrados', icon: BarChart3, color: '#4ADE80' },
                  { value: heroCitizens.val, suffix: '+', label: 'Ciudadanos activos', icon: Users, color: '#00D4FF' },
                  { value: heroResolved.val, suffix: '+', label: 'Incidencias resueltas', icon: CheckCircle2, color: '#FBBF24' },
                  { value: heroTrees.val, suffix: '+', label: 'Árboles plantados', icon: Leaf, color: '#22C55E' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="text-center group">
                      <div className="inline-flex w-12 h-12 rounded-xl items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ backgroundColor: `${stat.color}12` }}>
                        <Icon size={20} style={{ color: stat.color }} />
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold" style={{ color: stat.color }}>
                        {stat.value.toLocaleString()}{stat.suffix}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#1a1f2e]/50">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4ADE80] mb-3">Proceso simple</span>
              <h2 className="text-3xl sm:text-4xl font-bold">
                ¿Cómo funciona <span className="text-[#4ADE80]">EcoAlert VES</span>?
              </h2>
              <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm">Cuatro pasos sencillos para transformar tu comunidad</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-px bg-gradient-to-r from-[#4ADE80]/30 via-[#00D4FF]/30 to-[#A78BFA]/30" />

            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={i} delay={i * 120}>
                  <div className="relative text-center group">
                    {/* Step number */}
                    <div className="relative inline-flex mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} border border-white/[0.06] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-black/30`}>
                        <Icon size={24} style={{ color: step.color }} />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center bg-[#0B0F14] border border-white/[0.12] text-gray-400">
                        {step.num}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-[240px] mx-auto">{step.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          BENEFITS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00D4FF] mb-3">Funcionalidades</span>
              <h2 className="text-3xl sm:text-4xl font-bold">
                ¿Por qué utilizar <span className="text-[#00D4FF]">EcoAlert VES</span>?
              </h2>
              <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm">Todo lo que necesitas para ser agente de cambio ambiental</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="p-6 bg-[#1a1f2e] rounded-2xl border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1a1f2e]/80 transition-all duration-300 group cursor-default h-full">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${b.color}12` }}>
                      <Icon size={20} style={{ color: b.color }} />
                    </div>
                    <h3 className="font-bold text-white mb-2 text-[15px]">{b.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          IMPACT
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#1a1f2e]/50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[rgba(74,222,128,0.04)] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FBBF24] mb-3">Nuestro impacto</span>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Números que <span className="text-[#FBBF24]">inspiran</span>
              </h2>
              <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm">Cada dato representa una acción real de nuestra comunidad</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {IMPACT_METRICS.map((m, i) => (
              <Reveal key={i} delay={i * 60}>
                <ImpactCard metric={m} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          EDUCATION PREVIEW
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <div>
                <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A78BFA] mb-3">EcoAcademy</span>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Aprende a <span className="text-[#4ADE80]">proteger</span> el <span className="text-[#00D4FF]">planeta</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                  Cursos diseñados por expertos, quizzes interactivos y un sistema de insignias que hace que aprender sobre el medio ambiente sea adictivo.
                </p>

                {/* Mini stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                  {[
                    { icon: BookOpen, value: '9', label: 'Cursos', color: '#4ADE80' },
                    { icon: Award, value: '8', label: 'Insignias', color: '#FBBF24' },
                    { icon: Target, value: '30+', label: 'Lecciones', color: '#00D4FF' },
                    { icon: Flame, value: '5d', label: 'Racha max', color: '#F97316' },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Icon size={16} style={{ color: s.color }} />
                        <div>
                          <span className="text-lg font-bold text-white">{s.value}</span>
                          <span className="text-xs text-gray-500 ml-1">{s.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  className="bg-[#A78BFA] text-white hover:bg-[#9575ED] font-semibold h-11 px-6 text-sm rounded-xl shadow-lg shadow-[#A78BFA]/20 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={() => navigate('/education')}
                >
                  <Play size={15} className="mr-2" /> Explorar cursos
                </Button>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="space-y-4">
                {EDU_COURSES.map((course, i) => (
                  <div key={i} className="p-4 bg-[#1a1f2e] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group cursor-pointer" onClick={() => navigate('/education')}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: `${course.color}12` }}>
                        {course.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-white group-hover:text-[#4ADE80] transition-colors truncate">{course.title}</h4>
                          <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">{course.lessons} lecciones</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{course.level}</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
                          </div>
                          <span className="text-[10px] font-semibold" style={{ color: course.color }}>{course.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          NEWS PREVIEW
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#1a1f2e]/50">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F97316] mb-3">EcoNews</span>
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Noticias <span className="text-[#F97316]">ambientales</span>
                </h2>
              </div>
              <Button
                variant="outline"
                className="hidden sm:flex border-white/[0.12] text-gray-400 hover:text-white hover:border-white/[0.2] text-xs h-9 px-4 rounded-lg transition-all"
                onClick={() => navigate('/news')}
              >
                Ver todas <ArrowRight size={13} className="ml-1.5" />
              </Button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NEWS_PREVIEW.map((article, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-[#0B0F14] rounded-2xl border border-white/[0.06] overflow-hidden hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20 transition-all duration-300 group cursor-pointer" onClick={() => navigate('/news')}>
                  {/* Gradient header */}
                  <div className={`h-32 bg-gradient-to-br ${article.gradient} relative flex items-center justify-center`}>
                    <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-500">{article.emoji}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/40 text-white backdrop-blur-sm">{article.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-sm text-white group-hover:text-[#4ADE80] transition-colors line-clamp-2 mb-3 leading-snug">{article.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span>{article.date}</span>
                      <span className="flex items-center gap-1"><Clock size={9} />{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mt-8 text-center sm:hidden">
              <Button
                variant="outline"
                className="border-white/[0.12] text-gray-400 hover:text-white hover:border-white/[0.2] text-xs h-9 px-4 rounded-lg"
                onClick={() => navigate('/news')}
              >
                Ver todas las noticias <ArrowRight size={13} className="ml-1.5" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EC4899] mb-3">Testimonios</span>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Lo que dice nuestra <span className="text-[#EC4899]">comunidad</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="p-5 bg-[#1a1f2e] rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} size={13} className={si < t.rating ? 'text-[#FBBF24] fill-[#FBBF24]' : 'text-gray-700'} />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-sm text-gray-300 leading-relaxed flex-1 mb-4">"{t.text}"</p>
                  {/* Author */}
                  <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-[#0B0F14] text-[10px] font-bold flex-shrink-0`}>
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{t.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          ALLIES
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#1a1f2e]/50">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">Aliados estratégicos</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-300">
                Confianza de <span className="text-[#4ADE80]">organizaciones</span> que creen en el cambio
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ALLIES.map((ally, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="p-5 bg-[#0B0F14] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 text-center group cursor-default">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{ally.icon}</div>
                  <p className="text-xs font-semibold text-white mb-0.5 leading-tight">{ally.name}</p>
                  <p className="text-[10px] text-gray-500">{ally.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14] via-[#0d2818] to-[#0B0F14]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[rgba(74,222,128,0.06)] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-full px-4 py-2 mb-6">
              <Leaf size={14} className="text-[#4ADE80]" />
              <span className="text-xs text-[#4ADE80] font-medium">Únete al movimiento</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight mb-6">
              El futuro de Villa El Salvador
              <br />
              <span className="bg-gradient-to-r from-[#4ADE80] to-[#00D4FF] bg-clip-text text-transparent">
                se construye contigo
              </span>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Cada reporte cuenta. Cada ciudadano importa. Cada acción suma para construir un distrito más limpio, sostenible y digno de vivir.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-[#4ADE80] text-[#0B0F14] hover:bg-[#3AC76F] font-bold h-14 px-10 text-base rounded-xl shadow-xl shadow-[#4ADE80]/25 hover:shadow-[#4ADE80]/40 transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => navigate('/register')}
              >
                <Sparkles size={18} className="mr-2" /> Crear mi cuenta gratis
              </Button>
              <Button
                variant="outline"
                className="border-white/[0.15] text-gray-300 hover:bg-white/[0.05] hover:border-white/[0.25] font-bold h-14 px-10 text-base rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => navigate('/report')}
              >
                Hacer mi primer reporte <ArrowRight size={17} className="ml-2" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] bg-[#0B0F14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#00D4FF] flex items-center justify-center">
                  <Leaf size={18} className="text-[#0B0F14]" />
                </div>
                <span className="text-lg font-bold">EcoAlert VES</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
                Plataforma de inteligencia ambiental que conecta ciudadanos, tecnología y comunidad para proteger Villa El Salvador.
              </p>
              <div className="flex gap-3">
                {['🐦', '📸', '💬', '🔗'].map((icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-sm hover:bg-white/[0.08] hover:border-white/[0.12] transition-all">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Producto', items: ['Reportar', 'Mapa en vivo', 'Educación', 'Noticias', 'Ranking'] },
              { title: 'Comunidad', items: ['Campañas', 'Eventos', 'Voluntariado', 'Aliados'] },
              { title: 'Soporte', items: ['Centro de ayuda', 'Contacto', 'Privacidad', 'Términos'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.items.map((item, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-gray-500 hover:text-[#4ADE80] transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">&copy; 2026 EcoAlert VES. Todos los derechos reservados.</p>
            <p className="text-xs text-gray-600">Hecho con 💚 para Villa El Salvador</p>
          </div>
        </div>
      </footer>

      {/* Global keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

// ─── IMPACT CARD (uses its own count-up) ─────────────────────────────
function ImpactCard({ metric }: { metric: typeof IMPACT_METRICS[number] }) {
  const c = useCountUp(metric.value, 2000);
  return (
    <div ref={c.ref} className="p-5 bg-[#0B0F14] rounded-2xl border border-white/[0.06] text-center hover:border-white/[0.12] transition-all duration-300 group cursor-default">
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{metric.icon}</div>
      <p className="text-2xl sm:text-3xl font-bold" style={{ color: metric.color }}>
        {c.val.toLocaleString()}{metric.suffix}
      </p>
      <p className="text-[11px] text-gray-500 mt-1 leading-tight">{metric.label}</p>
    </div>
  );
}
