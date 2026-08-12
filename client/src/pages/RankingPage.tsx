import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { authService } from '@/services/authService';
import { Search, Trophy, Medal, Flame, TrendingUp, TrendingDown, Minus, Users, Target, Zap, ChevronRight, Crown, Sparkles } from 'lucide-react';

const MOCK_RANKING = [
  { id: '1', name: 'Carlos López', points: 8500, level: 5, badges: 8, reports: 45, trend: 'up' as const, trendChange: 3 },
  { id: '2', name: 'María García', points: 7800, level: 5, badges: 7, reports: 42, trend: 'up' as const, trendChange: 1 },
  { id: '3', name: 'Juan Martínez', points: 7200, level: 4, badges: 7, reports: 38, trend: 'down' as const, trendChange: 1 },
  { id: '4', name: 'Ana Rodríguez', points: 6900, level: 4, badges: 6, reports: 35, trend: 'same' as const, trendChange: 0 },
  { id: '5', name: 'Pedro Sánchez', points: 6500, level: 4, badges: 6, reports: 32, trend: 'up' as const, trendChange: 2 },
  { id: '6', name: 'Laura Fernández', points: 6100, level: 3, badges: 5, reports: 30, trend: 'down' as const, trendChange: 1 },
  { id: '7', name: 'Roberto Díaz', points: 5800, level: 3, badges: 5, reports: 28, trend: 'up' as const, trendChange: 4 },
  { id: '8', name: 'Isabel Moreno', points: 5400, level: 3, badges: 4, reports: 25, trend: 'same' as const, trendChange: 0 },
  { id: '9', name: 'Francisco Torres', points: 5000, level: 3, badges: 4, reports: 23, trend: 'down' as const, trendChange: 2 },
  { id: '10', name: 'Elena Jiménez', points: 4600, level: 2, badges: 3, reports: 20, trend: 'up' as const, trendChange: 1 },
];

const PODIUM_STYLES = [
  { gradient: 'from-yellow-500/20 via-yellow-400/10 to-transparent', border: 'border-yellow-500/30', icon: Crown, color: 'text-yellow-400', medal: '🥇', ring: 'ring-yellow-500/20' },
  { gradient: 'from-gray-400/15 via-gray-300/8 to-transparent', border: 'border-gray-400/25', icon: Medal, color: 'text-gray-300', medal: '🥈', ring: 'ring-gray-400/15' },
  { gradient: 'from-orange-500/15 via-orange-400/8 to-transparent', border: 'border-orange-500/25', icon: Medal, color: 'text-orange-400', medal: '🥉', ring: 'ring-orange-500/15' },
];

export default function RankingPage() {
  const [, setLocation] = useLocation();
  const currentUser = authService.getCurrentUser();
  const [filter, setFilter] = useState<'all' | 'friends' | 'nearby'>('all');
  const [search, setSearch] = useState('');

  const userPos = useMemo(() => ({
    name: currentUser?.displayName || 'Tú',
    points: 3200,
    level: 3,
    position: 15,
    trend: 'up' as const,
    trendChange: 2,
  }), [currentUser]);

  const filtered = useMemo(() => {
    let list = [...MOCK_RANKING];
    if (search) list = list.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [search]);

  const podium = MOCK_RANKING.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <header className="eco-page-header">
        <div className="eco-page-content flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="text-warning" size={24} />
                Ranking
              </h1>
              <p className="text-muted-foreground text-sm">Ciudadanos ambientales destacados</p>
            </div>
          </div>
        </div>
      </header>

      <main className="eco-page-content space-y-6">
        {/* User Position */}
        <Card className="p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">#{userPos.position}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tu posición actual</p>
                <p className="font-bold">{userPos.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/10">Nivel {userPos.level}</Badge>
                  <span className="text-xs text-muted-foreground">· {userPos.points.toLocaleString()} pts</span>
                  {userPos.trend === 'up' && <span className="text-xs text-green-400 flex items-center gap-0.5"><TrendingUp size={12} /> +{userPos.trendChange}</span>}
                </div>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-3xl font-bold text-primary">{userPos.points.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">puntos</p>
            </div>
          </div>
        </Card>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 0, 2].map((podiumIdx) => {
            const user = podium[podiumIdx];
            if (!user) return <div key={podiumIdx} />;
            const style = PODIUM_STYLES[podiumIdx];
            const isFirst = podiumIdx === 0;
            return (
              <Card
                key={user.id}
                className={`p-4 bg-gradient-to-b ${style.gradient} ${style.border} border text-center ${isFirst ? 'md:-mt-4 ring-2 ' + style.ring : ''}`}
              >
                <div className="text-3xl mb-2">{style.medal}</div>
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className={`text-2xl font-bold mt-1 ${style.color}`}>{user.points.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{user.reports} reportes</p>
                {isFirst && <Sparkles size={14} className={`${style.color} mx-auto mt-2`} />}
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar ciudadano..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <div className="flex gap-2">
            {([['all', 'Global'], ['friends', 'Amigos'], ['nearby', 'Cercanos']] as const).map(([key, label]) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key)}
                className={filter === key ? 'bg-primary text-primary-foreground' : ''}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Ranking List */}
        <div className="space-y-2">
          {filtered.map((user, idx) => {
            const position = idx + 1;
            const top3 = position <= 3;
            const trendIcon = user.trend === 'up' ? <TrendingUp size={14} className="text-green-400" />
              : user.trend === 'down' ? <TrendingDown size={14} className="text-red-400" />
              : <Minus size={14} className="text-muted-foreground" />;

            return (
              <Card
                key={user.id}
                className={`p-4 bg-card border-border hover:border-primary/15 transition-all group ${
                  top3 ? 'ring-1 ring-primary/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                    position === 1 ? 'bg-yellow-500/15 text-yellow-400' :
                    position === 2 ? 'bg-gray-400/15 text-gray-300' :
                    position === 3 ? 'bg-orange-500/15 text-orange-400' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    #{position}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      {top3 && <span className="text-xs">{PODIUM_STYLES[position - 1]?.medal}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Target size={10} /> {user.reports} reportes</span>
                      <span className="flex items-center gap-1"><Trophy size={10} /> {user.badges} insignias</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {trendIcon}
                    {user.trendChange > 0 && <span className="text-[10px] text-muted-foreground">{user.trendChange}</span>}
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-lg font-bold text-primary">{user.points.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">puntos</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Stats Footer */}
        <Card className="p-6 bg-card border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Users, label: 'Participantes', value: '2,847', color: 'text-primary' },
              { icon: Target, label: 'Reportes totales', value: '12,456', color: 'text-info' },
              { icon: Zap, label: 'Puntos totales', value: '1.2M', color: 'text-warning' },
            ].map((s) => (
              <div key={s.label}>
                <s.icon size={20} className={`${s.color} mx-auto mb-1`} />
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
