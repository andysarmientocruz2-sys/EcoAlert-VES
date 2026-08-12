/**
 * User Service
 * Gestiona datos del usuario en Firestore
 * Maneja puntos, niveles, insignias y misiones
 */

import {
  getDocument,
  setDocument,
  updateDocument,
  COLLECTIONS,
  type UserData,
} from '@/firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  ecoPoints: number;
  level: number;
  achievements: string[];
  reportsCount: number;
  createdAt: Date;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  dueDate: Date;
  category: 'daily' | 'weekly' | 'monthly';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface UserStats {
  level: number;
  ecoPoints: number;
  reportsCount: number;
  achievements: string[];
}

class UserService {
  /**
   * Obtener datos del usuario desde Firestore
   */
  async getUserData(uid: string): Promise<User | null> {
    try {
      const userData = await getDocument<UserData>(
        COLLECTIONS.USERS,
        uid
      );

      if (!userData) {
        return null;
      }

      const createdAt = (userData.createdAt as unknown as Timestamp).toDate
        ? (userData.createdAt as unknown as Timestamp).toDate()
        : userData.createdAt instanceof Date
        ? userData.createdAt
        : new Date();

      return {
        uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        ecoPoints: userData.ecoPoints,
        level: userData.level,
        achievements: userData.achievements,
        reportsCount: userData.reportsCount || 0,
        createdAt,
      } as User;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Crear nuevo documento de usuario en Firestore
   */
  async createUserData(user: User): Promise<void> {
    try {
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        ecoPoints: user.ecoPoints,
        level: user.level,
        achievements: user.achievements,
        reportsCount: user.reportsCount,
        createdAt: Timestamp.fromDate(user.createdAt),
        updatedAt: Timestamp.now(),
      };

      await setDocument(COLLECTIONS.USERS, user.uid, userData);
    } catch (error) {
      console.error('Error creating user data:', error);
      throw error;
    }
  }

  /**
   * Actualizar datos del usuario en Firestore
   */
  async updateUserData(
    uid: string,
    updates: Partial<User>
  ): Promise<void> {
    try {
      const updateData: Record<string, unknown> = {
        updatedAt: Timestamp.now(),
      };

      // Solo incluir campos que fueron actualizados
      if (updates.ecoPoints !== undefined) updateData.ecoPoints = updates.ecoPoints;
      if (updates.level !== undefined) updateData.level = updates.level;
      if (updates.achievements !== undefined) updateData.achievements = updates.achievements;
      if (updates.reportsCount !== undefined) updateData.reportsCount = updates.reportsCount;
      if (updates.displayName !== undefined) updateData.displayName = updates.displayName;
      if (updates.photoURL !== undefined) updateData.photoURL = updates.photoURL;

      await updateDocument(COLLECTIONS.USERS, uid, updateData as Partial<UserData>);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }

  /**
   * Agregar puntos al usuario
   */
  async addPoints(uid: string, points: number): Promise<void> {
    try {
      const user = await this.getUserData(uid);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const newPoints = user.ecoPoints + points;
      const newLevel = this.calculateLevel(newPoints);

      await this.updateUserData(uid, {
        ecoPoints: newPoints,
        level: newLevel,
      });
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    }
  }

  /**
   * Desbloquear logro/insignia
   */
  async unlockAchievement(uid: string, achievementId: string): Promise<void> {
    try {
      const user = await this.getUserData(uid);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      if (!user.achievements.includes(achievementId)) {
        const updatedAchievements = [...user.achievements, achievementId];
        await this.updateUserData(uid, {
          achievements: updatedAchievements,
        });
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  }

  /**
   * Incrementar contador de reportes
   */
  async incrementReportCount(uid: string): Promise<void> {
    try {
      const user = await this.getUserData(uid);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      await this.updateUserData(uid, {
        reportsCount: user.reportsCount + 1,
      });
    } catch (error) {
      console.error('Error incrementing report count:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas del usuario
   */
  async getUserStats(uid: string): Promise<UserStats | null> {
    try {
      const user = await this.getUserData(uid);
      if (!user) {
        return null;
      }

      return {
        level: user.level,
        ecoPoints: user.ecoPoints,
        reportsCount: user.reportsCount,
        achievements: user.achievements,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }

  /**
   * Calcular nivel basado en puntos
   * Fórmula: nivel = 1 + floor(puntos / 100)
   */
  private calculateLevel(points: number): number {
    return 1 + Math.floor(points / 100);
  }

  /**
   * Obtener progreso hacia el siguiente nivel
   */
  getProgressToNextLevel(ecoPoints: number): {
    current: number;
    next: number;
    progress: number;
  } {
    const currentLevel = 1 + Math.floor(ecoPoints / 100);
    const pointsForCurrentLevel = (currentLevel - 1) * 100;
    const pointsForNextLevel = currentLevel * 100;
    const progressInLevel = ecoPoints - pointsForCurrentLevel;
    const pointsNeededForLevel = pointsForNextLevel - pointsForCurrentLevel;

    return {
      current: currentLevel,
      next: currentLevel + 1,
      progress: Math.round((progressInLevel / pointsNeededForLevel) * 100),
    };
  }
}

// Exportar instancia única
export const userService = new UserService();

export default userService;
