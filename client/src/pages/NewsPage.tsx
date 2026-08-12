import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft, Search, Calendar, User, Share2, Bookmark, Clock, Eye,
  TrendingUp, Flame, ArrowRight, Tag, Newspaper, X,
  MessageCircle, Leaf, Megaphone, CalendarDays, FlaskConical,
  Heart, MapPin, Users, Bell, Send, ThumbsUp, RefreshCw, Radio, FileText,
} from 'lucide-react';

// ─── INTERFACES ──────────────────────────────────────────────────────
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'medio_ambiente' | 'campana' | 'evento' | 'investigacion' | 'comunidad';
  tags: string[];
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  likes: number;
  featured?: boolean;
  trending?: boolean;
  breaking?: boolean;
  gradient: string;
  emoji: string;
  keyQuote?: string;
  relatedIds?: string[];
}

interface Campaign {
  id: string;
  title: string;
  emoji: string;
  description: string;
  progress: number;
  goal: string;
  daysLeft: number;
  color: string;
  volunteers: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  emoji: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  color: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
}

// ─── DATA ────────────────────────────────────────────────────────────
const NEWS_DATA: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Villa El Salvador Alcanza Meta de 5,000 Árboles Plantados en 2026',
    summary: 'La comunidad celebra un hito histórico en reforestación. Gracias al esfuerzo colectivo de más de 980 ciudadanos, Villa El Salvador superó su meta anual de reforestación.',
    content: 'Gracias a los esfuerzos colaborativos de ciudadanos y organizaciones ambientales, Villa El Salvador ha alcanzado la meta de 5,000 árboles plantados en lo que va del año 2026.\n\nEste logro representa un avance significativo en la lucha contra el cambio climático a nivel local. El programa, iniciado en enero, contó con la participación activa de escuelas, comunidades vecinales y organizaciones no gubernamentales.\n\nCada árbol plantado contribuye a la absorción de aproximadamente 22 kg de CO₂ anuales, lo que equivale a las emisiones de un automóvil por más de 11,000 kilómetros.\n\n"Este es solo el comienzo", declaró el alcalde durante la ceremonia de celebración en el Parque Ecológico. "Para 2027 queremos duplicar esta cifra y convertir a Villa El Salvador en el distrito más verde de Lima".\n\nEl programa incluye 15 especies nativas adaptadas al clima costeño, con árboles como el algarrobo, el molle, el huayacán y el faique, que no solo absorben CO₂ sino que también atraen aves polinizadoras y restauran el ecosistema local.\n\nLas escuelas participantes recibirán certificados de reconocimiento y los voluntarios más activos obtendrán incentivos ecológicos, incluyendo árboles para sus patios.',
    category: 'medio_ambiente',
    tags: ['Reforestación', 'Comunidad', 'CO₂', 'Árboles', 'Cambio Climático'],
    author: 'Equipo EcoAlert',
    authorRole: 'Equipo Editorial',
    date: '18 de Julio, 2026',
    readTime: '5 min',
    views: 3240,
    comments: 47,
    likes: 186,
    featured: true,
    trending: true,
    breaking: true,
    gradient: 'from-[#4ADE80] to-[#22C55E]',
    emoji: '🌳',
    keyQuote: '"Para 2027 queremos duplicar esta cifra y convertir a Villa El Salvador en el distrito más verde de Lima"',
    relatedIds: ['n3', 'n7', 'n8'],
  },
  {
    id: 'n2',
    title: 'Nuevo Estudio Científico Revela Mejora Significativa en la Calidad del Aire',
    summary: 'Investigadores de la Universidad Nacional documentan una reducción del 23% en contaminantes atmosféricos en la zona sur de Lima.',
    content: 'Un reciente estudio realizado por la Universidad Nacional Mayor de San Marcos demuestra que la calidad del aire en Villa El Salvador y distritos aledaños ha mejorado significativamente en los últimos 12 meses.\n\nLos investigadores atribuyen esta mejora a la combinación de nuevas políticas municipales de control de emisiones, el aumento de áreas verdes urbanas y la adopción masiva de transporte sostenible.\n\nEl estudio midió la concentración de PM2.5, PM10, NO₂ y O₃ en 15 puntos de monitoreo distribuidos estratégicamente por el distrito. Los resultados muestran una reducción promedio del 23% en contaminantes clave.\n\n"Los datos son alentadores", explicó el Dr. Carlos López, investigador principal. "Si mantenemos esta tendencia, podríamos alcanzar los estándares de calidad del aire de la OMS para 2028".\n\nEl estudio también identificó las zonas con mayor mejora: el corredor verde de la Av. Municipal y el parque industrial ecológico mostraron reducciones de hasta el 31%.',
    category: 'investigacion',
    tags: ['Calidad del Aire', 'Investigación', 'Contaminación', 'PM2.5'],
    author: 'Dr. Carlos López',
    authorRole: 'Investigador Principal',
    date: '17 de Julio, 2026',
    readTime: '8 min',
    views: 2810,
    comments: 32,
    likes: 142,
    featured: true,
    gradient: 'from-[#00D4FF] to-[#3B82F6]',
    emoji: '🌬️',
    keyQuote: '"Si mantenemos esta tendencia, podríamos alcanzar los estándares de calidad del aire de la OMS para 2028"',
    relatedIds: ['n9', 'n6', 'n4'],
  },
  {
    id: 'n3',
    title: 'Campaña "Limpia Tu Barrio" Llega a 20 Sectores Este Fin de Semana',
    summary: 'Invitamos a todos los ciudadanos a participar en nuestra gran campaña de limpieza comunitaria con más de 500 voluntarios registrados.',
    content: 'Este sábado 19 y domingo 20 de julio, invitamos a todos los ciudadanos a participar en nuestra gran campaña de limpieza comunitaria "Limpia Tu Barrio".\n\nLa acción abarcará 20 sectores simultáneamente con más de 500 voluntarios ya registrados. Cada punto de reunión contará con materiales de limpieza, agua potable y supervisión técnica.\n\nLos sectores seleccionados son aquellos que presentan mayor acumulación de residuos según los reportes ciudadanos de EcoAlert VES. Se priorizarán zonas cercanas a ríos, parques y áreas escolares.\n\nCada voluntario recibirá un kit de limpieza que incluye guantes reutilizables, bolsas de colores para separación de residuos, una camiseta conmemorativa y refrigerios saludables.\n\nAl finalizar, se realizará una ceremonia de cierre donde se anunciarán los resultados y se premiará al sector con mayor participación.',
    category: 'campana',
    tags: ['Campaña', 'Limpieza', 'Voluntariado', 'Comunidad'],
    author: 'María García',
    authorRole: 'Coordinadora de Eventos',
    date: '16 de Julio, 2026',
    readTime: '3 min',
    views: 1890,
    comments: 65,
    likes: 98,
    trending: true,
    gradient: 'from-[#F97316] to-[#EF4444]',
    emoji: '🧹',
    relatedIds: ['n1', 'n7', 'n8'],
  },
  {
    id: 'n4',
    title: 'Se Abren 15 Nuevos Puntos de Reciclaje Inteligente en Villa El Salvador',
    summary: 'La municipalidad instala contenedores inteligentes con sensores que alertan cuando están llenos, optimizando la recolección.',
    content: 'Para facilitar y modernizar el reciclaje, la municipalidad de Villa El Salvador ha instalado 15 nuevos puntos de reciclaje inteligente en diferentes sectores.\n\nEstos contenedores cuentan con sensores IoT que miden el nivel de llenado en tiempo real y envían alertas a los equipos de recolección cuando están al 80% de capacidad.\n\nEsta tecnología reduce los costos de operación en un 35% y mejora la eficiencia del servicio de recolección. Los ciudadanos también pueden consultar la disponibilidad de cada contenedor desde la app de EcoAlert.\n\nLos 15 puntos estratégicamente ubicados incluyen: 5 en plazas principales, 4 en cercanías de escuelas, 3 en mercados, 2 en parques y 1 en la zona industrial.\n\nCada contenedor cuenta con 4 compartimentos: orgánico, plástico, papel/cartón y vidrio, con señalización visual e instructivos de clasificación.',
    category: 'campana',
    tags: ['Reciclaje', 'Tecnología', 'IoT', 'Municipalidad', 'Innovación'],
    author: 'Andrea Torres',
    authorRole: 'Periodista Ambiental',
    date: '15 de Julio, 2026',
    readTime: '4 min',
    views: 1560,
    comments: 28,
    likes: 87,
    gradient: 'from-[#8B5CF6] to-[#A78BFA]',
    emoji: '♻️',
    relatedIds: ['n1', 'n2', 'n9'],
  },
  {
    id: 'n5',
    title: 'Taller Gratuito: Energías Renovables para el Hogar',
    summary: 'Aprende paso a paso cómo implementar paneles solares y sistemas de energía eólica en tu vivienda con expertos internacionales.',
    content: 'Te invitamos a nuestro taller gratuito donde aprenderás sobre energías renovables y cómo implementarlas en tu hogar.\n\nEl taller será impartido por ingenieros especializados en energías limpias y contará con una parte teórica y una práctica donde los asistentes podrán ensamblar un pequeño panel solar.\n\nEl evento es gratuito y se realizará en el Centro Comunal de Villa El Salvador. Se proporcionarán todos los materiales y herramientas necesarios.\n\nTemas a cubrir: funcionamiento de paneles solares fotovoltaicos, cálculo de consumo energético del hogar, incentivarios municipales disponibles, y ROI de inversiones en energía solar.\n\nLos asistentes recibirán un certificado de participación y una guía digital con todos los recursos para implementar energías renovables en su vivienda.',
    category: 'evento',
    tags: ['Taller', 'Energía Solar', 'Energías Renovables', 'Gratis'],
    author: 'Equipo EcoAlert',
    authorRole: 'Equipo Editorial',
    date: '14 de Julio, 2026',
    readTime: '6 min',
    views: 2340,
    comments: 41,
    likes: 156,
    trending: true,
    gradient: 'from-[#FBBF24] to-[#F59E0B]',
    emoji: '⚡',
    relatedIds: ['n7', 'n5', 'n2'],
  },
  {
    id: 'n6',
    title: 'Impacto Devastador de los Microplásticos en Ecosistemas Fluviales',
    summary: 'Científicos peruanos descubren concentraciones récord de microplásticos en el río Rímac, afectando fauna y calidad del agua.',
    content: 'Un nuevo estudio liderado por investigadores de la Universidad Peruana Cayetano Heredia ha revelado concentraciones alarmantes de microplásticos en el río Rímac.\n\nLas muestras tomadas en 12 puntos del río mostraron un promedio de 450 partículas por litro, superando los estándares internacionales en un 180%.\n\nLos microplásticos fueron encontrados en el tejido de peces, crustáceos y hasta en el agua potable tratada de la zona, representando un riesgo serio para la salud pública.\n\n"Esto es una alerta urgente", advirtió la Dra. Elena Rodríguez. "Si no actuamos ahora, en 10 años la contaminación por microplásticos será irreversible en nuestros ecosistemas fluviales".\n\nLas principales fuentes identificadas son los residuos plásticos mal gestionados, los desechos textiles de lavado doméstico y la degradación de envases industriales.',
    category: 'investigacion',
    tags: ['Microplásticos', 'Agua', 'Investigación', 'Fauna', 'Río Rímac'],
    author: 'Dra. Elena Rodríguez',
    authorRole: 'Directora de Investigación',
    date: '13 de Julio, 2026',
    readTime: '10 min',
    views: 4120,
    comments: 89,
    likes: 234,
    featured: true,
    trending: true,
    gradient: 'from-[#EC4899] to-[#F472B6]',
    emoji: '🐟',
    keyQuote: '"Si no actuamos ahora, en 10 años la contaminación por microplásticos será irreversible"',
    relatedIds: ['n2', 'n9', 'n4'],
  },
  {
    id: 'n7',
    title: 'Festival de la Biodiversidad: Celebrando la Vida en Villa El Salvador',
    summary: 'El festival anual reunió a más de 3,000 personas para celebrar la flora y fauna local con actividades educativas y culturales.',
    content: 'El Festival de la Biodiversidad de Villa El Salvador celebró su quinta edición con la asistencia récord de más de 3,000 personas.\n\nEl evento incluyó muestras de fauna local, talleres de identificación de plantas, exposiciones fotográficas, presentaciones culturales y actividades interactivas para niños.\n\nLos asistentes pudieron conocer más de 50 especies nativas de la zona y comprometerse con acciones concretas de conservación.\n\nEste año, el festival contó con la participación de 12 organizaciones ambientales, 8 escuelas locales y 5 artistas comunitarios que presentaron obras inspiradas en la naturaleza.\n\nEl punto más popular fue el "Santuario de Especies", donde niños y adultos pudieron observar de cerca mariposas, aves y reptiles rescatados que serán reintegrados a su hábitat natural.',
    category: 'evento',
    tags: ['Festival', 'Biodiversidad', 'Cultura', 'Comunidad', 'Naturaleza'],
    author: 'Roberto Sánchez',
    authorRole: 'Coordinador Cultural',
    date: '12 de Julio, 2026',
    readTime: '5 min',
    views: 1780,
    comments: 33,
    likes: 112,
    gradient: 'from-[#10B981] to-[#34D399]',
    emoji: '🦋',
    relatedIds: ['n1', 'n3', 'n5'],
  },
  {
    id: 'n8',
    title: 'Iniciativa Comunitaria: Huertos Verticales en Escuelas Públicas',
    summary: '10 escuelas públicas implementan huertos verticales como parte del programa de educación ambiental y seguridad alimentaria.',
    content: 'El programa piloto de huertos verticales ha sido implementado exitosamente en 10 escuelas públicas de Villa El Salvador.\n\nCada escuela recibió 5 módulos de cultivo vertical, semillas orgánicas y capacitación para profesores y estudiantes.\n\nEl programa no solo promueve la educación ambiental sino que también contribuye a la seguridad alimentaria de las comunidades escolares.\n\nEn los primeros 3 meses, las escuelas han producido más de 200 kg de vegetales frescos, incluyendo lechuga, espinaca, tomates cherry y hierbas aromáticas.\n\nLos estudiantes aprenden sobre ciclos de nutrientes, compostaje, manejo responsable del agua y nutrición, integrando la ciencia con la práctica agrícola sostenible.',
    category: 'comunidad',
    tags: ['Huertos', 'Escuelas', 'Educación', 'Alimentación', 'Agricultura'],
    author: 'Lucía Fernández',
    authorRole: 'Coordinadora Educativa',
    date: '11 de Julio, 2026',
    readTime: '4 min',
    views: 1230,
    comments: 22,
    likes: 78,
    gradient: 'from-[#4ADE80] to-[#22D3EE]',
    emoji: '🌿',
    relatedIds: ['n1', 'n3', 'n7'],
  },
  {
    id: 'n9',
    title: 'Alerta: Contaminación por Residuos Ilegales en la Zona Industrial',
    summary: 'Se detectaron más de 2 toneladas de residuos industriales ilegales cerca de un parque ecológico. Las autoridades ya iniciaron investigación.',
    content: 'Alerta ambiental en Villa El Salvador: más de 2 toneladas de residuos industriales fueron encontrados abandonados cerca del Parque Ecológico del Distrito.\n\nLos residuos incluyen compuestos químicos peligrosos que representan un riesgo grave para la salud pública y el ecosistema local.\n\nLa Fiscalía Ambiental ya inició una investigación para identificar a los responsables. Se estima que los residuos fueron depositados durante la madrugada del miércoles.\n\nSegún los peritos, los materiales incluyen aceites usados, solventes industriales y residuos metálicos que requieren un tratamiento especial.\n\nEl alcalde anunció la activación del protocolo de emergencia ambiental y la movilización de equipos de descontaminación. Se ofrece una recompensa de S/. 10,000 por información que conduzca a los responsables.',
    category: 'medio_ambiente',
    tags: ['Contaminación', 'Residuos', 'Alerta', 'Zona Industrial', 'Emergencia'],
    author: 'Equipo EcoAlert',
    authorRole: 'Alertas Ambientales',
    date: '10 de Julio, 2026',
    readTime: '4 min',
    views: 5680,
    comments: 112,
    likes: 312,
    trending: true,
    breaking: true,
    gradient: 'from-[#EF4444] to-[#DC2626]',
    emoji: '🚨',
    keyQuote: 'Se ofrece una recompensa de S/. 10,000 por información que conduzca a los responsables.',
    relatedIds: ['n6', 'n2', 'n4'],
  },
];

const CAMPAIGNS: Campaign[] = [
  { id: 'cp1', title: 'Río Limpio 2026', emoji: '🌊', description: 'Meta: 50 toneladas de basura retiradas del río', progress: 72, goal: '50 toneladas', daysLeft: 45, color: '#00D4FF', volunteers: 320 },
  { id: 'cp2', title: 'Cero Plásticos VES', emoji: '🚫', description: 'Eliminar plásticos de un solo uso en comercios', progress: 45, goal: '200 comercios', daysLeft: 90, color: '#EC4899', volunteers: 180 },
  { id: 'cp3', title: 'Arboleda Urbana', emoji: '🌳', description: 'Plantar 10,000 árboles nativos en zonas verdes', progress: 58, goal: '10,000 árboles', daysLeft: 120, color: '#4ADE80', volunteers: 450 },
];

const UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: 'e1', title: 'Taller de Compostaje Urbano', emoji: '🌱', date: '22 Jul', time: '10:00 AM', location: 'Centro Comunal VES', attendees: 45, category: 'Taller', color: '#4ADE80' },
  { id: 'e2', title: 'Caminata Ecológica "Senderos Verdes"', emoji: '🥾', date: '25 Jul', time: '7:00 AM', location: 'Parque Ecológico', attendees: 120, category: 'Evento', color: '#00D4FF' },
  { id: 'e3', title: 'Feria de Productos Orgánicos', emoji: '🥬', date: '27 Jul', time: '9:00 AM', location: 'Plaza Municipal', attendees: 200, category: 'Feria', color: '#FBBF24' },
  { id: 'e4', title: 'Charla: Cambio Climático Local', emoji: '🎤', date: '29 Jul', time: '6:00 PM', location: 'Biblioteca Municipal', attendees: 60, category: 'Charla', color: '#A78BFA' },
];

const SAMPLE_COMMENTS: Comment[] = [
  { id: 'cm1', author: 'Pedro M.', text: 'Excelente iniciativa! Ya me inscribí como voluntario para la campaña del sábado. 💚', date: 'Hace 2h', likes: 12 },
  { id: 'cm2', author: 'Rosa L.', text: 'Mi familia y yo participamos en la reforestación anterior. ¡Recomendadísimo!', date: 'Hace 4h', likes: 8 },
  { id: 'cm3', author: 'Carlos A.', text: '¿Hay transporte disponible desde San Juan de Miraflores? Me gustaría participar.', date: 'Hace 5h', likes: 3 },
  { id: 'cm4', author: 'Ana V.', text: 'Llevé a mis hijos al festival y fue una experiencia increíble. ¡Gracias EcoAlert por organizar!', date: 'Hace 8h', likes: 15 },
];

const CATEGORIES = [
  { id: null, label: 'Todas', icon: Newspaper, color: '#4ADE80', count: NEWS_DATA.length },
  { id: 'medio_ambiente', label: 'Medio Ambiente', icon: Leaf, color: '#4ADE80', count: NEWS_DATA.filter(n => n.category === 'medio_ambiente').length },
  { id: 'campana', label: 'Campañas', icon: Megaphone, color: '#00D4FF', count: NEWS_DATA.filter(n => n.category === 'campana').length },
  { id: 'evento', label: 'Eventos', icon: CalendarDays, color: '#FBBF24', count: NEWS_DATA.filter(n => n.category === 'evento').length },
  { id: 'investigacion', label: 'Investigación', icon: FlaskConical, color: '#A78BFA', count: NEWS_DATA.filter(n => n.category === 'investigacion').length },
  { id: 'comunidad', label: 'Comunidad', icon: User, color: '#F97316', count: NEWS_DATA.filter(n => n.category === 'comunidad').length },
];

const ALL_TAGS = Array.from(new Set(NEWS_DATA.flatMap((n) => n.tags)));

const BREAKING_TICKER = [
  '🚨 ALERTA: Residuos industriales ilegales detectados cerca del Parque Ecológico',
  '🌳 LOGRO: 5,000 árboles plantados — Villa El Salvador supera su meta anual',
  '📢 CAMPAÑA: "Limpia Tu Barrio" llega a 20 sectores este fin de semana',
  '🔬 INVESTIGACIÓN: Calidad del aire mejora un 23% en la zona sur',
];

// ─── HELPERS ─────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  medio_ambiente: 'Medio Ambiente', campana: 'Campañas', evento: 'Eventos',
  investigacion: 'Investigación', comunidad: 'Comunidad',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  medio_ambiente: '🌍', campana: '📢', evento: '📅', investigacion: '🔬', comunidad: '👥',
};

const formatViews = (views: number) => {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
  return views.toString();
};

const getCategoryStyle = (category: string) => {
  return CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
};

// ─── COMPONENTS ──────────────────────────────────────────────────────

function BreakingTicker() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % BREAKING_TICKER.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#EF4444]/10 via-[#DC2626]/5 to-[#EF4444]/10 border-y border-[#EF4444]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-3">
        <span className="flex-shrink-0 px-2 py-0.5 bg-[#EF4444] text-white text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
          <Radio size={10} className="animate-pulse" /> En vivo
        </span>
        <div className="overflow-hidden relative flex-1 min-h-[20px]">
          {BREAKING_TICKER.map((item, i) => (
            <p
              key={i}
              className={`absolute inset-0 text-xs text-gray-300 whitespace-nowrap transition-all duration-500 ${
                i === current ? 'translate-y-0 opacity-100' : i < current ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
              }`}
            >
              {item}
            </p>
          ))}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {BREAKING_TICKER.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-[#EF4444] w-4' : 'bg-gray-600'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsBar() {
  const totalViews = NEWS_DATA.reduce((s, n) => s + n.views, 0);
  const totalComments = NEWS_DATA.reduce((s, n) => s + n.comments, 0);
  const totalLikes = NEWS_DATA.reduce((s, n) => s + n.likes, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Artículos', value: NEWS_DATA.length, icon: Newspaper, color: '#4ADE80' },
        { label: 'Lecturas', value: formatViews(totalViews), icon: Eye, color: '#00D4FF' },
        { label: 'Comentarios', value: totalComments.toLocaleString(), icon: MessageCircle, color: '#FBBF24' },
        { label: 'Me Gusta', value: totalLikes.toLocaleString(), icon: Heart, color: '#EC4899' },
      ].map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="flex items-center gap-3 p-3 bg-[#1a1f2e] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 cursor-default">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
              <Icon size={16} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-gray-500">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HeroFeatured({ article, onClick }: { article: NewsArticle; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-br from-[#0d2818] via-[#0B0F14] to-[#0a1628] border border-white/[0.06] hover:border-[rgba(74,222,128,0.3)] hover:shadow-xl hover:shadow-[#4ADE80]/5 transition-all duration-300"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-[0.08] group-hover:opacity-[0.14] transition-opacity`} />
      <div className="absolute top-0 right-0 w-72 h-72 bg-[rgba(74,222,128,0.04)] rounded-full blur-3xl" />
      <div className="relative p-6 sm:p-8 lg:grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {article.breaking && (
              <span className="px-2.5 py-1 bg-[#EF4444] text-white text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <Radio size={10} className="animate-pulse" /> Urgente
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ backgroundColor: `${getCategoryStyle(article.category).color}20`, color: getCategoryStyle(article.category).color }}>
              {CATEGORY_EMOJIS[article.category]} {CATEGORY_LABELS[article.category]}
            </span>
            {article.trending && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#F97316]/20 text-[#F97316] flex items-center gap-1">
                <TrendingUp size={10} /> Tendencia
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight group-hover:text-[#4ADE80] transition-colors">
            {article.title}
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{article.summary}</p>
          {article.keyQuote && (
            <div className="pl-4 border-l-2 border-[#4ADE80]/40 text-sm text-[#4ADE80]/80 italic">
              {article.keyQuote}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4ADE80] to-[#00D4FF] flex items-center justify-center text-[#0B0F14] font-bold text-[10px]">{article.author.charAt(0)}</div>
              {article.author}
            </span>
            <span className="flex items-center gap-1"><Calendar size={12} />{article.date}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{article.readTime}</span>
            <span className="flex items-center gap-1"><Eye size={12} />{formatViews(article.views)} vistas</span>
            <span className="flex items-center gap-1"><Heart size={12} />{article.likes} likes</span>
          </div>
          <Button className="bg-[#4ADE80] text-[#0B0F14] hover:bg-[#3AC76F] font-semibold text-sm mt-2">
            Leer artículo completo <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <div className={`w-48 h-48 rounded-2xl bg-gradient-to-br ${article.gradient} flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 shadow-2xl`}>
            <span className="text-8xl drop-shadow-lg">{article.emoji}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsCard({ article, onClick }: { article: NewsArticle; onClick: () => void }) {
  return (
    <Card
      className="overflow-hidden bg-[#1a1f2e] border-[rgba(74,222,128,0.12)] hover:border-[rgba(74,222,128,0.35)] hover:shadow-lg hover:shadow-[#4ADE80]/5 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row"
      onClick={onClick}
    >
      <div className={`w-full sm:w-48 h-36 sm:h-auto bg-gradient-to-br ${article.gradient} flex items-center justify-center flex-shrink-0 relative overflow-hidden`}>
        <span className="text-5xl opacity-70 group-hover:scale-110 transition-transform duration-500">{article.emoji}</span>
        {article.trending && (
          <div className="absolute top-2 right-2"><TrendingUp size={14} className="text-white drop-shadow" /></div>
        )}
        {article.breaking && (
          <div className="absolute top-2 left-2"><span className="px-1.5 py-0.5 bg-[#EF4444] text-white text-[8px] font-bold rounded uppercase">Nuevo</span></div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: `${getCategoryStyle(article.category).color}20`, color: getCategoryStyle(article.category).color }}>
            {CATEGORY_EMOJIS[article.category]} {CATEGORY_LABELS[article.category]}
          </span>
          <span className="text-[10px] text-gray-500">{article.date}</span>
          <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock size={9} />{article.readTime}</span>
        </div>
        <h3 className="font-semibold text-white mb-1 group-hover:text-[#4ADE80] transition-colors line-clamp-2 text-sm">{article.title}</h3>
        <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-1">{article.summary}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1"><User size={10} />{article.author}</span>
            <span className="flex items-center gap-1"><Eye size={10} />{formatViews(article.views)}</span>
            <span className="flex items-center gap-1"><Heart size={10} />{article.likes}</span>
            <span className="flex items-center gap-1"><MessageCircle size={10} />{article.comments}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function NewsDetail({ article, onBack, allNews, onSelect }: { article: NewsArticle; onBack: () => void; allNews: NewsArticle[]; onSelect: (a: NewsArticle) => void }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes);
  const [newComment, setNewComment] = useState('');
  const [showShareToast, setShowShareToast] = useState(false);

  const related = article.relatedIds
    ? allNews.filter(n => article.relatedIds!.includes(n.id))
    : allNews.filter(n => n.id !== article.id && n.category === article.category).slice(0, 3);

  const paragraphs = article.content.split('\n\n');

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* Sticky Header */}
      <header className="sticky top-16 z-40 bg-[#0B0F14]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-[rgba(74,222,128,0.1)] rounded-lg transition-colors"><ChevronLeft size={20} /></button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">{article.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setBookmarked(!bookmarked)} className={`p-2 rounded-lg transition-colors ${bookmarked ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-500/10 text-gray-400 hover:text-white'}`}>
              <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-lg bg-gray-500/10 text-gray-400 hover:text-white transition-colors relative">
              <Share2 size={16} />
              {showShareToast && (
                <span className="absolute -top-8 right-0 px-2 py-1 bg-[#4ADE80] text-[#0B0F14] text-[10px] font-semibold rounded whitespace-nowrap">Enlace copiado!</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Image */}
        <div className={`group relative h-64 sm:h-80 rounded-2xl bg-gradient-to-br ${article.gradient} flex items-center justify-center overflow-hidden`}>
          <span className="text-[100px] sm:text-[140px] opacity-30 group-hover:opacity-40 transition-opacity">{article.emoji}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/40 text-white backdrop-blur-sm" style={{ border: `1px solid ${getCategoryStyle(article.category).color}40` }}>
              {CATEGORY_EMOJIS[article.category]} {CATEGORY_LABELS[article.category]}
            </span>
            {article.breaking && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#EF4444]/80 text-white backdrop-blur-sm flex items-center gap-1">
                <Radio size={10} className="animate-pulse" /> Noticia de última hora
              </span>
            )}
            {article.trending && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#F97316]/80 text-white backdrop-blur-sm flex items-center gap-1">
                <TrendingUp size={10} /> En tendencia
              </span>
            )}
          </div>
        </div>

        {/* Article Header */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar size={12} />{article.date}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{article.readTime} de lectura</span>
            <span className="flex items-center gap-1"><Eye size={12} />{article.views.toLocaleString()} vistas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{article.title}</h1>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">{article.summary}</p>

          {/* Author */}
          <div className="flex items-center gap-4 p-4 bg-[#1a1f2e] rounded-xl border border-white/[0.06]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4ADE80] to-[#00D4FF] flex items-center justify-center text-[#0B0F14] font-bold text-sm flex-shrink-0">
              {article.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{article.author}</p>
              <p className="text-xs text-gray-400">{article.authorRole}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${liked ? 'bg-[#EC4899]/15 text-[#EC4899]' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                <Heart size={14} fill={liked ? 'currentColor' : 'none'} /> {likeCount}
              </button>
              <button onClick={() => setBookmarked(!bookmarked)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${bookmarked ? 'bg-[#4ADE80]/15 text-[#4ADE80]' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                <Bookmark size={14} fill={bookmarked ? 'currentColor' : 'none'} /> Guardar
              </button>
              <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all">
                <Share2 size={14} /> Compartir
              </button>
            </div>
          </div>
        </div>

        {/* Key Quote */}
        {article.keyQuote && (
          <div className="relative p-6 bg-gradient-to-r from-[rgba(74,222,128,0.06)] to-transparent rounded-xl border-l-4 border-[#4ADE80]">
            <div className="absolute top-3 right-4 text-4xl text-[#4ADE80]/10 font-serif">"</div>
            <p className="text-base text-[#4ADE80]/90 italic font-medium leading-relaxed relative">{article.keyQuote}</p>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><FileIcon /> Detalles del artículo</h2>
          <div className="bg-[#1a1f2e] rounded-xl p-6 border border-white/[0.06] space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-gray-300 leading-relaxed">{p}</p>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-sm font-bold mb-3 text-gray-400 uppercase tracking-wider">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 bg-[#1a1f2e] border border-white/[0.06] rounded-full text-xs text-gray-300 hover:border-[rgba(74,222,128,0.3)] hover:text-[#4ADE80] transition-all cursor-pointer flex items-center gap-1.5">
                <Tag size={10} />{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Eye, label: 'Vistas', value: article.views.toLocaleString(), color: '#00D4FF' },
            { icon: Heart, label: 'Me Gusta', value: likeCount.toLocaleString(), color: '#EC4899' },
            { icon: MessageCircle, label: 'Comentarios', value: article.comments.toString(), color: '#FBBF24' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center p-3 bg-[#1a1f2e] rounded-xl border border-white/[0.06]">
                <Icon size={18} className="mx-auto mb-1" style={{ color: stat.color }} />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><MessageCircle size={18} className="text-[#FBBF24]" /> Comentarios ({SAMPLE_COMMENTS.length})</h3>
          <div className="space-y-3">
            {SAMPLE_COMMENTS.map((comment) => (
              <div key={comment.id} className="p-4 bg-[#1a1f2e] rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4ADE80]/30 to-[#00D4FF]/30 flex items-center justify-center text-xs font-bold">{comment.author.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{comment.author}</p>
                    <p className="text-[10px] text-gray-500">{comment.date}</p>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-[#4ADE80] transition-colors">
                    <ThumbsUp size={12} /> {comment.likes}
                  </button>
                </div>
                <p className="text-sm text-gray-300">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4ADE80] to-[#00D4FF] flex items-center justify-center text-[#0B0F14] text-xs font-bold flex-shrink-0">Tú</div>
            <div className="flex-1 relative">
              <Input
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-[#1a1f2e] border-white/[0.08] text-sm pr-10 focus:border-[#4ADE80]/50 focus:ring-1 focus:ring-[#4ADE80]/20 focus:outline-none transition-colors"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4ADE80] hover:text-[#3AC76F] transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Newspaper size={18} className="text-[#00D4FF]" /> Artículos Relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Card key={r.id} className="p-4 bg-[#1a1f2e] border-white/[0.06] hover:border-[rgba(74,222,128,0.3)] hover:shadow-lg hover:shadow-[#4ADE80]/5 transition-all duration-300 cursor-pointer group" onClick={() => onSelect(r)}>
                  <div className={`w-full h-20 rounded-lg bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-3 opacity-70 group-hover:opacity-100 transition-opacity`}>
                    <span className="text-3xl">{r.emoji}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-[#4ADE80] transition-colors line-clamp-2 mb-1">{r.title}</h4>
                  <p className="text-[10px] text-gray-500 flex items-center gap-2">
                    <span className="flex items-center gap-1"><Clock size={9} />{r.readTime}</span>
                    <span className="flex items-center gap-1"><Eye size={9} />{formatViews(r.views)}</span>
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center pt-4 border-t border-white/[0.06]">
          <Button onClick={onBack} variant="outline" className="border-[rgba(74,222,128,0.2)] text-gray-400 hover:text-white">
            <ChevronLeft size={16} className="mr-2" /> Volver a noticias
          </Button>
        </div>
      </article>
    </div>
  );
}

function FileIcon() {
  return <FileText size={18} className="text-[#4ADE80]" />;
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <div className="p-4 bg-[#0B0F14] rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:shadow-sm transition-all duration-300">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{campaign.emoji}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">{campaign.title}</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">{campaign.description}</p>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-gray-500">{campaign.progress}% completado</span>
          <span className="text-gray-500">{campaign.goal}</span>
        </div>
        <div className="h-1.5 bg-[#1a1f2e] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${campaign.progress}%`, backgroundColor: campaign.color }} />
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><Clock size={10} />{campaign.daysLeft} días restantes</span>
        <span className="flex items-center gap-1"><Users size={10} />{campaign.volunteers} voluntarios</span>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: UpcomingEvent }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#0B0F14] rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:shadow-sm transition-all duration-300 group cursor-pointer">
      <div className="w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0" style={{ backgroundColor: `${event.color}15` }}>
        <span className="text-[10px] font-bold" style={{ color: event.color }}>{event.date.split(' ')[0]}</span>
        <span className="text-[10px] text-gray-400">{event.date.split(' ')[1]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white group-hover:text-[#4ADE80] transition-colors truncate">{event.emoji} {event.title}</p>
        <p className="text-[10px] text-gray-500 flex items-center gap-2">
          <Clock size={9} />{event.time}
          <MapPin size={9} />{event.location}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <span className="text-[10px] text-gray-500 flex items-center gap-1"><Users size={9} />{event.attendees}</span>
      </div>
    </div>
  );
}

function Sidebar({ searchQuery, setSearchQuery, allNews, onSelectArticle }: {
  searchQuery: string; setSearchQuery: (q: string) => void;
  allNews: NewsArticle[]; onSelectArticle: (a: NewsArticle) => void;
}) {
  const trendingNews = allNews.filter(n => n.trending).sort((a, b) => b.views - a.views);
  const popularTags = ALL_TAGS.slice(0, 12);
  const [emailSub, setEmailSub] = useState('');

  return (
    <aside className="space-y-5">
      {/* Campaigns */}
      <Card className="p-4 bg-[#1a1f2e] border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone size={16} className="text-[#00D4FF]" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Campañas Activas</h3>
        </div>
        <div className="space-y-3">
          {CAMPAIGNS.map(c => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card className="p-4 bg-[#1a1f2e] border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={16} className="text-[#FBBF24]" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Próximos Eventos</h3>
        </div>
        <div className="space-y-2">
          {UPCOMING_EVENTS.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </Card>

      {/* Trending */}
      <Card className="p-4 bg-[#1a1f2e] border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-[#F97316]" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Tendencias</h3>
        </div>
        <div className="space-y-2">
          {trendingNews.slice(0, 5).map((article, idx) => (
            <button
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors group"
            >
              <span className="text-base font-bold text-gray-600 w-5 flex-shrink-0 mt-0.5">{idx + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white group-hover:text-[#4ADE80] transition-colors line-clamp-2 leading-tight">{article.title}</p>
                <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-0.5"><Eye size={8} />{formatViews(article.views)}</span>
                  <span className="flex items-center gap-0.5"><Clock size={8} />{article.readTime}</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Popular Tags */}
      <Card className="p-4 bg-[#1a1f2e] border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <Tag size={16} className="text-[#4ADE80]" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Temas Populares</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-1 bg-[#0B0F14] border border-white/[0.06] rounded-full text-[10px] text-gray-400 hover:border-[rgba(74,222,128,0.35)] hover:text-[#4ADE80] transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </Card>

      {/* Newsletter */}
      <Card className="p-5 bg-gradient-to-br from-[rgba(74,222,128,0.1)] to-[rgba(0,212,255,0.06)] border-[rgba(74,222,128,0.2)]">
        <div className="text-center">
          <div className="text-3xl mb-2">📬</div>
          <h3 className="font-bold text-sm mb-1">Boletín EcoAlert</h3>
          <p className="text-[10px] text-gray-400 mb-3">Recibe las mejores noticias ambientales directamente en tu correo.</p>
          <Input
            placeholder="tucorreo@email.com"
            value={emailSub}
            onChange={(e) => setEmailSub(e.target.value)}
            className="bg-[#0B0F14] border-[rgba(74,222,128,0.2)] text-xs mb-2 h-9 focus:border-[#4ADE80]/50 focus:ring-1 focus:ring-[#4ADE80]/20 focus:outline-none transition-colors"
          />
          <Button className="w-full bg-[#4ADE80] text-[#0B0F14] hover:bg-[#3AC76F] text-xs font-semibold h-9">
            <Send size={12} className="mr-1.5" /> Suscribirme
          </Button>
        </div>
      </Card>
    </aside>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────
export default function NewsPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [sortBy, setSortBy] = useState<'recientes' | 'populares' | 'tendencia'>('recientes');

  const filteredNews = useMemo(() => {
    let articles = NEWS_DATA.filter((article) => {
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'populares') articles = [...articles].sort((a, b) => b.views - a.views);
    else if (sortBy === 'tendencia') articles = [...articles].sort((a, b) => b.likes - a.likes);
    else articles = [...articles].sort((a, b) => {
      const dateA = parseInt(a.date.match(/\d+/)?.[0] || '0');
      const dateB = parseInt(b.date.match(/\d+/)?.[0] || '0');
      return dateB - dateA;
    });

    return articles;
  }, [selectedCategory, searchQuery, sortBy]);

  const featuredArticles = NEWS_DATA.filter(n => n.featured);

  if (selectedNews) {
    return <NewsDetail article={selectedNews} onBack={() => setSelectedNews(null)} allNews={NEWS_DATA} onSelect={setSelectedNews} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* Header */}
      <header className="sticky top-16 z-40 bg-[#0B0F14]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button onClick={() => setLocation('/')} className="p-2 hover:bg-[rgba(74,222,128,0.1)] rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#00D4FF] flex items-center justify-center">
              <Newspaper size={18} className="text-[#0B0F14]" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold leading-tight">EcoNews</h1>
              <p className="text-[10px] text-gray-500">Portal de información ambiental</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1f2e] rounded-lg border border-white/[0.06] text-[10px] text-gray-400">
              <Bell size={12} className="text-[#FBBF24]" /> 3 alertas nuevas
            </span>
          </div>
        </div>
      </header>

      {/* Breaking News Ticker */}
      <BreakingTicker />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <StatsBar />

        {/* Hero Featured */}
        {featuredArticles.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Flame size={16} className="text-[#F97316]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Historias Destacadas</h2>
            </div>
            <div className="space-y-4">
              {featuredArticles.slice(0, 2).map(article => (
                <HeroFeatured key={article.id} article={article} onClick={() => setSelectedNews(article)} />
              ))}
            </div>
          </section>
        )}

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar noticias, temas, etiquetas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-[#1a1f2e] border-white/[0.08] h-11 text-sm focus:border-[#4ADE80]/50 focus:ring-1 focus:ring-[#4ADE80]/20 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1.5 items-center flex-wrap">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id ?? 'all'}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'text-[#0B0F14] font-semibold'
                        : 'bg-[#1a1f2e] border border-white/[0.06] text-gray-400 hover:text-white hover:border-white/[0.12]'
                    }`}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color } : undefined}
                  >
                    <Icon size={12} />
                    {cat.label}
                    <span className={`text-[9px] px-1 py-0 rounded-full ${selectedCategory === cat.id ? 'bg-[#0B0F14]/20' : 'bg-white/5'}`}>{cat.count}</span>
                  </button>
                );
              })}
            </div>
            <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />
            <div className="flex gap-1.5 items-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider mr-1">Ordenar</span>
              {[
                { id: 'recientes' as const, label: 'Recientes' },
                { id: 'populares' as const, label: 'Populares' },
                { id: 'tendencia' as const, label: 'Tendencia' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    sortBy === s.id ? 'bg-[#00D4FF] text-[#0B0F14]' : 'bg-[#1a1f2e] border border-white/[0.06] text-gray-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {selectedCategory
                  ? CATEGORIES.find((c) => c.id === selectedCategory)?.label
                  : searchQuery
                  ? `Resultados para "${searchQuery}"`
                  : 'Todas las Noticias'}
              </h2>
              <span className="text-[10px] text-gray-500">{filteredNews.length} artículos</span>
            </div>

            <div className="space-y-4">
              {filteredNews.map((article) => (
                <NewsCard key={article.id} article={article} onClick={() => setSelectedNews(article)} />
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📰</div>
                <p className="text-gray-400 text-lg font-semibold mb-1">No se encontraron noticias</p>
                <p className="text-gray-500 text-sm">Intenta con otros filtros o términos de búsqueda</p>
                <Button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }} variant="outline" className="mt-4 border-[rgba(74,222,128,0.2)] text-gray-400 hover:text-white text-sm">
                  <RefreshCw size={14} className="mr-1.5" /> Limpiar filtros
                </Button>
              </div>
            )}
          </section>

          <Sidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            allNews={NEWS_DATA}
            onSelectArticle={setSelectedNews}
          />
        </div>
      </main>
    </div>
  );
}
