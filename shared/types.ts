export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  district?: string;
  age?: number;
  ecoPoints: number;
  level: number;
  reportsCount: number;
  badges: string[];
  joinedAt: string;
  role?: 'citizen' | 'admin';
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: PollutionType;
  location: string;
  lat?: number;
  lng?: number;
  image?: string;
  date: string;
  status: ReportStatus;
  severity: Severity;
  aiAnalysis?: string;
  points: number;
  userId?: string;
}

export type PollutionType = 'basura' | 'agua' | 'aire' | 'ruido' | 'quema' | 'deforestacion' | 'otro';

export type ReportStatus = 'pending' | 'analyzed' | 'in_review' | 'resolved' | 'rejected';

export type Severity = 'low' | 'medium' | 'high' | 'critical' | 'baja' | 'media' | 'alta' | 'critica';

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: 'report' | 'education' | 'social' | 'profile';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  progress: number;
  total: number;
  completed: boolean;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface RankingEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  badges: string[];
  reports: number;
  position: number;
  trend?: 'up' | 'down' | 'same';
  trendChange?: number;
}
