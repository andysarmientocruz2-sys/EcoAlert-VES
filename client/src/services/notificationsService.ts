/**
 * Notifications Service
 * Sistema completo de notificaciones
 */

export interface Notification {
  id: string;
  type: 'report' | 'mission' | 'achievement' | 'level' | 'campaign' | 'news';
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const NOTIFICATIONS_KEY = 'ecoalert_notifications';

class NotificationsService {
  /**
   * Obtener todas las notificaciones del usuario
   */
  getNotifications(userId: string): Notification[] {
    const stored = localStorage.getItem(`${NOTIFICATIONS_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
    }
    return [];
  }

  /**
   * Obtener notificaciones no leídas
   */
  getUnreadNotifications(userId: string): Notification[] {
    return this.getNotifications(userId).filter((n) => !n.read);
  }

  /**
   * Obtener cantidad de notificaciones no leídas
   */
  getUnreadCount(userId: string): number {
    return this.getUnreadNotifications(userId).length;
  }

  /**
   * Crear nueva notificación
   */
  addNotification(
    userId: string,
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ): Notification {
    const notifications = this.getNotifications(userId);
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    notifications.unshift(newNotification);
    this.saveNotifications(userId, notifications);
    return newNotification;
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(userId: string, notificationId: string): void {
    const notifications = this.getNotifications(userId);
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications(userId, notifications);
    }
  }

  /**
   * Marcar todas como leídas
   */
  markAllAsRead(userId: string): void {
    const notifications = this.getNotifications(userId);
    notifications.forEach((n) => {
      n.read = true;
    });
    this.saveNotifications(userId, notifications);
  }

  /**
   * Eliminar notificación
   */
  deleteNotification(userId: string, notificationId: string): void {
    const notifications = this.getNotifications(userId).filter((n) => n.id !== notificationId);
    this.saveNotifications(userId, notifications);
  }

  /**
   * Limpiar todas las notificaciones
   */
  clearAll(userId: string): void {
    localStorage.removeItem(`${NOTIFICATIONS_KEY}_${userId}`);
  }

  /**
   * Crear notificaciones de ejemplo
   */
  createSampleNotifications(userId: string): void {
    const samples = [
      {
        type: 'report' as const,
        title: 'Reporte Enviado',
        message: 'Tu reporte sobre contaminación ha sido registrado exitosamente',
        icon: '📍',
        actionUrl: '/reports',
      },
      {
        type: 'mission' as const,
        title: 'Misión Completada',
        message: 'Completaste la misión "Leer un artículo ambiental"',
        icon: '✅',
        actionUrl: '/dashboard',
      },
      {
        type: 'achievement' as const,
        title: 'Insignia Desbloqueada',
        message: 'Obtuviste la insignia "Ciudadano Responsable"',
        icon: '🏆',
        actionUrl: '/profile',
      },
      {
        type: 'level' as const,
        title: 'Subiste de Nivel',
        message: 'Felicidades, alcanzaste el nivel 3 - Protector Ambiental',
        icon: '⬆️',
        actionUrl: '/profile',
      },
      {
        type: 'campaign' as const,
        title: 'Nueva Campaña',
        message: 'Participa en la campaña de limpieza comunitaria este fin de semana',
        icon: '📢',
        actionUrl: '/news',
      },
      {
        type: 'news' as const,
        title: 'Noticia Importante',
        message: 'Villa El Salvador alcanzó 5,000 árboles plantados',
        icon: '📰',
        actionUrl: '/news',
      },
    ];

    samples.forEach((sample) => {
      this.addNotification(userId, sample);
    });
  }

  // ===== PRIVATE METHODS =====

  private saveNotifications(userId: string, notifications: Notification[]): void {
    localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(notifications));
  }
}

export const notificationsService = new NotificationsService();
