import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Menu, X, Home, LogIn, LogOut, Settings, BookOpen, Newspaper,
  MapPin, FileText, User, Bell, Search, BarChart3,
} from 'lucide-react';
import { authService } from '@/services/authService';
import { notificationsService } from '@/services/notificationsService';
import Logo from '@/components/Logo';

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = authService.getCurrentUser();
  const unreadCount = currentUser ? notificationsService.getUnreadCount(currentUser.uid) : 0;

  const nav = (path: string) => { setLocation(path); setMobileMenuOpen(false); setSearchOpen(false); };

  const handleLogout = () => { authService.logout(); setLocation('/'); setMobileMenuOpen(false); };

  const publicLinks = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: BookOpen, label: 'Educación', path: '/education' },
    { icon: Newspaper, label: 'Noticias', path: '/news' },
    { icon: BarChart3, label: 'Ranking', path: '/ranking' },
    { icon: MapPin, label: 'Mapa', path: '/mapa' },
  ];

  const authLinks = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Reportes', path: '/reports' },
    { icon: BookOpen, label: 'Educación', path: '/education' },
    { icon: Newspaper, label: 'Noticias', path: '/news' },
    { icon: BarChart3, label: 'Ranking', path: '/ranking' },
    { icon: MapPin, label: 'Mapa', path: '/mapa' },
  ];

  const links = currentUser ? authLinks : publicLinks;

  const isActive = (p: string) => location === p;

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex fixed top-0 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border z-50">
        <div className="w-full px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => nav('/')}>
              <Logo size="md" />
            </div>

            <div className="flex gap-1 items-center flex-1 justify-center">
              {links.map(l => (
                <button key={l.path} onClick={() => nav(l.path)}
                  className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${
                    isActive(l.path) ? 'text-primary bg-primary/10 font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}>
                  <l.icon size={16} />
                  {l.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                <Search size={18} className="text-muted-foreground" />
              </button>
              {currentUser && (
                <button onClick={() => nav('/notifications')} className="relative p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <Bell size={18} className="text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}
              {currentUser ? (
                <>
                  <Button onClick={() => nav('/profile')} variant="ghost" size="sm" className="gap-1.5 text-sm">
                    <User size={16} /> <span className="hidden lg:inline">{currentUser.displayName}</span>
                  </Button>
                  <Button onClick={() => nav('/settings')} variant="ghost" size="icon" className="text-muted-foreground">
                    <Settings size={18} />
                  </Button>
                  <Button onClick={handleLogout} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <LogOut size={18} />
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => nav('/login')} variant="outline" size="sm" className="border-border">
                    Iniciar sesión
                  </Button>
                  <Button onClick={() => nav('/register')} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </div>
          {searchOpen && (
            <form onSubmit={(e) => { e.preventDefault(); setSearchOpen(false); setSearchQuery(''); }} className="pb-4">
              <Input placeholder="Buscar reportes, noticias, artículos..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="bg-card border-border" autoFocus />
            </form>
          )}
        </div>
      </nav>

      {/* Mobile */}
      <nav className="md:hidden fixed top-0 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border z-50">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => nav('/')}>
            <Logo size="md" />
          </div>
          <div className="flex gap-1 items-center">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-muted/50 rounded-lg">
              <Search size={20} className="text-muted-foreground" />
            </button>
            {currentUser && (
              <button onClick={() => nav('/notifications')} className="relative p-2 hover:bg-muted/50 rounded-lg">
                <Bell size={20} className="text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-muted/50 rounded-lg">
              {mobileMenuOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={(e) => { e.preventDefault(); setSearchOpen(false); setSearchQuery(''); }} className="px-4 pb-3">
            <Input placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-card border-border" autoFocus />
          </form>
        )}

        {mobileMenuOpen && (
          <div className="px-4 pb-4 space-y-1 border-t border-border">
            {links.map(l => (
              <button key={l.path} onClick={() => nav(l.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive(l.path) ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50'
                }`}>
                <l.icon size={18} />
                {l.label}
              </button>
            ))}
            {currentUser ? (
              <>
                <button onClick={() => nav('/profile')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 text-sm">
                  <User size={18} /> Mi Perfil
                </button>
                <button onClick={() => nav('/settings')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 text-sm">
                  <Settings size={18} /> Configuración
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 text-sm">
                  <LogOut size={18} /> Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button onClick={() => nav('/login')} variant="outline" className="flex-1 border-border">Iniciar sesión</Button>
                <Button onClick={() => nav('/register')} className="flex-1 bg-primary text-primary-foreground">Registrarse</Button>
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="h-16" />
    </>
  );
}
