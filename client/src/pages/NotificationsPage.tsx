import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Trash2, Check, Bell, BellOff, Target, Trophy, Newspaper, Star, AlertTriangle } from 'lucide-react';
import { authService } from '@/services/authService';
import { notificationsService, Notification } from '@/services/notificationsService';
import { toast } from 'sonner';

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  report: { icon: AlertTriangle, color: 'text-info', bg: 'bg-info/10' },
  mission: { icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
  achievement: { icon: Trophy, color: 'text-warning', bg: 'bg-warning/10' },
  level: { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  campaign: { icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  news: { icon: Newspaper, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  default: { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted' },
};

export default function NotificationsPage() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const cu = authService.getCurrentUser();
    if (!cu) { setLocation('/login'); return; }
    setUser(cu);
    let n = notificationsService.getNotifications(cu.uid);
    if (n.length === 0) { notificationsService.createSampleNotifications(cu.uid); n = notificationsService.getNotifications(cu.uid); }
    setNotifications(n);
  }, [setLocation]);

  const refresh = () => { if (user) setNotifications(notificationsService.getNotifications(user.uid)); };

  const markRead = (id: string) => { if (user) { notificationsService.markAsRead(user.uid, id); refresh(); } };
  const markAll = () => { if (user) { notificationsService.markAllAsRead(user.uid); refresh(); toast.success('Todas marcadas como leídas'); } };
  const remove = (id: string) => { if (user) { notificationsService.deleteNotification(user.uid, id); refresh(); toast.success('Eliminada'); } };
  const clearAll = () => { if (user) { notificationsService.clearAll(user.uid); setNotifications([]); toast.success('Todas eliminadas'); } };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Cargando...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="eco-page-header">
        <div className="eco-page-content flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Notificaciones</h1>
              <p className="text-muted-foreground text-sm">{unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}</p>
            </div>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button onClick={markAll} variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Check size={14} /> Marcar todo
                </Button>
              )}
              <Button onClick={clearAll} variant="outline" size="sm" className="gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10">
                <Trash2 size={14} /> Limpiar
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="eco-page-content max-w-3xl">
        {notifications.length === 0 ? (
          <Card className="p-12 bg-card border-border text-center">
            <BellOff size={40} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="font-semibold">No hay notificaciones</p>
            <p className="text-sm text-muted-foreground mt-1">Cuando realices acciones, verás las notificaciones aquí</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.default;
              const Icon = cfg.icon;
              return (
                <Card key={n.id} className={`p-4 bg-card border-border transition-all ${
                  !n.read ? 'border-l-2 border-l-primary ring-1 ring-primary/10' : ''
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{n.title}</p>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                      <p className="text-[11px] text-muted-foreground/60 mt-1">
                        {new Date(n.timestamp).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {!n.read && (
                        <Button onClick={() => markRead(n.id)} variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80">
                          <Check size={14} />
                        </Button>
                      )}
                      {n.actionUrl && (
                        <Button onClick={() => setLocation(n.actionUrl!)} variant="ghost" size="sm" className="text-xs text-info hover:text-info/80">
                          Ver
                        </Button>
                      )}
                      <Button onClick={() => remove(n.id)} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
