/**
 * Achievements Service
 * Sistema completo de logros y insignias
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  points: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

const ACHIEVEMENTS_KEY = 'ecoalert_achievements';

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_report',
    name: '🌱 Primer Reporte',
    description: 'Envía tu primer reporte de contaminación',
    icon: '🌱',
    condition: 'Reportar 1 problema',
    points: 50,
  },
  {
    id: 'recycler',
    name: '♻️ Reciclador',
    description: 'Realiza 5 reportes sobre reciclaje',
    icon: '♻️',
    condition: 'Reportar 5 problemas de reciclaje',
    points: 100,
  },
  {
    id: 'responsible_citizen',
    name: '🏆 Ciudadano Responsable',
    description: 'Realiza 10 reportes',
    icon: '🏆',
    condition: 'Reportar 10 problemas',
    points: 150,
  },
  {
    id: 'environmental_protector',
    name: '🌎 Protector Ambiental',
    description: 'Alcanza 500 EcoPuntos',
    icon: '🌎',
    condition: 'Acumular 500 EcoPuntos',
    points: 200,
  },
  {
    id: 'eco_influencer',
    name: '🌳 Eco Influencer',
    description: 'Completa 10 misiones',
    icon: '🌳',
    condition: 'Completar 10 misiones',
    points: 250,
  },
  {
    id: 'green_guardian',
    name: '🥇 Guardián Verde',
    description: 'Alcanza el nivel 5',
    icon: '🥇',
    condition: 'Alcanzar nivel 5',
    points: 300,
  },
  {
    id: 'educator',
    name: '📚 Educador Ambiental',
    description: 'Lee 5 artículos educativos',
    icon: '📚',
    condition: 'Leer 5 artículos',
    points: 100,
  },
  {
    id: 'daily_champion',
    name: '⚡ Campeón Diario',
    description: 'Completa todas las misiones diarias durante 7 días',
    icon: '⚡',
    condition: 'Completar misiones 7 días seguidos',
    points: 200,
  },
  {
    id: 'map_explorer',
    name: '🗺️ Explorador del Mapa',
    description: 'Visualiza el mapa 10 veces',
    icon: '🗺️',
    condition: 'Acceder al mapa 10 veces',
    points: 75,
  },
  {
    id: 'community_leader',
    name: '👑 Líder Comunitario',
    description: 'Obtén 5 insignias',
    icon: '👑',
    condition: 'Desbloquear 5 insignias',
    points: 400,
  },
];

class AchievementsService {
  /**
   * Obtener todos los logros del usuario
   */
  getUserAchievements(userId: string): Achievement[] {
    const stored = localStorage.getItem(`${ACHIEVEMENTS_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }

    // Inicializar con logros por defecto
    const achievements = DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a }));
    this.saveAchievements(userId, achievements);
    return achievements;
  }

  /**
   * Obtener logros desbloqueados
   */
  getUnlockedAchievements(userId: string): Achievement[] {
    const achievements = this.getUserAchievements(userId);
    return achievements.filter((a) => a.unlockedAt);
  }

  /**
   * Obtener logros bloqueados
   */
  getLockedAchievements(userId: string): Achievement[] {
    const achievements = this.getUserAchievements(userId);
    return achievements.filter((a) => !a.unlockedAt);
  }

  /**
   * Desbloquear logro
   */
  unlockAchievement(userId: string, achievementId: string): Achievement | null {
    const achievements = this.getUserAchievements(userId);
    const achievement = achievements.find((a) => a.id === achievementId);

    if (achievement && !achievement.unlockedAt) {
      achievement.unlockedAt = new Date();
      this.saveAchievements(userId, achievements);
      return achievement;
    }

    return null;
  }

  /**
   * Actualizar progreso de logro
   */
  updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number,
    maxProgress: number
  ): Achievement | null {
    const achievements = this.getUserAchievements(userId);
    const achievement = achievements.find((a) => a.id === achievementId);

    if (achievement) {
      achievement.progress = progress;
      achievement.maxProgress = maxProgress;

      // Auto-desbloquear si se alcanza el máximo
      if (progress >= maxProgress && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date();
      }

      this.saveAchievements(userId, achievements);
      return achievement;
    }

    return null;
  }

  /**
   * Obtener logro por ID
   */
  getAchievementById(userId: string, achievementId: string): Achievement | null {
    const achievements = this.getUserAchievements(userId);
    return achievements.find((a) => a.id === achievementId) || null;
  }

  /**
   * Obtener estadísticas de logros
   */
  getAchievementStats(userId: string) {
    const achievements = this.getUserAchievements(userId);
    const unlocked = achievements.filter((a) => a.unlockedAt);
    const totalPoints = unlocked.reduce((sum, a) => sum + a.points, 0);

    return {
      total: achievements.length,
      unlocked: unlocked.length,
      locked: achievements.length - unlocked.length,
      totalPoints,
      percentage: Math.round((unlocked.length / achievements.length) * 100),
    };
  }

  // ===== PRIVATE METHODS =====

  private saveAchievements(userId: string, achievements: Achievement[]): void {
    localStorage.setItem(`${ACHIEVEMENTS_KEY}_${userId}`, JSON.stringify(achievements));
  }
}

export const achievementsService = new AchievementsService();
