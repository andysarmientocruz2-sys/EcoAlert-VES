import { useState } from 'react';
import { MapPin, Navigation2 } from 'lucide-react';

interface EmbeddedMarker {
  lat: number;
  lng: number;
  label?: string;
}

interface EmbeddedMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: EmbeddedMarker[];
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  height?: string;
  className?: string;
  showMarkerChips?: boolean;
}

const DEFAULT_CENTER = { lat: -12.2104, lng: -76.9244 };

function buildEmbedUrl(center: { lat: number; lng: number }, zoom: number, marker?: EmbeddedMarker): string {
  const query = marker
    ? `${marker.label ? encodeURIComponent(marker.label) + '@' : ''}${marker.lat.toFixed(6)},${marker.lng.toFixed(6)}`
    : `${center.lat.toFixed(6)},${center.lng.toFixed(6)}`;
  return `https://maps.google.com/maps?q=${query}&z=${zoom}&hl=es&output=embed`;
}

export default function EmbeddedMap({
  center = DEFAULT_CENTER,
  zoom = 13,
  markers = [],
  activeIndex,
  onActiveChange,
  height = 'w-full h-full',
  className = '',
  showMarkerChips = true,
}: EmbeddedMapProps) {
  const [internalActive, setInternalActive] = useState(0);
  const effectiveActive = activeIndex !== undefined ? activeIndex : internalActive;
  const activeMarker =
    markers.length > 0 ? markers[Math.min(effectiveActive, markers.length - 1)] : undefined;

  const src = buildEmbedUrl(activeMarker || center, zoom, activeMarker);

  const handleSelect = (i: number) => {
    if (activeIndex !== undefined) {
      onActiveChange?.(i);
    } else {
      setInternalActive(i);
    }
  };

  return (
    <div className={`relative ${height} ${className}`}>
      <iframe
        key={src}
        title="Google Maps"
        src={src}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />

      {markers.length > 0 && showMarkerChips && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 max-w-[90%] overflow-x-auto flex gap-1.5 px-2 py-1.5 bg-[#1a1f2e]/90 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
          {markers.map((m, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                effectiveActive === i
                  ? 'bg-[#4ADE80] text-[#0B0F14]'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <MapPin size={10} />
              {m.label || `Punto ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-[#1a1f2e]/90 backdrop-blur px-2.5 py-1.5 rounded-lg border border-white/10">
        <Navigation2 size={11} className="text-[#00D4FF]" />
        <span className="text-[10px] text-[#9CA3AF]">Google Maps</span>
      </div>
    </div>
  );
}
