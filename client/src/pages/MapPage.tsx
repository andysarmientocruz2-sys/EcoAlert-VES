import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Filter, X, ChevronRight, Layers, Navigation2 } from 'lucide-react';
import { useLocation } from 'wouter';
import GoogleMap from '@/components/GoogleMap';
import { SEVERITY_CONFIG, POLLUTION_TYPES } from '@shared/constants';

interface Report {
  id: string; title: string; location: string;
  severity: 'baja' | 'media' | 'alta' | 'critica';
  type: string; lat: number; lng: number; description: string; date: string;
}

const MOCK_REPORTS: Report[] = [
  { id: '1', title: 'Basura acumulada', location: 'Parque Central', severity: 'alta', type: 'basura', lat: -12.2104, lng: -76.9244, description: 'Gran cantidad de residuos sólidos en el parque central.', date: '13 de Julio, 2026' },
  { id: '2', title: 'Agua contaminada', location: 'Río Lurín', severity: 'critica', type: 'agua', lat: -12.2200, lng: -76.9300, description: 'El río presenta contaminación severa.', date: '12 de Julio, 2026' },
  { id: '3', title: 'Quema de residuos', location: 'Zona Industrial', severity: 'media', type: 'quema', lat: -12.2150, lng: -76.9200, description: 'Quema de residuos generando contaminación del aire.', date: '11 de Julio, 2026' },
];

export default function MapPage() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filtered = MOCK_REPORTS.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || r.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="eco-page-header">
        <div className="eco-page-content flex items-center gap-3">
          <button onClick={() => setLocation('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MapPin size={24} className="text-primary" />
              Mapa de Reportes
            </h1>
            <p className="text-muted-foreground text-sm">Problemas ambientales en Villa El Salvador</p>
          </div>
        </div>
      </header>

      <main className="eco-page-content">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-4 h-fit lg:sticky lg:top-24">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
              <Input placeholder="Buscar reportes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-card" />
            </div>

            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className={`gap-1.5 ${showFilters ? 'border-primary/30 text-primary' : ''}`}>
              <Filter size={16} /> Filtros
            </Button>

            {showFilters && (
              <div className="flex flex-wrap gap-1.5">
                {[['all', 'Todos'], ...Object.entries(POLLUTION_TYPES).map(([k, v]) => [k, `${v.emoji} ${v.label}`])].map(([val, label]) => (
                  <Button key={val} variant={filterType === val ? 'default' : 'outline'} size="sm" onClick={() => setFilterType(val)}
                    className={filterType === val ? 'bg-primary text-primary-foreground' : ''}>
                    {label}
                  </Button>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground font-medium">Reportes ({filtered.length})</p>

            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <Card className="p-4 bg-card border-border text-center text-muted-foreground text-sm">No hay reportes</Card>
              ) : filtered.map(r => {
                const sev = SEVERITY_CONFIG[r.severity];
                return (
                  <Card key={r.id} onClick={() => setSelectedReport(r)}
                    className={`p-3 bg-card border-border cursor-pointer transition-all hover:border-primary/15 ${
                      selectedReport?.id === r.id ? 'border-primary/40 ring-1 ring-primary/10' : ''
                    }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{r.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {r.location}
                        </p>
                      </div>
                      <Badge variant="outline" className={`${sev.color} ${sev.bg} ${sev.border} text-[10px] shrink-0`}>{sev.label}</Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Map */}
          <div className="space-y-4">
            <Card className="h-[550px] bg-card border-border overflow-hidden">
              <GoogleMap reports={filtered} onReportSelect={setSelectedReport} selectedReportId={selectedReport?.id} />
            </Card>

            {selectedReport && (
              <Card className="p-5 bg-card border-border">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold">{selectedReport.title}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)} className="shrink-0"><X size={16} /></Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{selectedReport.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {selectedReport.location}</span>
                  <span className="flex items-center gap-1"><Navigation2 size={12} /> {selectedReport.lat.toFixed(4)}, {selectedReport.lng.toFixed(4)}</span>
                  <span>{selectedReport.date}</span>
                </div>
                <Badge variant="outline" className={`${SEVERITY_CONFIG[selectedReport.severity].color} ${SEVERITY_CONFIG[selectedReport.severity].bg} mt-3`}>
                  {SEVERITY_CONFIG[selectedReport.severity].label}
                </Badge>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
