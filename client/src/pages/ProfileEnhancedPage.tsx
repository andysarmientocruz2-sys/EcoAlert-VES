import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import PointsService from '@/services/pointsService';
import { authService } from '@/services/authService';
import {
  Mail, Phone, MapPin, Cake, Trophy, Zap, Target, Star, Edit3,
  Save, X, TrendingUp, BookOpen, Award, Shield, Calendar, ChevronRight,
} from 'lucide-react';

const MOCK_ACTIVITY = [
  { text: 'Reportó basura en Parque Central', date: 'Hace 2h', icon: Target },
  { text: 'Completó curso "Reciclaje Básico"', date: 'Ayer', icon: BookOpen },
  { text: 'Desbloqueó insignia "Primer Reporte"', date: 'Hace 3d', icon: Award },
];

export default function ProfileEnhancedPage() {
  const [, setLocation] = useLocation();
  const currentUser = authService.getCurrentUser();

  const [user, setUser] = useState({
    name: currentUser?.displayName || 'Juan Pérez',
    email: currentUser?.email || 'juan@ecoalert.com',
    phone: '+51 999 888 777',
    district: 'Villa El Salvador',
    age: 28,
    joinDate: new Date('2024-01-15'),
    points: 1250,
    reports: 23,
    badges: ['first_report', 'ten_reports', 'recycler', 'green_citizen'],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user);

  const levelInfo = useMemo(() => PointsService.getProgressToNextLevel(user.points), [user.points]);
  const unlockedBadges = useMemo(() => PointsService.getUnlockedBadges(user.badges), [user.badges]);
  const lockedBadges = useMemo(() => PointsService.getLockedBadges(user.badges), [user.badges]);
  const progress = useMemo(() => PointsService.calculateUserProgress(user.points, user.reports, user.badges), [user]);

  const handleSave = () => { setUser(editData); setIsEditing(false); toast.success('Perfil actualizado'); };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-info/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
        <div className="eco-page-content relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-3xl shrink-0">
              {levelInfo.currentLevel.emoji}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 w-fit">
                  Nivel {levelInfo.currentLevel.id} — {levelInfo.currentLevel.name}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">Miembro desde {user.joinDate.toLocaleDateString('es-PE', { year: 'numeric', month: 'long' })}</p>
            </div>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="gap-2 shrink-0"
            >
              {isEditing ? <><Save size={16} /> Guardar</> : <><Edit3 size={16} /> Editar</>}
            </Button>
          </div>
        </div>
      </div>

      <header className="eco-page-header">
        <div className="eco-page-content py-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setLocation('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <span className="text-sm text-muted-foreground">Dashboard</span>
            <ChevronRight size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium">Mi Perfil</span>
          </div>
        </div>
      </header>

      <main className="eco-page-content">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Info */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-bold mb-5">Información Personal</h3>
              {isEditing ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {([
                    { label: 'Nombre', field: 'name', type: 'text' },
                    { label: 'Email', field: 'email', type: 'email' },
                    { label: 'Celular', field: 'phone', type: 'tel' },
                    { label: 'Distrito', field: 'district', type: 'text' },
                    { label: 'Edad', field: 'age', type: 'number' },
                  ] as const).map((f) => (
                    <div key={f.field}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label}</label>
                      <Input
                        type={f.type}
                        value={(editData as any)[f.field]}
                        onChange={(e) => setEditData({ ...editData, [f.field]: f.type === 'number' ? parseInt(e.target.value) : e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Mail, label: 'Email', value: user.email },
                    { icon: Phone, label: 'Celular', value: user.phone },
                    { icon: MapPin, label: 'Distrito', value: user.district },
                    { icon: Cake, label: 'Edad', value: `${user.age} años` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-background">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Level Progress */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Progreso de Nivel</h3>
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                  {levelInfo.currentLevel.emoji} {levelInfo.currentLevel.name}
                </Badge>
              </div>
              <div className="flex items-center gap-6 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl shrink-0">
                  {levelInfo.currentLevel.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{user.points} pts</span>
                    {levelInfo.nextLevel && <span className="text-muted-foreground">{levelInfo.nextLevel.minPoints} pts</span>}
                  </div>
                  <Progress value={levelInfo.progress} className="h-3" />
                  {levelInfo.nextLevel && (
                    <p className="text-xs text-muted-foreground mt-2">
                      <span className="text-primary font-medium">{levelInfo.pointsNeeded} puntos</span> para {levelInfo.nextLevel.emoji} {levelInfo.nextLevel.name}
                    </p>
                  )}
                </div>
                {levelInfo.nextLevel && (
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0 opacity-60">
                    {levelInfo.nextLevel.emoji}
                  </div>
                )}
              </div>
              {/* Level Milestones */}
              <div className="flex gap-1">
                {PointsService.LEVELS.map((l, i) => (
                  <div key={l.id} className="flex-1">
                    <div className={`h-1.5 rounded-full ${(user.points || 0) >= l.minPoints ? 'bg-primary' : 'bg-muted'}`} />
                    <p className="text-[10px] text-muted-foreground mt-1 text-center truncate">{l.emoji}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Reportes', value: user.reports, icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
                { label: 'EcoPuntos', value: user.points, icon: Zap, color: 'text-info', bg: 'bg-info/10' },
                { label: 'Insignias', value: unlockedBadges.length, icon: Award, color: 'text-warning', bg: 'bg-warning/10' },
                { label: 'Progreso', value: `${Math.round(progress.overallProgress)}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              ].map((s) => (
                <Card key={s.label} className="p-4 bg-card border-border text-center">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                    <s.icon size={18} className={s.color} />
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Badges */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold">Insignias</h3>
                <Badge variant="outline" className="border-warning/30 text-warning text-xs">
                  {unlockedBadges.length}/{PointsService.BADGES.length}
                </Badge>
              </div>
              {unlockedBadges.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {unlockedBadges.map((b) => (
                    <div key={b.id} className="p-4 rounded-xl bg-background border border-warning/15 flex items-start gap-3">
                      <span className="text-2xl">{b.emoji}</span>
                      <div>
                        <p className="font-semibold text-sm">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aún no tienes insignias</p>
                </div>
              )}
              {lockedBadges.length > 0 && (
                <>
                  <div className="border-t border-border mt-5 pt-5">
                    <p className="text-xs text-muted-foreground mb-3 font-medium">Próximas insignias</p>
                    <div className="grid sm:grid-cols-3 gap-2">
                      {lockedBadges.slice(0, 3).map((b) => (
                        <div key={b.id} className="p-3 rounded-xl bg-background/50 border border-border text-center opacity-60">
                          <div className="text-xl mb-1">{b.emoji}</div>
                          <p className="text-xs font-medium">{b.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{b.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-bold mb-4">Resumen</h3>
              <div className="space-y-3">
                {[
                  { icon: Trophy, label: 'Nivel', value: levelInfo.currentLevel.name, color: 'text-warning' },
                  { icon: Zap, label: 'EcoPuntos', value: user.points.toString(), color: 'text-info' },
                  { icon: Target, label: 'Reportes', value: user.reports.toString(), color: 'text-primary' },
                  { icon: Award, label: 'Insignias', value: `${unlockedBadges.length}/${PointsService.BADGES.length}`, color: 'text-purple-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-background transition-colors">
                    <div className="flex items-center gap-2.5">
                      <item.icon size={16} className={item.color} />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Activity */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-bold mb-4">Actividad Reciente</h3>
              <div className="space-y-3">
                {MOCK_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <a.icon size={12} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs leading-snug">{a.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Overall Progress */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-bold mb-4">Progreso General</h3>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-primary">{Math.round(progress.overallProgress)}%</p>
                <p className="text-xs text-muted-foreground mt-1">Completado</p>
              </div>
              <Progress value={progress.overallProgress} className="h-2.5" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{progress.unlockedBadges} insignias</span>
                <span>{progress.totalBadges - progress.unlockedBadges} restantes</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
