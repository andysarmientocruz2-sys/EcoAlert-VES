import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      <Card className="w-full max-w-md mx-4 bg-card border-border text-center p-8 relative">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={32} className="text-destructive" />
        </div>
        <h1 className="text-5xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-3">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          La página que buscas no existe, fue movida o eliminada.
        </p>
        <Button onClick={() => setLocation("/")} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Home size={18} /> Ir al Inicio
        </Button>
      </Card>
    </div>
  );
}
