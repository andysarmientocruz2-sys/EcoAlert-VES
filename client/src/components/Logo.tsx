import { Leaf } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  className?: string;
}

const SIZES = {
  sm: { img: 'h-7', text: 'text-base', icon: 16 },
  md: { img: 'h-9', text: 'text-lg', icon: 20 },
  lg: { img: 'h-12', text: 'text-2xl', icon: 24 },
  xl: { img: 'h-16', text: 'text-3xl', icon: 32 },
};

export default function Logo({ size = 'md', withText = true, className = '' }: LogoProps) {
  const s = SIZES[size];
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${s.img} aspect-square rounded-xl overflow-hidden flex items-center justify-center bg-primary/10 border border-primary/20 shrink-0`}>
        <img
          src="/logo-64.png"
          alt="EcoAlert"
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }}
        />
        <Leaf size={s.icon} className="text-primary hidden" />
      </div>
      {withText && (
        <span className={`${s.text} font-bold tracking-tight`}>
          <span className="text-primary">Eco</span>
          <span className="text-foreground">Alert</span>
        </span>
      )}
    </div>
  );
}
