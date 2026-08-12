import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '', age: '', phone: '', district: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const districts = ['Villa El Salvador', 'San Juan de Miraflores', 'Chorrillos', 'Surco', 'Barranco', 'Miraflores', 'San Isidro', 'Otro'];

  const validateForm = (): boolean => {
    const e: { [key: string]: string } = {};
    if (!formData.email) e.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Email inválido';
    if (!formData.password) e.password = 'Requerida';
    else if (formData.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'No coinciden';
    if (!formData.name || formData.name.trim().length < 2) e.name = 'Nombre inválido';
    const age = parseInt(formData.age);
    if (!formData.age || age < 13 || age > 120) e.age = '13-120';
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 7) e.phone = 'Teléfono inválido';
    if (!formData.district) e.district = 'Selecciona uno';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      const r = await authService.register(formData.email, formData.password, formData.name);
      if (r.success) { toast.success('¡Registro exitoso!'); setLocation('/dashboard'); }
      else { toast.error(r.message); setErrors({ submit: r.message || 'Error al registrarse' }); }
    } catch { toast.error('Error al registrarse'); }
    finally { setLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-info/5 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-muted-foreground mt-2">Únete a nuestra comunidad ambiental</p>
        </div>

        <Card className="p-6 bg-card border-border">
          <form onSubmit={handleRegister} className="space-y-3.5">
            {[
              { label: 'Email', name: 'email', type: 'email', placeholder: 'tu@email.com' },
              { label: 'Nombre completo', name: 'name', type: 'text', placeholder: 'Tu nombre' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
                <Input type={f.type} name={f.name} value={(formData as any)[f.name]} onChange={handleChange}
                  placeholder={f.placeholder} className={`bg-background ${(errors as any)[f.name] ? 'border-destructive' : ''}`} />
                {(errors as any)[f.name] && <p className="text-destructive text-[11px] mt-0.5 flex items-center gap-1"><AlertCircle size={12} /> {(errors as any)[f.name]}</p>}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Edad</label>
                <Input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="18"
                  className={`bg-background ${errors.age ? 'border-destructive' : ''}`} />
                {errors.age && <p className="text-destructive text-[11px] mt-0.5">{errors.age}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Teléfono</label>
                <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+51 999 999"
                  className={`bg-background ${errors.phone ? 'border-destructive' : ''}`} />
                {errors.phone && <p className="text-destructive text-[11px] mt-0.5">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Distrito</label>
              <select name="district" value={formData.district} onChange={handleChange}
                className={`w-full px-3 py-2 bg-background border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.district ? 'border-destructive' : 'border-border'}`}>
                <option value="">Selecciona tu distrito</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.district && <p className="text-destructive text-[11px] mt-0.5">{errors.district}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Contraseña</label>
                <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••"
                  className={`bg-background ${errors.password ? 'border-destructive' : ''}`} />
                {errors.password && <p className="text-destructive text-[11px] mt-0.5">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Confirmar</label>
                <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••"
                  className={`bg-background ${errors.confirmPassword ? 'border-destructive' : ''}`} />
                {errors.confirmPassword && <p className="text-destructive text-[11px] mt-0.5">{errors.confirmPassword}</p>}
              </div>
            </div>

            {errors.submit && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-2 text-destructive text-sm">
                <AlertCircle size={16} />{errors.submit}
              </div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 mt-2 gap-2">
              {loading ? 'Registrando...' : <>Registrarse <ArrowRight size={18} /></>}
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
                else { toast.error(r.message); setErrors({ submit: r.message || 'Error al registrarse con Google' }); }
              } catch { toast.error('Error al registrarse con Google'); }
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

          <div className="text-center mt-5">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => setLocation('/login')} className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Inicia sesión
              </button>
            </p>
          </div>
        </Card>

        <p className="text-center text-muted-foreground text-xs mt-5">
          Al registrarte, aceptas nuestros términos de servicio y política de privacidad
        </p>
      </div>
    </div>
  );
}
