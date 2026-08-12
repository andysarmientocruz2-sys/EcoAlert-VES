import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft, Search, BookOpen, Clock, Award, CheckCircle2, Circle, Play,
  Lightbulb, Brain, Zap, Star, Trophy, Target, Sparkles, ChevronRight,
  GraduationCap, Flame, Users, Calendar, Download, FileText,
  Timer, RotateCcw, Eye, ChevronDown, ChevronUp, Bookmark, Shield, Gem, Crown,
  X, ListChecks, Lock, PartyPopper, Medal, CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import coursesService from '@/services/coursesService';
import { getLessonContent } from '@/data/courseContent';

// ─── INTERFACES ──────────────────────────────────────────────────────
interface Course {
  id: string; title: string; description: string; longDescription: string;
  icon: string; coverGradient: string;
  level: 'principiante' | 'intermedio' | 'avanzado'; category: string;
  lessons: number; modules: { name: string; lessons: string[] }[];
  duration: string; progress: number;
  status: 'completado' | 'en_progreso' | 'pendiente';
  points: number; rating: number; students: number;
  professor: string; professorRole: string; lastUpdated: string;
  objectives: string[]; skills: string[]; requirements: string[];
  resources: { name: string; type: string }[];
  faqs: { q: string; a: string }[];
  completedLessons?: string[];
}

interface BadgeItem {
  id: string; name: string; icon: string; description: string;
  requirement: string; earned: boolean; rarity: 'comun' | 'raro' | 'epico' | 'legendario';
  progress: number; reward: string; color: string;
}

interface TriviaFact {
  id: string; fact: string; source: string; emoji: string;
  category: string; relatedLink: string;
}

interface QuizQuestion {
  id: string; question: string; options: string[];
  correct: number; explanation: string; difficulty: string;
}

interface EcoTip {
  id: string; icon: string; title: string; description: string;
  difficulty: 'fácil' | 'moderado' | 'avanzado';
  impact: string; color: string;
}

// ─── DATA ────────────────────────────────────────────────────────────
const COURSES: Course[] = [
  {
    id: 'c1', title: 'Fundamentos del Reciclaje', icon: '♻️',
    coverGradient: 'from-emerald-500 to-teal-600',
    description: 'Conceptos básicos del reciclaje para principiantes.',
    longDescription: 'Domina los fundamentos del reciclaje desde cero. Aprenderás a clasificar residuos correctamente, entender los símbolos de reciclaje, y aplicar las 3R (Reducir, Reutilizar, Reciclar) en tu vida cotidiana. Incluye ejercicios prácticos y un simulador de clasificación.',
    level: 'principiante', category: 'Reciclaje', lessons: 8, duration: '2h 30min',
    progress: 0, status: 'pendiente', points: 150, rating: 4.8, students: 1248,
    professor: 'Dra. Ana Martínez', professorRole: 'Especialista en Gestión de Residuos',
    lastUpdated: 'Julio 2026',
    objectives: ['Clasificar residuos correctamente', 'Identificar símbolos de reciclaje', 'Aplicar las 3R en el hogar', 'Reducir tu huella de residuos'],
    skills: ['Gestión de residuos', 'Clasificación', 'Sostenibilidad'],
    requirements: ['No se requieren conocimientos previos', 'Ganas de aprender'],
    modules: [
      { name: 'Introducción al Reciclaje', lessons: ['¿Qué es reciclar?', 'Historia del reciclaje', 'Beneficios ambientales'] },
      { name: 'Clasificación de Residuos', lessons: ['Material orgánico', 'Plásticos y metales', 'Papel y cartón', 'Vidrio'] },
      { name: 'Práctica en el Hogar', lessons: ['Punto limpio en casa', 'Compostaje básico'] },
    ],
    resources: [{ name: 'Guía de clasificación PDF', type: 'pdf' }, { name: 'Checklist de reciclaje', type: 'pdf' }],
    faqs: [{ q: '¿Necesito experiencia previa?', a: 'No, este curso está diseñado para principiantes totales.' }, { q: '¿Cuánto tiempo tengo acceso?', a: 'Acceso de por vida a todo el material.' }],
  },
  {
    id: 'c2', title: 'Ahorro Inteligente de Agua', icon: '💧',
    coverGradient: 'from-cyan-500 to-blue-600',
    description: 'Estrategias prácticas para reducir el consumo de agua.',
    longDescription: 'Descubre cómo reducir tu consumo de agua hasta en un 40% sin sacrificar comodidad. Aprende técnicas de ahorro para el hogar, la escuela y la comunidad, incluyendo sistemas de captación de agua lluvia.',
    level: 'principiante', category: 'Agua', lessons: 6, duration: '1h 45min',
    progress: 0, status: 'pendiente', points: 120, rating: 4.6, students: 980,
    professor: 'Ing. Carlos Rivera', professorRole: 'Ingeniero Hidráulico',
    lastUpdated: 'Junio 2026',
    objectives: ['Reducir consumo de agua en 40%', 'Implementar sistemas de captación', 'Detectar fugas', 'Educar a tu comunidad'],
    skills: ['Ahorro hídrico', 'Captación de lluvia', 'Mantenimiento'],
    requirements: ['Interés en el ahorro de agua'],
    modules: [
      { name: 'El Agua en tu Hogar', lessons: ['Fuentes de desperdicio', 'Medición de consumo'] },
      { name: 'Técnicas de Ahorro', lessons: ['Reparación de fugas', 'Aparatos eficientes', 'Captación de lluvia'] },
      { name: 'Comunidad y Agua', lessons: ['Campañas de ahorro'] },
    ],
    resources: [{ name: 'Calculadora de consumo', type: 'pdf' }],
    faqs: [{ q: '¿Cuánto puedo ahorrar?', a: 'En promedio, entre un 30-40% del consumo actual.' }],
  },
  {
    id: 'c3', title: 'Calidad del Aire y Salud', icon: '🌬️',
    coverGradient: 'from-sky-400 to-indigo-500',
    description: 'Cómo la contaminación atmosférica afecta tu salud.',
    longDescription: 'Comprende los efectos de la contaminación del aire en la salud humana. Aprende a medir la calidad del aire, identificar fuentes de contaminación y tomar medidas protectivas para ti y tu familia.',
    level: 'principiante', category: 'Aire', lessons: 7, duration: '2h',
    progress: 0, status: 'pendiente', points: 140, rating: 4.7, students: 756,
    professor: 'Dra. Laura Sánchez', professorRole: ' Médica Ambiental',
    lastUpdated: 'Mayo 2026',
    objectives: ['Entender los contaminantes del aire', 'Medir calidad del aire', 'Proteger tu salud', 'Reducir emisiones personales'],
    skills: ['Salud ambiental', 'Monitoreo', 'Prevención'],
    requirements: ['Interés en salud y medio ambiente'],
    modules: [
      { name: 'Fundamentos', lessons: ['Contaminantes principales', 'Fuentes de emisión'] },
      { name: 'Salud y Aire', lessons: ['Efectos en el organismo', 'Grupos de riesgo', 'Protección personal'] },
      { name: 'Acción Ciudadana', lessons: ['Monitoreo comunitario', 'Soluciones locales'] },
    ],
    resources: [], faqs: [],
  },
  {
    id: 'c4', title: 'Huerta Urbana Sostenible', icon: '🌱',
    coverGradient: 'from-green-500 to-emerald-600',
    description: 'Guía paso a paso para crear tu huerta urbana.',
    longDescription: 'Domina el arte de la agricultura urbana. Desde la selección de semillas orgánicas hasta la cosecha responsable. Aprende técnicas de compostaje, control biológico de plagas y diseño de espacios productivos en balcony o terraza.',
    level: 'intermedio', category: 'Agricultura', lessons: 10, duration: '3h 15min',
    progress: 0, status: 'pendiente', points: 200, rating: 4.9, students: 1560,
    professor: 'Ing. Miguel Torres', professorRole: 'Ingeniero Agrónomo',
    lastUpdated: 'Julio 2026',
    objectives: ['Diseñar una huerta urbana', 'Sembrar orgánico', 'Controlar plagas naturalmente', 'Cosechar sosteniblemente'],
    skills: ['Agricultura urbana', 'Compostaje', 'Agronomía'],
    requirements: ['Espacio disponible (balcony, terraza, patio)'],
    modules: [
      { name: 'Planificación', lessons: ['Diseño del espacio', 'Selección de cultivos', 'Sustrato y abono'] },
      { name: 'Siembra', lessons: ['Técnicas de siembra', 'Riego inteligente', 'Cuidados básicos'] },
      { name: 'Cosecha', lessons: ['Momento de cosecha', 'Post-cosecha', 'Guardado de semillas'] },
    ],
    resources: [{ name: 'Calendario de siembra', type: 'pdf' }, { name: 'Guía de plagas', type: 'pdf' }],
    faqs: [{ q: '¿Necesito mucho espacio?', a: 'No, puedes empezar con un balcón de 1m².' }],
  },
  {
    id: 'c5', title: 'Energías Renovables para el Hogar', icon: '⚡',
    coverGradient: 'from-amber-400 to-orange-600',
    description: 'Evaluar e instalar sistemas de energía solar y eólica.',
    longDescription: 'Aprende a evaluar, dimensionar e instalar sistemas fotovoltaicos y eólicos en viviendas residenciales. Incluye cálculos de ahorro, aspectos legales y mantenimiento.',
    level: 'intermedio', category: 'Energía', lessons: 12, duration: '4h',
    progress: 0, status: 'pendiente', points: 250, rating: 4.5, students: 672,
    professor: 'Ing. Pedro Gutiérrez', professorRole: 'Ingeniero en Energías Renovables',
    lastUpdated: 'Abril 2026',
    objectives: ['Calcular consumo energético', 'Dimensionar paneles solares', 'Entender inversores', 'Calcular retorno de inversión'],
    skills: ['Energía solar', 'Fotovoltaica', 'Cálculos'],
    requirements: ['Conocimientos básicos de matemáticas', 'Interés en energías limpias'],
    modules: [
      { name: 'Fundamentos Energéticos', lessons: ['Tipos de energía', 'El recurso solar', 'El recurso eólico'] },
      { name: 'Sistemas Fotovoltaicos', lessons: ['Paneles', 'Inversores', 'Baterías', 'Instalación'] },
      { name: 'Economía Verde', lessons: ['Costos', 'Ahorro', 'Subsidios'] },
    ],
    resources: [], faqs: [],
  },
  {
    id: 'c6', title: 'Gestión de Residuos Orgánicos', icon: '🍃',
    coverGradient: 'from-lime-500 to-green-600',
    description: 'Compostaje y transformación de residuos en recursos.',
    longDescription: 'Domina el compostaje casero, industrial y la biorrefinación. Convierte tus residuos orgánicos en abono de alta calidad y aprende sobre la economía circular de los residuos.',
    level: 'intermedio', category: 'Residuos', lessons: 9, duration: '2h 45min',
    progress: 0, status: 'pendiente', points: 180, rating: 4.7, students: 890,
    professor: 'Dra. Sofia López', professorRole: 'Bióloga Ambiental',
    lastUpdated: 'Junio 2026',
    objectives: ['Crear compost de calidad', 'Gestionar residuos orgánicos', 'Implementar biorrefinación', 'Entender la economía circular'],
    skills: ['Compostaje', 'Biorrefinación', 'Economía circular'],
    requirements: ['Acceso a residuos orgánicos'],
    modules: [
      { name: 'Fundamentos', lessons: ['¿Qué es el compost?', 'Microorganismos'] },
      { name: 'Compostaje Casero', lessons: ['Lombricompostaje', 'Compostaje en frio', 'Compostaje en caliente'] },
      { name: 'Escala Comunitaria', lessons: ['Compostaje industrial', 'Biorrefinación'] },
    ],
    resources: [{ name: 'Manual de compostaje', type: 'pdf' }],
    faqs: [{ q: '¿Huele mal?', a: 'Un compost bien llevado no genera malos olores.' }],
  },
  {
    id: 'c7', title: 'Impacto Ambiental Industrial', icon: '🏭',
    coverGradient: 'from-slate-500 to-zinc-700',
    description: 'Análisis de efectos industriales y estrategias de mitigación.',
    longDescription: 'Estudio profundo de los impactos ambientales de la actividad industrial. Análisis de lifecycle assessment (LCA), estrategias de mitigación basadas en evidencia y marcos regulatorios internacionales.',
    level: 'avanzado', category: 'Industria', lessons: 15, duration: '5h 30min',
    progress: 0, status: 'pendiente', points: 350, rating: 4.4, students: 340,
    professor: 'Dr. Fernando Ruiz', professorRole: 'Doctor en Ciencias Ambientales',
    lastUpdated: 'Marzo 2026',
    objectives: ['Realizar análisis LCA', 'Evaluar impactos industriales', 'Diseñar planes de mitigación', 'Entender marcos regulatorios'],
    skills: ['LCA', 'Impacto ambiental', 'Regulación'],
    requirements: ['Conocimientos intermedios de ciencias ambientales'],
    modules: [
      { name: 'Impactos Industriales', lessons: ['Contaminación del aire', 'Agua industrial', 'Residuos peligrosos'] },
      { name: 'Herramientas de Análisis', lessons: ['LCA', 'Huella de carbono', 'Auditorías'] },
      { name: 'Mitigación', lessons: ['Tecnologías limpias', 'Economía circular industrial', 'Regulación'] },
    ],
    resources: [], faqs: [],
  },
  {
    id: 'c8', title: 'Biodiversidad y Ecosistemas', icon: '🦋',
    coverGradient: 'from-violet-500 to-purple-600',
    description: 'Interacciones ecológicas y conservación de especies.',
    longDescription: 'Estudia las complejas interacciones entre especies y ecosistemas. Aprende sobre conservación ex-situ e in-situ, diseño de corredores biológicos y monitoreo de biodiversidad con tecnología.',
    level: 'avanzado', category: 'Ecosistemas', lessons: 14, duration: '5h',
    progress: 0, status: 'pendiente', points: 320, rating: 4.8, students: 420,
    professor: 'Dra. Isabella Moreno', professorRole: 'Ecóloga y Conservacionista',
    lastUpdated: 'Julio 2026',
    objectives: ['Entender redes tróficas', 'Diseñar corredores biológicos', 'Monitorear biodiversidad', 'Implementar conservación'],
    skills: ['Ecología', 'Conservación', 'Monitoreo'],
    requirements: ['Conocimientos de biología', 'Interés en conservación'],
    modules: [
      { name: 'Ecología Básica', lessons: ['Cadenas tróficas', 'Nichos ecológicos', 'Sucesión ecológica'] },
      { name: 'Conservación', lessons: ['Áreas protegidas', 'Conservación ex-situ', 'Corredores biológicos'] },
      { name: 'Monitoreo', lessons: ['Bioindicadores', 'Tecnología de monitoreo', 'Ciencia ciudadana'] },
    ],
    resources: [{ name: 'Guía de bioindicadores', type: 'pdf' }],
    faqs: [{ q: '¿Es muy teórico?', a: 'Combina teoría con ejercicios prácticos de campo.' }],
  },
  {
    id: 'c9', title: 'Cambio Climático: Ciencia y Acción', icon: '🌡️',
    coverGradient: 'from-red-500 to-rose-600',
    description: 'Mecanismos del cambio climático y soluciones basadas en ciencia.',
    longDescription: 'Curso avanzado sobre la ciencia del cambio climático. Desde los mecanismos atmosféricos hasta los modelos predictivos más recientes. Incluye estrategias de adaptación y mitigación basadas en evidencia.',
    level: 'avanzado', category: 'Clima', lessons: 16, duration: '6h',
    progress: 0, status: 'pendiente', points: 400, rating: 4.9, students: 280,
    professor: 'Dr. Alejandro Vega', professorRole: 'Climatólogo, IPCC',
    lastUpdated: 'Junio 2026',
    objectives: ['Entender el efecto invernadero', 'Analizar modelos climáticos', 'Evaluar estrategias de mitigación', 'Proponer soluciones locales'],
    skills: ['Climatología', 'Modelado', 'Mitigación'],
    requirements: ['Conocimientos avanzados de ciencias', 'Pensamiento analítico'],
    modules: [
      { name: 'Ciencia del Clima', lessons: ['Efecto invernadero', 'Ciclos del carbono', 'Retroalimentaciones'] },
      { name: 'Modelado', lessons: ['Modelos GCM', 'Escenarios IPCC', 'Proyecciones regionales'] },
      { name: 'Acción Climática', lessons: ['Mitigación', 'Adaptación', 'Políticas climáticas'] },
    ],
    resources: [{ name: 'Datos IPCC resumen', type: 'pdf' }, { name: 'Calculadora de huella de carbono', type: 'pdf' }],
    faqs: [{ q: '¿Necesito saber matemáticas?', a: 'Se explican los conceptos necesarios durante el curso.' }],
  },
];

const ECO_TIPS: EcoTip[] = [
  { id: 'e1', icon: '🧴', title: 'Botella Reutilizable', description: 'Usar una botella reutilizable evita 217 plásticos al año.', difficulty: 'fácil', impact: 'Alto', color: '#4ADE80' },
  { id: 'e2', icon: '🚿', title: 'Ducha de 5 Minutos', description: 'Cortar 5 minutos de ducha ahorra 87 litros/mes por persona.', difficulty: 'fácil', impact: 'Medio', color: '#00D4FF' },
  { id: 'e3', icon: '🔌', title: 'Sin Standby', description: 'Los electrodomésticos en standby consumen hasta 10% de energía.', difficulty: 'fácil', impact: 'Alto', color: '#FBBF24' },
  { id: 'e4', icon: '🛍️', title: 'Bolsas de Tela', description: 'Reemplazar bolsas de plástico por tela reduce 700 bolsas/año.', difficulty: 'fácil', impact: 'Medio', color: '#4ADE80' },
  { id: 'e5', icon: '🗑️', title: 'Separar Bien', description: 'Separar correctamente permite reciclar hasta el 80% de residuos.', difficulty: 'moderado', impact: 'Alto', color: '#F97316' },
  { id: 'e6', icon: '🌳', title: 'Plantar un Árbol', description: 'Un árbol absorbe 22kg de CO₂/año y oxígeno para 2 personas.', difficulty: 'moderado', impact: 'Muy Alto', color: '#4ADE80' },
];

const TRIVIA_FACTS: TriviaFact[] = [
  { id: 't1', fact: 'El 91% del plástico no se recicla. Cada año se producen 380 millones de toneladas.', source: 'National Geographic', emoji: '♻️', category: 'Residuos', relatedLink: 'https://www.nationalgeographic.com' },
  { id: 't2', fact: 'Un árbol absorbe 22 kg de CO₂ al año y libera oxígeno para 2 personas.', source: 'ONU Medio Ambiente', emoji: '🌳', category: 'Clima', relatedLink: 'https://www.unep.org' },
  { id: 't3', fact: 'El agua contaminada mata a más personas que toda la violencia del mundo combinada.', source: 'OMS', emoji: '💧', category: 'Salud', relatedLink: 'https://www.who.int' },
  { id: 't4', fact: 'Si todos consumieran como el promedio de EE.UU., necesitaríamos 5 planetas.', source: 'Global Footprint Network', emoji: '🌍', category: 'Consumo', relatedLink: 'https://www.footprintcalculator.org' },
  { id: 't5', fact: 'Las abejas polinizan el 75% de los cultivos del mundo. Sin ellas, perdemos comida.', source: 'FAO', emoji: '🐝', category: 'Biodiversidad', relatedLink: 'https://www.fao.org' },
  { id: 't6', fact: 'Los océanos producen el 50% del oxígeno y absorben el 30% del CO₂ emitido.', source: 'NOAA', emoji: '🌊', category: 'Océanos', relatedLink: 'https://www.noaa.gov' },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', question: '¿Cuántos años tarda una botella de plástico en degradarse?', options: ['100 años', '450 años', '1000 años', '50 años'], correct: 1, explanation: 'Una botella de plástico tarda aproximadamente 450 años en degradarse completamente en el medio ambiente.', difficulty: 'fácil' },
  { id: 'q2', question: '¿Qué porcentaje del agua de la Tierra es potable?', options: ['10%', '3%', '0.3%', '1%'], correct: 2, explanation: 'Solo el 0.3% del agua dulce del mundo está disponible para el consumo humano directo.', difficulty: 'moderado' },
  { id: 'q3', question: '¿Cuál es la principal causa de deforestación en la Amazonía?', options: ['Incendios', 'Ganadería y agricultura', 'Minería', 'Urbanización'], correct: 1, explanation: 'La ganadería extensiva y la agricultura son responsables del 80% de la deforestación amazónica.', difficulty: 'moderado' },
  { id: 'q4', question: '¿Cuánto CO₂ absorbe un árbol adulto al año?', options: ['5 kg', '22 kg', '50 kg', '100 kg'], correct: 1, explanation: 'Un árbol adulto absorbe en promedio 22 kg de CO₂ al año.', difficulty: 'fácil' },
  { id: 'q5', question: '¿Qué gas es el principal causante del efecto invernadero?', options: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Hidrógeno'], correct: 2, explanation: 'El CO₂ es el principal gas de efecto invernadero de origen antropogénico.', difficulty: 'fácil' },
];

const BADGES_TEMPLATE: Omit<BadgeItem, 'earned' | 'progress'>[] = [
  { id: 'b1', name: 'Primera Semilla', icon: '🌱', description: 'Completó su primer curso', requirement: 'Completa 1 curso', rarity: 'comun', reward: '+50 EcoPuntos', color: '#4ADE80' },
  { id: 'b2', name: 'Eco Aprendiz', icon: '📖', description: 'Completó 3 cursos', requirement: 'Completa 3 cursos', rarity: 'raro', reward: '+100 EcoPuntos', color: '#00D4FF' },
  { id: 'b3', name: 'Guardián Verde', icon: '🛡️', description: 'Ganó 500 EcoPuntos', requirement: 'Acumula 500 puntos', rarity: 'epico', reward: 'Título exclusivo', color: '#A78BFA' },
  { id: 'b4', name: 'Mente Curiosa', icon: '🧠', description: 'Respondió 10 quizzes perfectos', requirement: '10 quizzes al 100%', rarity: 'epico', reward: '+200 EcoPuntos', color: '#FBBF24' },
  { id: 'b5', name: 'Maestro Eco', icon: '🏆', description: 'Completó todos los cursos avanzados', requirement: '3 cursos avanzados', rarity: 'legendario', reward: 'Insignia exclusiva +500pts', color: '#F97316' },
  { id: 'b6', name: 'Chispa Ambiental', icon: '✨', description: 'Invitó 5 amigos a la plataforma', requirement: 'Invita 5 amigos', rarity: 'raro', reward: '+150 EcoPuntos', color: '#EC4899' },
  { id: 'b7', name: 'Racha de Fuego', icon: '🔥', description: '7 días consecutivos de aprendizaje', requirement: 'Racha de 7 días', rarity: 'epico', reward: 'Badge animado +100pts', color: '#EF4444' },
  { id: 'b8', name: 'Explorador Total', icon: '🧭', description: 'Exploró todas las categorías', requirement: 'Visita 6 categorías', rarity: 'comun', reward: '+75 EcoPuntos', color: '#06B6D4' },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────

function LearningStats({ courses }: { courses: Course[] }) {
  const completed = courses.filter(c => c.status === 'completado').length;
  const inProgress = courses.filter(c => c.status === 'en_progreso').length;
  const totalPoints = coursesService.getEarnedPoints();
  const streak = 5;
  const weeklyHours = 12.5;
  const monthlyGoal = 75;

  const stats = [
    { label: 'Racha', value: `${streak}d`, icon: Flame, color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
    { label: 'Horas esta semana', value: weeklyHours.toFixed(1), icon: Clock, color: '#00D4FF', bg: 'rgba(0,212,255,0.12)' },
    { label: 'Completados', value: completed, icon: CheckCircle2, color: '#4ADE80', bg: 'rgba(74,222,128,0.12)' },
    { label: 'En progreso', value: inProgress, icon: Play, color: '#FBBF24', bg: 'rgba(251,191,36,0.12)' },
    { label: 'EcoPuntos', value: totalPoints, icon: Zap, color: '#4ADE80', bg: 'rgba(74,222,128,0.12)' },
    { label: 'Objetivo mensual', value: `${monthlyGoal}%`, icon: Target, color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1f2e]/80 border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1a1f2e] transition-all duration-300 cursor-default">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
              <Icon size={16} style={{ color: s.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
  const levelColors: Record<string, string> = {
    principiante: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    intermedio: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    avanzado: 'bg-red-500/15 text-red-400 border-red-500/25',
  };
  const statusColors: Record<string, string> = {
    completado: 'bg-emerald-500/15 text-emerald-400',
    en_progreso: 'bg-amber-500/15 text-amber-400',
    pendiente: 'bg-gray-500/15 text-gray-400',
  };
  const statusLabels: Record<string, string> = {
    completado: 'Completado', en_progreso: 'En progreso', pendiente: 'Pendiente',
  };

  return (
    <div onClick={onClick} className="group bg-[#1a1f2e] rounded-2xl border border-white/[0.06] overflow-hidden hover:border-[#4ADE80]/30 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-[#4ADE80]/5 hover:-translate-y-1">
      {/* Cover */}
      <div className={`h-40 bg-gradient-to-br ${course.coverGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/40 text-white backdrop-blur-sm">
            {course.level === 'principiante' ? '🌱 Principiante' : course.level === 'intermedio' ? '🌿 Intermedio' : '🌳 Avanzado'}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[course.status]}`}>
            {statusLabels[course.status]}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 text-4xl drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
          {course.icon}
        </div>
        {course.status === 'completado' && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{course.category}</p>
        <h3 className="font-bold text-white text-sm mb-1.5 group-hover:text-[#4ADE80] transition-colors line-clamp-1">{course.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">{course.description}</p>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-gray-500">{course.lessons} lecciones · {course.duration}</span>
            <span className="text-[#4ADE80] font-semibold">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-1.5" />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4ADE80] to-[#00D4FF] flex items-center justify-center text-[8px] font-bold text-[#0B0F14]">
              {course.professor.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span className="text-[10px] text-gray-400 truncate max-w-[80px]">{course.professor.split(' ').slice(-1)[0]}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-0.5"><Star size={10} className="text-amber-400" />{course.rating}</span>
            <span className="flex items-center gap-0.5"><Users size={10} />{course.students.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LessonViewerProps {
  course: Course;
  lessonTitle: string;
  onBack: () => void;
  onGoToLesson: (lesson: string) => void;
  onCourseCompleted: () => void;
  onRefresh: () => void;
}

function LessonViewer({ course, lessonTitle, onBack, onGoToLesson, onCourseCompleted, onRefresh }: LessonViewerProps) {
  const content = getLessonContent(course.id, lessonTitle);
  const lessons = coursesService.getLessonList(course.id);
  const currentIdx = lessons.indexOf(lessonTitle);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const isCompleted = coursesService.isLessonComplete(course.id, lessonTitle);
  const module = course.modules.find((m) => m.lessons.includes(lessonTitle));
  const progress = coursesService.calculateProgressPct(course.id);
  const completedCount = coursesService.getProgress(course.id).completedLessons.length;

  const handleComplete = useCallback(() => {
    const result = coursesService.completeLesson(course.id, lessonTitle, course.points);
    onRefresh();
    if (result.newlyCompleted) {
      toast.success('¡Lección completada!', { description: 'Sigue con la siguiente lección.' });
    }
    if (result.courseCompleted) {
      toast.success(`¡Curso completado! +${result.pointsEarned} EcoPuntos`, { description: 'Muy bien, sigue aprendiendo.' });
      onCourseCompleted();
      return;
    }
    const next = coursesService.getNextLesson(course.id, lessonTitle);
    if (next) {
      onGoToLesson(next);
    } else {
      onCourseCompleted();
    }
  }, [course.id, course.points, lessonTitle, onRefresh, onGoToLesson, onCourseCompleted]);

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white">
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <p className="text-gray-400">Esta lección aún no tiene contenido.</p>
          <Button onClick={onBack} className="mt-4 bg-[#4ADE80] text-[#0B0F14] hover:bg-[#3AC76F]">Volver al curso</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* Header */}
      <header className="sticky top-16 z-40 bg-[#0B0F14]/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors"><ChevronLeft size={20} /></button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{course.icon} {course.title}</p>
            <p className="text-sm font-semibold truncate">Lección {currentIdx + 1} de {lessons.length}</p>
          </div>
          <span className="text-xs font-bold text-[#4ADE80]">{progress}%</span>
        </div>
        <div className="h-0.5 bg-white/5">
          <div className="h-full bg-gradient-to-r from-[#4ADE80] to-[#00D4FF] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span>{course.category}</span>
          <ChevronRight size={12} />
          <span>{module?.name || 'Módulo'}</span>
          {isCompleted && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
              <CheckCircle2 size={10} /> Completada
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#00D4FF] flex items-center justify-center flex-shrink-0">
            <Play size={18} className="text-[#0B0F14]" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold leading-tight">{lessonTitle}</h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock size={12} />{content.minutes} min de lectura</span>
              <span className="flex items-center gap-1"><ListChecks size={12} />{completedCount}/{lessons.length} lecciones</span>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="p-5 rounded-2xl border border-[rgba(74,222,128,0.15)] bg-gradient-to-r from-[rgba(74,222,128,0.06)] to-transparent">
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">{content.intro}</p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {content.sections.map((section, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#1a1f2e] border border-white/[0.06]">
              {section.heading && (
                <h3 className="text-sm font-bold text-[#4ADE80] mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#4ADE80]/10 flex items-center justify-center text-[10px]">{i + 1}</span>
                  {section.heading}
                </h3>
              )}
              <p className="text-sm text-gray-300 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="p-4 rounded-2xl bg-[#FBBF24]/[0.06] border border-[#FBBF24]/20 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/15 flex items-center justify-center flex-shrink-0"><Lightbulb size={16} className="text-[#FBBF24]" /></div>
          <div>
            <p className="text-xs font-bold text-[#FBBF24] mb-1">Dato clave</p>
            <p className="text-sm text-gray-200 leading-relaxed">{content.tip}</p>
          </div>
        </div>

        {/* Activity */}
        <div className="p-4 rounded-2xl bg-[#00D4FF]/[0.06] border border-[#00D4FF]/20 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/15 flex items-center justify-center flex-shrink-0"><Target size={16} className="text-[#00D4FF]" /></div>
          <div>
            <p className="text-xs font-bold text-[#00D4FF] mb-1">Actividad práctica</p>
            <p className="text-sm text-gray-200 leading-relaxed">{content.activity}</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-10">
          <Button
            variant="outline"
            onClick={() => prevLesson && onGoToLesson(prevLesson)}
            disabled={!prevLesson}
            className="border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-40"
          >
            <ChevronLeft size={16} className="mr-2" />Anterior
          </Button>
          <div className="flex-1" />
          {isCompleted ? (
            <>
              <Button
                onClick={handleComplete}
                className="bg-[#00D4FF] text-[#0B0F14] hover:bg-[#00B8D4] font-semibold"
              >
                {currentIdx < lessons.length - 1 ? 'Siguiente lección' : 'Terminar y ver curso'} <ChevronRight size={16} className="ml-2" />
              </Button>
            </>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-[#4ADE80] text-[#0B0F14] hover:bg-[#3AC76F] font-semibold"
            >
              <CheckCheck size={16} className="mr-2" />Marcar como completada y continuar
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function CourseDetail({ course, onBack, onStart, onOpenLesson }: {
  course: Course;
  onBack: () => void;
  onStart: () => void;
  onOpenLesson: (lesson: string) => void;
}) {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'resources' | 'faq'>('overview');
  const completedLessons = course.completedLessons || [];
  const completedModules = course.status === 'completado' ? course.modules.length : coursesService.calculateCompletedModules(course.id, course.modules);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('ecoalert_bookmarks') || '[]');
      setBookmarked(bookmarks.includes(course.id));
    } catch {
      setBookmarked(false);
    }
  }, [course.id]);

  const toggleBookmark = () => {
    try {
      const bookmarks: string[] = JSON.parse(localStorage.getItem('ecoalert_bookmarks') || '[]');
      const next = bookmarks.includes(course.id) ? bookmarks.filter((b) => b !== course.id) : [...bookmarks, course.id];
      localStorage.setItem('ecoalert_bookmarks', JSON.stringify(next));
      setBookmarked(next.includes(course.id));
      toast.success(next.includes(course.id) ? 'Curso guardado' : 'Curso removido de guardados');
    } catch {
      toast.error('No se pudo guardar el curso');
    }
  };

  const handleDownload = (name: string) => {
    toast.success('Descargando ' + name, { description: 'Tu descarga comenzó en segundo plano.' });
    const content = `EcoAlert VES — Material educativo\n\nCurso: ${course.title}\nRecurso: ${name}\n\nEste material te ayudará a reforzar lo aprendido en el curso. ¡Sigue cuidando el planeta!`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'overview' as const, label: 'Descripción' },
    { id: 'modules' as const, label: `Módulos (${course.modules.length})` },
    { id: 'resources' as const, label: `Recursos (${course.resources.length})` },
    { id: 'faq' as const, label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* Cover */}
      <div className={`relative h-64 sm:h-80 bg-gradient-to-br ${course.coverGradient}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <button onClick={onBack} className="p-2 bg-black/40 backdrop-blur-sm rounded-lg text-white hover:bg-black/60 transition-colors">
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-sm">{course.level === 'principiante' ? '🌱 Principiante' : course.level === 'intermedio' ? '🌿 Intermedio' : '🌳 Avanzado'}</span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-sm">{course.category}</span>
            {course.status === 'completado' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-400/90 text-[#0B0F14] backdrop-blur-sm">✅ Completado</span>
            )}
          </div>
          <div className="flex items-end gap-4">
            <span className="text-5xl drop-shadow-lg">{course.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{course.title}</h1>
              <p className="text-sm text-white/80 mt-1">{course.longDescription.slice(0, 120)}...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Professor & Meta */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4ADE80] to-[#00D4FF] flex items-center justify-center font-bold text-sm text-[#0B0F14]">
              {course.professor.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold">{course.professor}</p>
              <p className="text-xs text-gray-400">{course.professorRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" />{course.rating} valoración</span>
            <span className="flex items-center gap-1"><Users size={12} />{course.students.toLocaleString()} estudiantes</span>
            <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
            <span className="flex items-center gap-1"><BookOpen size={12} />{course.lessons} lecciones</span>
            <span className="flex items-center gap-1"><Calendar size={12} />Actualizado {course.lastUpdated}</span>
          </div>
        </div>

        {/* Progress */}
        {course.status !== 'pendiente' && (
          <Card className="p-4 bg-[#1a1f2e] border-[rgba(74,222,128,0.15)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tu progreso</span>
              <span className="text-sm font-bold text-[#4ADE80]">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2.5" />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{completedLessons.length} de {course.lessons} lecciones completadas · {completedModules} de {course.modules.length} módulos</span>
              <span>{course.points} EcoPuntos al completar</span>
            </div>
          </Card>
        )}

        {/* Completed celebration */}
        {course.status === 'completado' && (
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-[rgba(74,222,128,0.12)] to-[rgba(0,212,255,0.08)] border border-[#4ADE80]/25">
            <div className="w-12 h-12 rounded-2xl bg-[#4ADE80]/20 flex items-center justify-center flex-shrink-0"><PartyPopper size={24} className="text-[#4ADE80]" /></div>
            <div className="flex-1">
              <p className="font-bold text-[#4ADE80]">¡Felicidades, completaste este curso!</p>
              <p className="text-xs text-gray-400">Ganaste {course.points} EcoPuntos. Repasa las lecciones cuando quieras.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1a1f2e] p-1 rounded-xl border border-white/5 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-[#4ADE80] text-[#0B0F14]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-3">Sobre este curso</h3>
              <p className="text-gray-300 leading-relaxed text-sm">{course.longDescription}</p>
            </div>
            {course.objectives.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">Lo que aprenderás</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 size={16} className="text-[#4ADE80] mt-0.5 flex-shrink-0" />
                      {obj}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {course.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">Habilidades que desarrollarás</h3>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#4ADE80]/10 text-[#4ADE80] rounded-full text-xs font-medium border border-[#4ADE80]/20">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {course.requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">Requisitos</h3>
                <ul className="space-y-2">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><Circle size={6} className="text-gray-500 mt-1.5 flex-shrink-0" />{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="space-y-3">
            {course.modules.map((mod, idx) => {
              const moduleDone = mod.lessons.every((l) => completedLessons.includes(l));
              return (
                <div key={idx} className="bg-[#1a1f2e] rounded-xl border border-white/[0.06] overflow-hidden">
                  <button onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${moduleDone ? 'bg-[#4ADE80] text-[#0B0F14]' : 'bg-white/5 text-gray-400'}`}>
                        {moduleDone ? <CheckCircle2 size={14} /> : idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{mod.name}</p>
                        <p className="text-xs text-gray-500">{mod.lessons.filter((l) => completedLessons.includes(l)).length}/{mod.lessons.length} lecciones</p>
                      </div>
                    </div>
                    {expandedModule === idx ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>
                  {expandedModule === idx && (
                    <div className="px-4 pb-4 space-y-1">
                      {mod.lessons.map((lesson, li) => {
                        const done = completedLessons.includes(lesson);
                        return (
                          <button
                            key={li}
                            onClick={() => onOpenLesson(lesson)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${done ? 'bg-[#4ADE80]/[0.06] hover:bg-[#4ADE80]/[0.1]' : 'hover:bg-white/[0.03]'}`}
                          >
                            {done ? <CheckCircle2 size={14} className="text-[#4ADE80] flex-shrink-0" /> : <Circle size={8} className="text-gray-600 flex-shrink-0" />}
                            <span className={`text-sm flex-1 ${done ? 'text-[#4ADE80]/90' : 'text-gray-300'}`}>{lesson}</span>
                            <Play size={12} className="text-gray-600 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-3">
            {course.resources.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No hay recursos disponibles aún.</p>
            ) : course.resources.map((res, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#1a1f2e] rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-[#4ADE80]" />
                  <span className="text-sm text-white">{res.name}</span>
                </div>
                <Button size="sm" onClick={() => handleDownload(res.name)} className="h-7 px-3 text-xs bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 hover:bg-[#4ADE80]/20">
                  <Download size={12} className="mr-1" />Descargar
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-3">
            {course.faqs.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No hay preguntas frecuentes aún.</p>
            ) : course.faqs.map((faq, i) => (
              <div key={i} className="p-4 bg-[#1a1f2e] rounded-xl border border-white/[0.06]">
                <p className="text-sm font-semibold text-white mb-2">{faq.q}</p>
                <p className="text-sm text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-3">
          {course.status === 'completado' ? (
            <Button onClick={onStart} className="bg-[#4ADE80] text-[#0B0F14] hover:bg-[#3AC76F] font-semibold"><RotateCcw size={16} className="mr-2" />Revisar Curso</Button>
          ) : course.status === 'en_progreso' ? (
            <Button onClick={onStart} className="bg-[#4ADE80] text-[#0B0F14] hover:bg-[#3AC76F] font-semibold"><Play size={16} className="mr-2" />Continuar Aprendiendo</Button>
          ) : (
            <Button onClick={onStart} className="bg-[#4ADE80] text-[#0B0F14] hover:bg-[#3AC76F] font-semibold"><Play size={16} className="mr-2" />Iniciar Curso</Button>
          )}
          <Button variant="outline" onClick={toggleBookmark} className={`border-[rgba(74,222,128,0.2)] ${bookmarked ? 'text-[#4ADE80]' : ''}`}><Bookmark size={16} className={`mr-2 ${bookmarked ? 'fill-[#4ADE80]' : ''}`} />{bookmarked ? 'Guardado' : 'Guardar'}</Button>
        </div>
      </div>
    </div>
  );
}

function QuizSection({ onStatsChange }: { onStatsChange?: () => void }) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZ_QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastEarned, setLastEarned] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const quizStats = coursesService.getQuizStats();

  useEffect(() => {
    if (started && !submitted && timeLeft > 0 && !showExplanation) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, submitted, timeLeft, showExplanation, step]);

  useEffect(() => {
    if (timeLeft === 0 && started && !submitted && !showExplanation) {
      handleNext();
    }
  }, [timeLeft]);

  const handleAnswer = (qIdx: number, aIdx: number) => {
    if (submitted || showExplanation) return;
    const newAnswers = [...answers];
    newAnswers[qIdx] = aIdx;
    setAnswers(newAnswers);
    setShowExplanation(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
      setTimeLeft(30);
    } else {
      const score = answers.reduce<number>((acc, a, i) => acc + (a === QUIZ_QUESTIONS[i].correct ? 1 : 0), 0);
      const result = coursesService.recordQuizResult(QUIZ_QUESTIONS.length, score);
      setLastEarned(result.earnedPoints);
      setSubmitted(true);
      onStatsChange?.();
    }
  };

  const score = QUIZ_QUESTIONS.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
  const reset = () => { setStarted(false); setStep(0); setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null)); setSubmitted(false); setTimeLeft(30); setShowExplanation(false); setLastEarned(0); };

  if (!started) return (
    <Card className="p-6 bg-gradient-to-r from-[rgba(0,212,255,0.08)] to-[rgba(74,222,128,0.08)] border-[rgba(0,212,255,0.2)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#00D4FF]/15 flex items-center justify-center flex-shrink-0"><Brain size={32} className="text-[#00D4FF]" /></div>
        <div className="flex-1">
          <h3 className="text-lg font-bold">Pon a prueba tus conocimientos</h3>
          <p className="text-sm text-gray-400">5 preguntas · 30s cada una · Gana EcoPuntos</p>
          <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-gray-500">
            <span className="flex items-center gap-1"><Target size={11} className="text-[#00D4FF]" />{quizStats.attempts} intentos</span>
            <span className="flex items-center gap-1"><Zap size={11} className="text-[#FBBF24]" />{quizStats.bestScore}% mejor puntaje</span>
            <span className="flex items-center gap-1"><Award size={11} className="text-[#4ADE80]" />{quizStats.perfectQuizzes} quizzes perfectos</span>
          </div>
        </div>
        <Button onClick={() => setStarted(true)} className="bg-[#00D4FF] text-[#0B0F14] hover:bg-[#00B8D4] font-semibold flex-shrink-0"><Target size={16} className="mr-2" />Iniciar Quiz</Button>
      </div>
    </Card>
  );

  if (submitted) return (
    <Card className="p-8 bg-[#1a1f2e] border-[rgba(0,212,255,0.2)] text-center">
      <div className="text-6xl mb-4">{pct === 100 ? '🏆' : pct >= 60 ? '🎉' : '💪'}</div>
      <h3 className="text-3xl font-bold mb-2">{score}/{QUIZ_QUESTIONS.length}</h3>
      <p className="text-lg text-gray-400 mb-1">{pct}% de aciertos</p>
      {lastEarned > 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/30 text-[#FBBF24] text-sm font-bold mb-4">
          <Zap size={14} /> +{lastEarned} EcoPuntos ganados
        </div>
      )}
      <p className="text-sm text-gray-500 mb-6">{pct === 100 ? '¡Perfecto! Eres un experto ambiental.' : pct >= 60 ? '¡Excelente trabajo!' : 'Sigue aprendiendo, ¡tú puedes!'}</p>
      <div className="bg-[#0B0F14] rounded-xl p-5 text-left space-y-4 mb-6">
        {QUIZ_QUESTIONS.map((q, i) => (
          <div key={i} className="flex items-start gap-3">
            {answers[i] === q.correct ? <CheckCircle2 size={18} className="text-green-400 mt-0.5 flex-shrink-0" /> : <Circle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />}
            <div>
              <p className="text-sm font-medium text-white">{q.question}</p>
              <p className="text-xs text-gray-400 mt-1">{q.explanation}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
        <Button onClick={reset} className="bg-[#00D4FF] text-[#0B0F14] hover:bg-[#00B8D4]"><RotateCcw size={16} className="mr-2" />Repetir Quiz</Button>
      </div>
    </Card>
  );

  const q = QUIZ_QUESTIONS[step];
  const answered = answers[step] !== null;
  const isCorrect = answers[step] === q.correct;

  return (
    <Card className="p-6 bg-[#1a1f2e] border-[rgba(0,212,255,0.2)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain size={20} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold">Quiz Ambiental</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${timeLeft <= 10 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-[#00D4FF]/15 text-[#00D4FF]'}`}>
            <Timer size={12} />{timeLeft}s
          </div>
          <span className="text-xs text-gray-500">{step + 1}/{QUIZ_QUESTIONS.length}</span>
        </div>
      </div>
      <Progress value={((step + 1) / QUIZ_QUESTIONS.length) * 100} className="h-1.5 mb-5" />
      <h4 className="text-base font-semibold mb-4">{q.question}</h4>
      <div className="space-y-2 mb-5">
        {q.options.map((opt, idx) => {
          let style = 'border-white/[0.06] bg-[#0B0F14] text-gray-300 hover:border-[#4ADE80]/30';
          if (answered) {
            if (idx === q.correct) style = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
            else if (idx === answers[step]) style = 'border-red-500 bg-red-500/10 text-red-300';
            else style = 'border-white/[0.04] bg-[#0B0F14]/50 text-gray-600';
          } else if (answers[step] === idx) {
            style = 'border-[#00D4FF] bg-[rgba(0,212,255,0.1)] text-white';
          }
          return (
            <button key={idx} onClick={() => handleAnswer(step, idx)} disabled={answered} className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm ${style} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}>
              <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
            </button>
          );
        })}
      </div>
      {showExplanation && (
        <div className={`p-3 rounded-xl text-sm mb-4 ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border border-red-500/20 text-red-300'}`}>
          {isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto.'} {q.explanation}
        </div>
      )}
      {answered && (
        <div className="flex justify-end">
          <Button onClick={handleNext} className="bg-[#00D4FF] text-[#0B0F14] hover:bg-[#00B8D4]">
            {step < QUIZ_QUESTIONS.length - 1 ? 'Siguiente' : 'Ver Resultados'} <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      )}
    </Card>
  );
}

function EcoTipsCarousel() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((c) => (c + 1) % ECO_TIPS.length);
  const prev = () => setCurrent((c) => (c - 1 + ECO_TIPS.length) % ECO_TIPS.length);
  const tip = ECO_TIPS[current];

  return (
    <Card className="p-5 bg-[#1a1f2e] border-white/[0.06]">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={18} className="text-[#FBBF24]" />
        <h3 className="font-bold text-sm">EcoTips</h3>
      </div>
      <div className="bg-[#0B0F14] rounded-xl p-5 border border-white/5">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">{tip.icon}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white mb-1">{tip.title}</h4>
            <p className="text-sm text-gray-400 mb-3">{tip.description}</p>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tip.difficulty === 'fácil' ? 'bg-emerald-500/15 text-emerald-400' : tip.difficulty === 'moderado' ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'}`}>
                {tip.difficulty}
              </span>
              <span className="text-[10px] text-gray-500">Impacto: <span style={{ color: tip.color }}>{tip.impact}</span></span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
        <div className="flex gap-1.5">{ECO_TIPS.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-[#FBBF24] w-4' : 'bg-gray-600'}`} />)}</div>
        <button onClick={next} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><ChevronRight size={16} /></button>
      </div>
    </Card>
  );
}

function TriviaSection() {
  const [currentFact, setCurrentFact] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain size={20} className="text-[#A78BFA]" />
        <h2 className="text-lg font-bold">Datos Curiosos</h2>
      </div>
      {/* Featured */}
      <Card className="p-6 bg-gradient-to-br from-[rgba(167,139,250,0.1)] to-[rgba(74,222,128,0.06)] border-[rgba(167,139,250,0.2)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[rgba(167,139,250,0.05)] rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#A78BFA]" />
            <span className="text-[10px] font-semibold text-[#A78BFA] uppercase tracking-wider">Dato del Día</span>
          </div>
          <div className="text-4xl mb-3">{TRIVIA_FACTS[currentFact].emoji}</div>
          <p className="text-base text-white font-medium leading-relaxed mb-2">"{TRIVIA_FACTS[currentFact].fact}"</p>
          <p className="text-xs text-gray-500">— {TRIVIA_FACTS[currentFact].source}</p>
          <div className="flex justify-center gap-1.5 mt-4">
            {TRIVIA_FACTS.map((_, i) => <button key={i} onClick={() => setCurrentFact(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentFact ? 'bg-[#A78BFA] w-5' : 'bg-gray-600'}`} />)}
          </div>
        </div>
      </Card>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TRIVIA_FACTS.map((item) => (
          <div key={item.id} className="p-4 bg-[#1a1f2e] rounded-xl border border-white/[0.06] hover:border-[rgba(74,222,128,0.25)] hover:bg-[#1a1f2e]/80 transition-all duration-300 cursor-default">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{item.emoji}</span>
              <div>
                <p className="text-xs text-gray-300 leading-relaxed">{item.fact}</p>
                <p className="text-[10px] text-gray-500 mt-2">— {item.source}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsSection({ completedCount, advancedCompleted, totalPoints, perfectQuizzes }: {
  completedCount: number;
  advancedCompleted: number;
  totalPoints: number;
  perfectQuizzes: number;
}) {
  const rarityConfig: Record<string, { label: string; color: string; border: string; icon: typeof Gem }> = {
    comun: { label: 'Común', color: 'text-gray-400', border: 'border-gray-500/20', icon: Shield },
    raro: { label: 'Raro', color: 'text-blue-400', border: 'border-blue-500/20', icon: Gem },
    epico: { label: 'Épico', color: 'text-purple-400', border: 'border-purple-500/20', icon: Crown },
    legendario: { label: 'Legendario', color: 'text-amber-400', border: 'border-amber-500/20', icon: Trophy },
  };

  const badges: BadgeItem[] = BADGES_TEMPLATE.map((b) => {
    switch (b.id) {
      case 'b1':
        return { ...b, earned: completedCount >= 1, progress: Math.min(Math.round((completedCount / 1) * 100), 100) };
      case 'b2':
        return { ...b, earned: completedCount >= 3, progress: Math.min(Math.round((completedCount / 3) * 100), 100) };
      case 'b3':
        return { ...b, earned: totalPoints >= 500, progress: Math.min(Math.round((totalPoints / 500) * 100), 100) };
      case 'b4':
        return { ...b, earned: perfectQuizzes >= 10, progress: Math.min(Math.round((perfectQuizzes / 10) * 100), 100) };
      case 'b5':
        return { ...b, earned: advancedCompleted >= 3, progress: Math.min(Math.round((advancedCompleted / 3) * 100), 100) };
      default:
        return { ...b, earned: b.id === 'b8' ? false : false, progress: b.id === 'b8' ? 83 : 40 };
    }
  });

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-[#FBBF24]" />
          <h2 className="text-lg font-bold">Insignias</h2>
        </div>
        <span className="text-xs text-gray-500">{earnedCount}/{badges.length} obtenidas</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {badges.map((badge) => {
          const rc = rarityConfig[badge.rarity];
          const RarityIcon = rc.icon;
          return (
            <div key={badge.id} className={`p-4 bg-[#1a1f2e] rounded-xl border transition-all duration-300 ${badge.earned ? `${rc.border} hover:shadow-lg hover:shadow-black/20` : 'border-white/[0.06] opacity-50 hover:opacity-70'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{badge.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-white truncate">{badge.name}</h4>
                  <div className="flex items-center gap-1">
                    <RarityIcon size={10} className={rc.color} />
                    <span className={`text-[10px] font-semibold ${rc.color}`}>{rc.label}</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mb-2">{badge.description}</p>
              {!badge.earned && (
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500">{badge.progress}%</span>
                    <span className="text-gray-500">{badge.requirement}</span>
                  </div>
                  <Progress value={badge.progress} className="h-1" />
                </div>
              )}
              <div className="mt-2 flex items-center justify-between">
                {badge.earned ? <span className="text-[10px] text-[#4ADE80] flex items-center gap-1"><CheckCircle2 size={10} />Obtenida</span> : <span className="text-[10px] text-gray-500">🔒 Bloqueada</span>}
                <span className="text-[10px] text-[#4ADE80]">{badge.reward}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────
export default function EducationPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'courses' | 'badges' | 'trivia'>('courses');
  const [refreshKey, setRefreshKey] = useState(0);
  const [view, setView] = useState<{ courseId: string; lesson?: string | null } | null>(null);

  useEffect(() => {
    coursesService.init(COURSES);
  }, []);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const progressMap = coursesService.getAllProgress();
  const hydratedCourses: Course[] = COURSES.map((c) => ({
    ...c,
    status: progressMap[c.id]?.status ?? 'pendiente',
    progress: coursesService.calculateProgressPct(c.id),
    completedLessons: progressMap[c.id]?.completedLessons ?? [],
  }));

  const viewCourse = view ? hydratedCourses.find((c) => c.id === view.courseId) || null : null;

  const completedCount = hydratedCourses.filter((c) => c.status === 'completado').length;
  const totalPoints = coursesService.getEarnedPoints();
  const quizStats = coursesService.getQuizStats();
  const userLevel = 1 + Math.floor(totalPoints / 100);
  const advancedCompleted = hydratedCourses.filter((c) => c.status === 'completado' && c.level === 'avanzado').length;
  const earnedBadgesCount = (completedCount >= 1 ? 1 : 0) + (completedCount >= 3 ? 1 : 0) + (totalPoints >= 500 ? 1 : 0) + (quizStats.perfectQuizzes >= 10 ? 1 : 0) + (advancedCompleted >= 3 ? 1 : 0);

  const filteredCourses = hydratedCourses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel = !selectedLevel || c.level === selectedLevel;
    const matchStatus = !selectedStatus || c.status === selectedStatus;
    return matchSearch && matchLevel && matchStatus;
  });

  const inProgressCourses = hydratedCourses.filter((c) => c.status === 'en_progreso');

  const handleOpenCourse = useCallback((course: Course) => {
    setView({ courseId: course.id });
  }, []);

  const handleStartCourse = useCallback((course: Course) => {
    coursesService.startCourse(course.id);
    refresh();
    const first = coursesService.getFirstIncompleteLesson(course.id);
    setView({ courseId: course.id, lesson: first });
  }, [refresh]);

  const handleOpenLesson = useCallback((courseId: string, lesson: string) => {
    coursesService.startCourse(courseId);
    refresh();
    setView({ courseId, lesson });
  }, [refresh]);

  const handleGoToLesson = useCallback((lesson: string) => {
    setView((prev) => (prev ? { ...prev, lesson } : prev));
  }, []);

  const handleCourseCompleted = useCallback(() => {
    setView((prev) => (prev ? { courseId: prev.courseId } : prev));
    refresh();
  }, [refresh]);

  if (view && viewCourse) {
    if (view.lesson) {
      return (
        <LessonViewer
          course={viewCourse}
          lessonTitle={view.lesson}
          onBack={() => setView({ courseId: viewCourse.id })}
          onGoToLesson={handleGoToLesson}
          onCourseCompleted={handleCourseCompleted}
          onRefresh={refresh}
        />
      );
    }
    return (
      <CourseDetail
        course={viewCourse}
        onBack={() => setView(null)}
        onStart={() => handleStartCourse(viewCourse)}
        onOpenLesson={(lesson) => handleOpenLesson(viewCourse.id, lesson)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* Header */}
      <header className="sticky top-16 z-40 bg-[#0B0F14]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button onClick={() => setLocation('/')} className="p-2 hover:bg-[rgba(74,222,128,0.1)] rounded-lg transition-colors"><ChevronLeft size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4ADE80] to-[#00D4FF] flex items-center justify-center"><GraduationCap size={18} className="text-[#0B0F14]" /></div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold leading-tight">EcoAcademy</h1>
              <p className="text-[10px] text-gray-500">Centro de Educación Ambiental</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d2818] via-[#0B0F14] to-[#0a1628] border border-white/[0.06] p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(74,222,128,0.06)] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[rgba(0,212,255,0.04)] rounded-full blur-3xl" />
          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-full px-3 py-1 mb-4">
                <GraduationCap size={14} className="text-[#4ADE80]" />
                <span className="text-[11px] text-[#4ADE80] font-medium">Tu plataforma de aprendizaje ambiental</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Aprende a <span className="text-[#4ADE80]">proteger</span> el <span className="text-[#00D4FF]">planeta</span>
              </h1>
              <p className="text-sm text-gray-400 max-w-lg mb-6">Cursos diseñados por expertos para convertirte en un agente de cambio ambiental. Aprende a tu ritmo, gana insignias y comparte tu conocimiento.</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/15 flex items-center justify-center"><Trophy size={18} className="text-[#4ADE80]" /></div>
                  <div><p className="text-lg font-bold text-[#4ADE80]">Nv. {userLevel}</p><p className="text-[10px] text-gray-500">Nivel actual</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/15 flex items-center justify-center"><CheckCircle2 size={18} className="text-[#00D4FF]" /></div>
                  <div><p className="text-lg font-bold text-[#00D4FF]">{completedCount}/{hydratedCourses.length}</p><p className="text-[10px] text-gray-500">Cursos completados</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/15 flex items-center justify-center"><Zap size={18} className="text-[#FBBF24]" /></div>
                  <div><p className="text-lg font-bold text-[#FBBF24]">{totalPoints}</p><p className="text-[10px] text-gray-500">EcoPuntos</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/15 flex items-center justify-center"><Award size={18} className="text-[#A78BFA]" /></div>
                  <div><p className="text-lg font-bold text-[#A78BFA]">{earnedBadgesCount}</p><p className="text-[10px] text-gray-500">Insignias</p></div>
                </div>
              </div>
            </div>
            {/* EcoTip */}
            <div className="hidden lg:block">
              <EcoTipsCarousel />
            </div>
          </div>
        </div>

        {/* Learning Stats */}
        <LearningStats courses={hydratedCourses} />

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1a1f2e] p-1 rounded-xl border border-white/[0.06] w-fit">
          {([ { id: 'courses' as const, label: 'Cursos', icon: BookOpen }, { id: 'badges' as const, label: 'Insignias', icon: Award }, { id: 'trivia' as const, label: 'Datos Curiosos', icon: Brain } ]).map(tab => {
            const Icon = tab.icon;
            return <button key={tab.id} onClick={() => setActiveSection(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === tab.id ? 'bg-[#4ADE80] text-[#0B0F14]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}><Icon size={14} />{tab.label}</button>;
          })}
        </div>

        {/* COURSES */}
        {activeSection === 'courses' && (
          <>
            {/* EcoTips for mobile */}
            <div className="lg:hidden"><EcoTipsCarousel /></div>

            {/* Search & Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Buscar cursos, categorías..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-11 bg-[#1a1f2e] border-white/[0.08] h-11 text-sm focus:border-[#4ADE80]/50 focus:ring-1 focus:ring-[#4ADE80]/20 focus:outline-none transition-colors" />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex gap-1.5 items-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mr-1">Nivel</span>
                  {[
                    { id: null, label: 'Todos' }, { id: 'principiante', label: '🌱 Princ.' }, { id: 'intermedio', label: '🌿 Inter.' }, { id: 'avanzado', label: '🌳 Avan.' },
                  ].map(l => (
                    <button key={l.id ?? 'a'} onClick={() => setSelectedLevel(l.id)} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${selectedLevel === l.id ? 'bg-[#4ADE80] text-[#0B0F14]' : 'bg-[#1a1f2e] border border-white/[0.06] text-gray-400 hover:text-white'}`}>{l.label}</button>
                  ))}
                </div>
                <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
                <div className="flex gap-1.5 items-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mr-1">Estado</span>
                  {[
                    { id: null, label: 'Todos' }, { id: 'completado', label: '✅ Completado' }, { id: 'en_progreso', label: '▶️ En progreso' }, { id: 'pendiente', label: '⏳ Pendiente' },
                  ].map(s => (
                    <button key={s.id ?? 'a'} onClick={() => setSelectedStatus(s.id)} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${selectedStatus === s.id ? 'bg-[#00D4FF] text-[#0B0F14]' : 'bg-[#1a1f2e] border border-white/[0.06] text-gray-400 hover:text-white'}`}>{s.label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended */}
            {!selectedLevel && !selectedStatus && !searchQuery && inProgressCourses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3"><Sparkles size={16} className="text-[#FBBF24]" /><h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Continúa Aprendiendo</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inProgressCourses.map(c => <CourseCard key={c.id} course={c} onClick={() => handleOpenCourse(c)} />)}
                </div>
              </div>
            )}

            {/* All Courses */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">{selectedLevel || selectedStatus || searchQuery ? `Resultados (${filteredCourses.length})` : 'Catálogo Completo'}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map(c => <CourseCard key={c.id} course={c} onClick={() => handleOpenCourse(c)} />)}
              </div>
              {filteredCourses.length === 0 && <div className="text-center py-16"><div className="text-4xl mb-3">🔍</div><p className="text-gray-400">No se encontraron cursos</p></div>}
            </div>

            {/* Quiz */}
            <QuizSection onStatsChange={refresh} />
          </>
        )}

        {activeSection === 'badges' && (
          <AchievementsSection
            completedCount={completedCount}
            advancedCompleted={advancedCompleted}
            totalPoints={totalPoints}
            perfectQuizzes={quizStats.perfectQuizzes}
          />
        )}
        {activeSection === 'trivia' && <TriviaSection />}
      </main>
    </div>
  );
}
