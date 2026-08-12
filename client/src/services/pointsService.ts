/**
 * Points System Service
 * Gestión de puntos, niveles e insignias
 */

interface PointsActivity {
  type: string;
  points: number;
  description: string;
  date: Date;
}

interface Level {
  id: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  emoji: string;
  color: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: string;
  unlockedDate?: Date;
}

class PointsService {
  /**
   * Niveles del sistema
   */
  static readonly LEVELS: Level[] = [
    { id: 1, name: 'Semilla', minPoints: 0, maxPoints: 100, emoji: '🌱', color: '#90EE90' },
    { id: 2, name: 'Brote', minPoints: 100, maxPoints: 250, emoji: '🌿', color: '#98FB98' },
    { id: 3, name: 'Árbol', minPoints: 250, maxPoints: 500, emoji: '🌳', color: '#00FF00' },
    { id: 4, name: 'Bosque', minPoints: 500, maxPoints: 1000, emoji: '🌲', color: '#228B22' },
    { id: 5, name: 'Guardián Verde', minPoints: 1000, maxPoints: 2000, emoji: '🛡️', color: '#006400' },
    { id: 6, name: 'EcoLeyenda', minPoints: 2000, maxPoints: Infinity, emoji: '👑', color: '#FFD700' }
  ];

  /**
   * Insignias disponibles
   */
  static readonly BADGES: Badge[] = [
    {
      id: 'first_report',
      name: 'Primer Reporte',
      description: 'Realiza tu primer reporte',
      emoji: '🎯',
      condition: 'reports >= 1'
    },
    {
      id: 'ten_reports',
      name: '10 Reportes',
      description: 'Realiza 10 reportes',
      emoji: '🔟',
      condition: 'reports >= 10'
    },
    {
      id: 'fifty_reports',
      name: '50 Reportes',
      description: 'Realiza 50 reportes',
      emoji: '5️⃣',
      condition: 'reports >= 50'
    },
    {
      id: 'hundred_reports',
      name: '100 Reportes',
      description: 'Realiza 100 reportes',
      emoji: '💯',
      condition: 'reports >= 100'
    },
    {
      id: 'recycler',
      name: 'Reciclador',
      description: 'Reporta 5 casos de basura',
      emoji: '♻️',
      condition: 'trash_reports >= 5'
    },
    {
      id: 'water_protector',
      name: 'Protector del Agua',
      description: 'Reporta 5 casos de agua contaminada',
      emoji: '💧',
      condition: 'water_reports >= 5'
    },
    {
      id: 'air_protector',
      name: 'Protector del Aire',
      description: 'Reporta 5 casos de quema',
      emoji: '🌬️',
      condition: 'burning_reports >= 5'
    },
    {
      id: 'green_citizen',
      name: 'Ciudadano Verde',
      description: 'Acumula 500 puntos',
      emoji: '🌍',
      condition: 'points >= 500'
    },
    {
      id: 'eco_influencer',
      name: 'Eco Influencer',
      description: 'Obtén 1000 likes en tus reportes',
      emoji: '⭐',
      condition: 'total_likes >= 1000'
    },
    {
      id: 'volunteer',
      name: 'Voluntario',
      description: 'Participa en 5 misiones',
      emoji: '🤝',
      condition: 'missions_completed >= 5'
    }
  ];

  /**
   * Actividades que generan puntos
   */
  static readonly POINT_ACTIVITIES: Record<string, number> = {
    first_report: 50,
    report_approved: 100,
    recycling: 30,
    campaign: 200,
    environmental_course: 60,
    share_platform: 40,
    mission_completed: 150,
    badge_unlocked: 200,
    level_up: 300,
    report_like: 5,
    report_comment: 10
  };

  /**
   * Calcular nivel actual basado en puntos
   */
  static calculateLevel(points: number): Level {
    return this.LEVELS.find(
      (level) => points >= level.minPoints && points < level.maxPoints
    ) || this.LEVELS[this.LEVELS.length - 1];
  }

  /**
   * Obtener progreso al siguiente nivel
   */
  static getProgressToNextLevel(points: number): {
    currentLevel: Level;
    nextLevel: Level | null;
    progress: number;
    pointsNeeded: number;
  } {
    const currentLevel = this.calculateLevel(points);
    const currentLevelIndex = this.LEVELS.findIndex((l) => l.id === currentLevel.id);
    const nextLevel = currentLevelIndex < this.LEVELS.length - 1 ? this.LEVELS[currentLevelIndex + 1] : null;

    if (!nextLevel) {
      return {
        currentLevel,
        nextLevel: null,
        progress: 100,
        pointsNeeded: 0
      };
    }

    const pointsInCurrentLevel = points - currentLevel.minPoints;
    const pointsNeededForLevel = nextLevel.minPoints - currentLevel.minPoints;
    const progress = (pointsInCurrentLevel / pointsNeededForLevel) * 100;
    const pointsNeeded = nextLevel.minPoints - points;

    return {
      currentLevel,
      nextLevel,
      progress: Math.min(progress, 100),
      pointsNeeded: Math.max(pointsNeeded, 0)
    };
  }

  /**
   * Agregar puntos por actividad
   */
  static addPoints(activity: string, multiplier: number = 1): number {
    const basePoints = this.POINT_ACTIVITIES[activity] || 0;
    return Math.floor(basePoints * multiplier);
  }

  /**
   * Verificar si se debe desbloquear insignia
   */
  static checkBadgeUnlock(
    userStats: Record<string, number>,
    unlockedBadges: string[]
  ): Badge[] {
    const newBadges: Badge[] = [];

    for (const badge of this.BADGES) {
      if (unlockedBadges.includes(badge.id)) continue;

      if (this._evaluateCondition(badge.condition, userStats)) {
        newBadges.push(badge);
      }
    }

    return newBadges;
  }

  /**
   * Evaluar condición de insignia
   */
  private static _evaluateCondition(condition: string, stats: Record<string, number>): boolean {
    // Ejemplo: "reports >= 1"
    const [key, operator, value] = condition.split(' ');
    const statValue = stats[key] || 0;
    const targetValue = parseInt(value);

    switch (operator) {
      case '>=':
        return statValue >= targetValue;
      case '<=':
        return statValue <= targetValue;
      case '===':
        return statValue === targetValue;
      case '>':
        return statValue > targetValue;
      case '<':
        return statValue < targetValue;
      default:
        return false;
    }
  }

  /**
   * Obtener todas las insignias desbloqueadas
   */
  static getUnlockedBadges(unlockedIds: string[]): Badge[] {
    return this.BADGES.filter((badge) => unlockedIds.includes(badge.id));
  }

  /**
   * Obtener insignias bloqueadas
   */
  static getLockedBadges(unlockedIds: string[]): Badge[] {
    return this.BADGES.filter((badge) => !unlockedIds.includes(badge.id));
  }

  /**
   * Calcular progreso general
   */
  static calculateUserProgress(points: number, reports: number, badges: string[]): {
    level: Level;
    levelProgress: number;
    totalBadges: number;
    unlockedBadges: number;
    overallProgress: number;
  } {
    const levelInfo = this.getProgressToNextLevel(points);
    const overallProgress = (badges.length / this.BADGES.length) * 100;

    return {
      level: levelInfo.currentLevel,
      levelProgress: levelInfo.progress,
      totalBadges: this.BADGES.length,
      unlockedBadges: badges.length,
      overallProgress
    };
  }
}

export default PointsService;
