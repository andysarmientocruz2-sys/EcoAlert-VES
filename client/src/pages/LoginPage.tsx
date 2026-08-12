import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const e: { [key: string]: string } = {};
    if (!email) e.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email inválido';
    if (!password) e.password = 'La contraseña es requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      const r = await authService.login(email, password);
      if (r.success) { toast.success('¡Bienvenido a EcoAlert VES!'); setLocation('/dashboard'); }
      else { toast.error(r.message); setErrors({ submit: r.message || 'Error al iniciar sesión' }); }
    } catch { toast.error('Error al iniciar sesión'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-info/5 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-muted-foreground mt-2">Inicia sesión para continuar</p>
        </div>

        <Card className="p-6 bg-card border-border">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
              <Input
                type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
                placeholder="tu@email.com"
                className={`bg-background ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Contraseña</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }}
                  placeholder="••••••••"
                  className={`bg-background pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.password}</p>}
            </div>
            {errors.submit && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-2 text-destructive text-sm">
                <AlertCircle size={16} />{errors.submit}
              </div>
            )}
            <Button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 gap-2">
              {loading ? 'Iniciando sesión...' : <>Iniciar sesión <ArrowRight size={18} /></>}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-3 bg-card text-muted-foreground">o</span></div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const r = await authService.loginWithGoogle();
                if (r.success) { toast.success('¡Bienvenido a EcoAlert VES!'); setLocation('/dashboard'); }
                else { toast.error(r.message); setErrors({ submit: r.message || 'Error al iniciar con Google' }); }
              } catch { toast.error('Error al iniciar con Google'); }
              finally { setLoading(false); }
            }}
            className="w-full border-border hover:bg-muted/50 h-11 gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continuar con Google
          </Button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">o</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <Button type="button" variant="outline" onClick={() => { setEmail('demo@ecoalert.com'); setPassword('Demo1234'); }}
            className="w-full border-border hover:bg-muted/50">
            Usar cuenta demo
          </Button>

          <div className="text-center mt-5">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <button onClick={() => setLocation('/register')} className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Regístrate aquí
              </button>
            </p>
          </div>
        </Card>

        <Card className="mt-4 p-4 bg-card border-info/20">
          <div className="flex items-start gap-3">
            <CheckCircle size={18} className="text-info shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-info mb-1">Cuenta de demostración</p>
              <p className="text-muted-foreground">Email: <span className="text-foreground font-mono">demo@ecoalert.com</span></p>
              <p className="text-muted-foreground">Contraseña: <span className="text-foreground font-mono">Demo1234</span></p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
