import { useEffect, useRef, useState } from 'react';
import { GOOGLE_MAPS_CONFIG, loadGoogleMapsScript } from '@/config/googleMaps';
import { MapPin, Loader2, AlertCircle, Locate, Crosshair, Navigation2 } from 'lucide-react';
import EmbeddedMap from '@/components/EmbeddedMap';

interface MapPickerProps {
  value?: { lat: number; lng: number } | null;
  onChange?: (coords: { lat: number; lng: number }) => void;
  height?: string;
  center?: { lat: number; lng: number };
  placeholderText?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

function EmbeddedMapPicker({
  value,
  onChange,
  height,
  center,
}: Omit<MapPickerProps, 'placeholderText'>) {
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(value || null);
  const [manualLat, setManualLat] = useState<string>(value ? String(value.lat) : '');
  const [manualLng, setManualLng] = useState<string>(value ? String(value.lng) : '');
  const [locating, setLocating] = useState(false);

  const commit = (coords: { lat: number; lng: number }) => {
    setPoint(coords);
    setManualLat(coords.lat.toFixed(6));
    setManualLng(coords.lng.toFixed(6));
    onChange?.(coords);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        commit({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const applyManual = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      commit({ lat, lng });
    }
  };

  return (
    <div className={`relative ${height} w-full`}>
      <EmbeddedMap
        center={point || center || GOOGLE_MAPS_CONFIG.defaultCenter}
        zoom={point ? 16 : 13}
        markers={point ? [{ lat: point.lat, lng: point.lng, label: 'Ubicación del reporte' }] : []}
        activeIndex={0}
        showMarkerChips={false}
        className="rounded-xl"
      />

      <button
        type="button"
        onClick={useMyLocation}
        className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-[#1a1f2e] border border-[#4ADE80]/30 rounded-lg flex items-center justify-center hover:bg-[#2a2f3e] hover:border-[#4ADE80] transition-all text-[#4ADE80]"
        title="Usar mi ubicación"
      >
        {locating ? <Loader2 size={18} className="animate-spin" /> : <Crosshair size={18} />}
      </button>

      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#1a1f2e]/90 backdrop-blur px-2.5 py-1.5 rounded-lg border border-white/10">
        <Navigation2 size={11} className="text-[#00D4FF]" />
        <span className="text-[10px] text-[#9CA3AF]">
          {point
            ? `Punto fijado: ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`
            : 'Pulsa el botón de ubicación o ingresa coordenadas'}
        </span>
      </div>

      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-[#1a1f2e]/90 backdrop-blur px-2.5 py-1.5 rounded-lg border border-white/10">
        <input
          type="number"
          step="0.000001"
          value={manualLat}
          onChange={(e) => setManualLat(e.target.value)}
          placeholder="Lat"
          className="w-24 bg-transparent text-[11px] text-white placeholder-[#9CA3AF]/60 outline-none"
        />
        <span className="text-[10px] text-[#9CA3AF]">,</span>
        <input
          type="number"
          step="0.000001"
          value={manualLng}
          onChange={(e) => setManualLng(e.target.value)}
          placeholder="Lng"
          className="w-24 bg-transparent text-[11px] text-white placeholder-[#9CA3AF]/60 outline-none"
        />
        <button
          type="button"
          onClick={applyManual}
          className="px-2 py-1 rounded-md bg-[#4ADE80]/20 text-[#4ADE80] text-[10px] font-semibold hover:bg-[#4ADE80]/30 transition-all"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}

export default function MapPicker({
  value,
  onChange,
  height = 'h-56 sm:h-64',
  center,
  placeholderText = 'Toca el mapa para marcar la ubicación exacta',
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        if (!GOOGLE_MAPS_CONFIG.isConfigured) {
          setError('not-configured');
          setLoading(false);
          return;
        }
        await loadGoogleMapsScript();
        if (cancelled || !mapRef.current) return;

        const start = value || center || GOOGLE_MAPS_CONFIG.defaultCenter;

        const map = new window.google.maps.Map(mapRef.current, {
          ...GOOGLE_MAPS_CONFIG.mapOptions,
          center: start,
          zoom: value ? 16 : 14,
        });
        mapInstanceRef.current = map;

        if (value) {
          markerRef.current = new window.google.maps.Marker({
            position: value,
            map,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
          });
          markerRef.current.addListener('dragend', (e: any) => {
            onChange?.({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          });
        }

        map.addListener('click', (e: any) => {
          const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          if (markerRef.current) {
            markerRef.current.setPosition(coords);
          } else {
            markerRef.current = new window.google.maps.Marker({
              position: coords,
              map,
              draggable: true,
              animation: window.google.maps.Animation.DROP,
            });
            markerRef.current.addListener('dragend', (ev: any) => {
              onChange?.({ lat: ev.latLng.lat(), lng: ev.latLng.lng() });
            });
          }
          onChange?.(coords);
        });

        setError(null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar el mapa');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const centerOnCurrent = () => {
    if (!mapInstanceRef.current) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        mapInstanceRef.current.setCenter(loc);
        mapInstanceRef.current.setZoom(16);
        if (markerRef.current) {
          markerRef.current.setPosition(loc);
        } else {
          markerRef.current = new window.google.maps.Marker({
            position: loc,
            map: mapInstanceRef.current,
            draggable: true,
          });
          markerRef.current.addListener('dragend', (ev: any) => {
            onChange?.({ lat: ev.latLng.lat(), lng: ev.latLng.lng() });
          });
        }
        onChange?.(loc);
      },
      () => {
        mapInstanceRef.current.setCenter(GOOGLE_MAPS_CONFIG.defaultCenter);
      }
    );
  };

  if (error === 'not-configured') {
    return (
      <EmbeddedMapPicker
        value={value}
        onChange={onChange}
        height={height}
        center={center}
      />
    );
  }

  if (error) {
    return (
      <div className={`w-full ${height} bg-[#1a1f2e] rounded-xl border border-[#EF4444]/20 flex items-center justify-center p-6`}>
        <div className="text-center">
          <AlertCircle size={32} className="text-[#EF4444] mx-auto mb-3" />
          <p className="text-sm text-[#9CA3AF]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${height} rounded-xl overflow-hidden`}>
      <div ref={mapRef} className="absolute inset-0" />
      {loading && (
        <div className="absolute inset-0 bg-[#0B0F14]/70 flex flex-col items-center justify-center gap-2 z-10">
          <Loader2 size={24} className="text-[#4ADE80] animate-spin" />
          <p className="text-xs text-[#9CA3AF]">Cargando mapa...</p>
        </div>
      )}
      <button
        type="button"
        onClick={centerOnCurrent}
        className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-[#1a1f2e] border border-[#4ADE80]/30 rounded-lg flex items-center justify-center hover:bg-[#2a2f3e] hover:border-[#4ADE80] transition-all text-[#4ADE80]"
        title="Usar mi ubicación"
      >
        <Crosshair size={18} />
      </button>
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#1a1f2e]/90 backdrop-blur px-2.5 py-1.5 rounded-lg border border-white/10">
        <Locate size={12} className="text-[#00D4FF]" />
        <span className="text-[10px] text-[#9CA3AF]">Toca el mapa para fijar el punto</span>
      </div>
    </div>
  );
}
