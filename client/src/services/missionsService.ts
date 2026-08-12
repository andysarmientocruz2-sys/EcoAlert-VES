/**
 * Missions Service
 * Sistema de misiones diarias
 */

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  emoji: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  dueDate: Date;
  completed: boolean;
}

class MissionsService {
  /**
   * Misiones disponibles
   */
  static readonly AVAILABLE_MISSIONS: Omit<Mission, 'dueDate' | 'completed'>[] = [
    {
      id: 'daily_report',
      title: 'Reporta Basura',
      description: 'Realiza un reporte de basura hoy',
      reward: 150,
      emoji: '🗑️',
      category: 'reporting',
      difficulty: 'easy'
    },
    {
      id: 'learn_recycling',
      title: 'Aprende sobre Reciclaje',
      description: 'Lee un artículo sobre reciclaje en la biblioteca',
      reward: 100,
      emoji: '♻️',
      category: 'education',
      difficulty: 'easy'
    },
    {
      id: 'read_article',
      title: 'Lee un Artículo',
      description: 'Lee un artículo ambiental completo',
      reward: 80,
      emoji: '📖',
      category: 'education',
      difficulty: 'easy'
    },
    {
      id: 'share_campaign',
      title: 'Comparte una Campaña',
      description: 'Comparte una campaña ambiental en redes sociales',
      reward: 120,
      emoji: '📢',
      category: 'social',
      difficulty: 'medium'
    },
    {
      id: 'water_report',
      title: 'Protege el Agua',
      description: 'Reporta un caso de agua contaminada',
      reward: 200,
      emoji: '💧',
      category: 'reporting',
      difficulty: 'hard'
    },
    {
      id: 'air_report',
      title: 'Protege el Aire',
      description: 'Reporta un caso de contaminación del aire',
      reward: 200,
      emoji: '🌬️',
      category: 'reporting',
      difficulty: 'hard'
    },
    {
      id: 'three_reports',
      title: 'Triple Impacto',
      description: 'Realiza 3 reportes en un día',
      reward: 300,
      emoji: '🎯',
      category: 'reporting',
      difficulty: 'hard'
    },
    {
      id: 'invite_friend',
      title: 'Invita un Amigo',
      description: 'Invita a un amigo a unirse a EcoAlert VES',
      reward: 250,
      emoji: '👥',
      category: 'social',
      difficulty: 'medium'
    },
    {
      id: 'complete_profile',
      title: 'Completa tu Perfil',
      description: 'Llena todos los datos de tu perfil',
      reward: 50,
      emoji: '👤',
      category: 'profile',
      difficulty: 'easy'
    },
    {
      id: 'environmental_course',
      title: 'Curso Ambiental',
      description: 'Completa un curso ambiental en la biblioteca',
      reward: 300,
      emoji: '🎓',
      category: 'education',
      difficulty: 'hard'
    }
  ];

  /**
   * Generar misiones diarias
   */
  static generateDailyMissions(completedMissions: string[] = []): Mission[] {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Seleccionar 3-4 misiones aleatorias
    const count = 3 + Math.floor(Math.random() * 2);
    const shuffled = [...this.AVAILABLE_MISSIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return selected.map((mission) => ({
      ...mission,
      dueDate: today,
      completed: completedMissions.includes(mission.id)
    }));
  }

  /**
   * Obtener misiones activas
   */
  static getActiveMissions(missions: Mission[]): Mission[] {
    const now = new Date();
    return missions.filter((m) => m.dueDate > now && !m.completed);
  }

  /**
   * Obtener misiones completadas
   */
  static getCompletedMissions(missions: Mission[]): Mission[] {
    return missions.filter((m) => m.completed);
  }

  /**
   * Marcar misión como completada
   */
  static completeMission(missions: Mission[], missionId: string): Mission[] {
    return missions.map((m) =>
      m.id === missionId ? { ...m, completed: true } : m
    );
  }

  /**
   * Calcular recompensa total de misiones completadas
   */
  static calculateTotalReward(missions: Mission[]): number {
    return missions
      .filter((m) => m.completed)
      .reduce((total, m) => total + m.reward, 0);
  }

  /**
   * Obtener misiones por categoría
   */
  static getMissionsByCategory(missions: Mission[], category: string): Mission[] {
    return missions.filter((m) => m.category === category);
  }

  /**
   * Obtener misiones por dificultad
   */
  static getMissionsByDifficulty(
    missions: Mission[],
    difficulty: 'easy' | 'medium' | 'hard'
  ): Mission[] {
    return missions.filter((m) => m.difficulty === difficulty);
  }

  /**
   * Verificar si hay misiones vencidas
   */
  static getExpiredMissions(missions: Mission[]): Mission[] {
    const now = new Date();
    return missions.filter((m) => m.dueDate < now && !m.completed);
  }

  /**
   * Obtener progreso de misiones
   */
  static getMissionsProgress(missions: Mission[]): {
    total: number;
    completed: number;
    active: number;
    expired: number;
    progress: number;
  } {
    const completed = this.getCompletedMissions(missions).length;
    const active = this.getActiveMissions(missions).length;
    const expired = this.getExpiredMissions(missions).length;
    const total = missions.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      active,
      expired,
      progress
    };
  }

  /**
   * Sugerir siguiente misión
   */
  static suggestNextMission(missions: Mission[]): Mission | null {
    const active = this.getActiveMissions(missions);
    if (active.length === 0) return null;

    // Priorizar misiones de dificultad media/alta
    const hardMissions = active.filter((m) => m.difficulty !== 'easy');
    return hardMissions.length > 0 ? hardMissions[0] : active[0];
  }

  /**
   * Obtener misiones próximas a vencer
   */
  static getUrgentMissions(missions: Mission[], hoursUntilExpiry: number = 6): Mission[] {
    const now = new Date();
    const threshold = new Date(now.getTime() + hoursUntilExpiry * 60 * 60 * 1000);

    return missions.filter(
      (m) => m.dueDate <= threshold && m.dueDate > now && !m.completed
    );
  }
}

export default MissionsService;
