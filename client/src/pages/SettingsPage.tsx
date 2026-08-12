import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ChevronRight, Save, LogOut, Moon, Globe, Bell, Mail, Shield, User } from 'lucide-react';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [formData, setFormData] = useState({ displayName: user?.displayName || '', newPassword: '', confirmPassword: '' });
  const [settings, setSettings] = useState({ darkMode: true, language: 'es', notifications: true, emailNotifications: true });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const unsub = authService.onAuthStateChange((u) => {
      setUser(u);
      if (u) setFormData(p => ({ ...p, displayName: u.displayName || '' }));
    });
    return () => unsub();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Debes iniciar sesión para acceder a configuración</p>
          <Button onClick={() => setLocation('/login')} className="bg-primary text-primary-foreground">Ir a Login</Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await userService.updateUserData(user.uid, { displayName: formData.displayName });
      toast.success('Perfil actualizado');
    } catch { toast.error('Error al actualizar'); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    const e: { [key: string]: string } = {};
    if (!formData.newPassword) e.newPassword = 'Ingresa una contraseña';
    else if (formData.newPassword.length < 6) e.newPassword = 'Mínimo 6 caracteres';
    if (formData.newPassword !== formData.confirmPassword) e.confirmPassword = 'No coinciden';
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    try {
      toast.info('Función de cambio de contraseña disponible pronto');
      setFormData(p => ({ ...p, newPassword: '', confirmPassword: '' }));
    } finally { setLoading(false); }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const r = await authService.logout();
      if (r.success) { toast.success('Sesión cerrada'); setLocation('/'); }
    } finally { setLoading(false); }
  };

  const sections = [
    {
      title: 'Perfil', icon: User, color: 'text-primary',
      content: (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nombre</label>
            <Input type="text" name="displayName" value={formData.displayName} onChange={handleInputChange} className="bg-background" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Correo Electrónico</label>
            <Input type="email" value={user.email} disabled className="bg-background opacity-50" />
          </div>
          <Button onClick={handleSaveProfile} disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-2">
            <Save size={16} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      ),
    },
    {
      title: 'Seguridad', icon: Shield, color: 'text-info',
      content: (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nueva Contraseña</label>
            <Input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} placeholder="••••••••"
              className={`bg-background ${errors.newPassword ? 'border-destructive' : ''}`} />
            {errors.newPassword && <p className="text-destructive text-xs mt-1">{errors.newPassword}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Confirmar Contraseña</label>
            <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••"
              className={`bg-background ${errors.confirmPassword ? 'border-destructive' : ''}`} />
            {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <Button onClick={handleChangePassword} disabled={loading}
            className="w-full bg-info/10 text-info border border-info/20 hover:bg-info/20 font-semibold mt-2">
            Cambiar Contraseña
          </Button>
        </div>
      ),
    },
    {
      title: 'Preferencias', icon: Globe, color: 'text-warning',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-background">
            <div className="flex items-center gap-2.5">
              <Moon size={16} className="text-primary" />
              <span className="text-sm">Modo Oscuro</span>
            </div>
            <Switch checked={settings.darkMode} disabled />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-background">
            <div className="flex items-center gap-2.5">
              <Globe size={16} className="text-info" />
              <span className="text-sm">Idioma</span>
            </div>
            <select value={settings.language} onChange={(e) => setSettings(p => ({ ...p, language: e.target.value }))}
              className="px-2 py-1 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-background">
            <div className="flex items-center gap-2.5">
              <Bell size={16} className="text-warning" />
              <span className="text-sm">Notificaciones Push</span>
            </div>
            <Switch checked={settings.notifications} onCheckedChange={(c) => setSettings(p => ({ ...p, notifications: c }))} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-background">
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-purple-400" />
              <span className="text-sm">Notificaciones por Email</span>
            </div>
            <Switch checked={settings.emailNotifications} onCheckedChange={(c) => setSettings(p => ({ ...p, emailNotifications: c }))} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="eco-page-header">
        <div className="eco-page-content flex items-center gap-3">
          <button onClick={() => setLocation('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-2xl font-bold">Configuración</h1>
        </div>
      </header>

      <main className="eco-page-content max-w-3xl space-y-5">
        {sections.map(s => (
          <Card key={s.title} className="p-5 bg-card border-border">
            <div className="flex items-center gap-2.5 mb-5">
              <s.icon size={18} className={s.color} />
              <h2 className="font-bold">{s.title}</h2>
            </div>
            {s.content}
          </Card>
        ))}

        <Card className="p-5 bg-card border-destructive/20">
          <h2 className="font-bold text-destructive mb-4 flex items-center gap-2">
            <LogOut size={18} /> Cerrar Sesión
          </h2>
          <Button onClick={handleLogout} disabled={loading}
            className="w-full bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 font-semibold">
            <LogOut size={16} className="mr-2" />
            {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">Se cerrará tu sesión en todos los dispositivos</p>
        </Card>
      </main>
    </div>
  );
}
