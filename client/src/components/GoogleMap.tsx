import React, { useEffect, useRef, useState } from 'react';
import { GOOGLE_MAPS_CONFIG, loadGoogleMapsScript, getMarkerIcon } from '@/config/googleMaps';
import { AlertCircle, MapPin, Loader2 } from 'lucide-react';
import EmbeddedMap from '@/components/EmbeddedMap';

interface Report {
  id: string;
  title: string;
  type: string;
  severity: 'baja' | 'media' | 'alta' | 'critica';
  location: string;
  lat: number;
  lng: number;
  description: string;
  date: string;
}

interface GoogleMapProps {
  reports: Report[];
  onReportSelect?: (report: Report) => void;
  selectedReportId?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

function GoogleMapsJS({ reports, onReportSelect, selectedReportId }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain' | 'hybrid'>('roadmap');
  const infoWindowRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      try {
        setLoading(true);

        // Load Google Maps script
        await loadGoogleMapsScript();

        if (!mapRef.current) {
          setError('Map container not found');
          setLoading(false);
          return;
        }

        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
          ...GOOGLE_MAPS_CONFIG.mapOptions,
          mapTypeId: mapType,
        });

        mapInstanceRef.current = map;

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLoc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setUserLocation(userLoc);

              // Add user location marker
              new window.google.maps.Marker({
                position: userLoc,
                map: map,
                title: 'Tu ubicación',
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              });

              // Center map on user location
              map.setCenter(userLoc);
            },
            (error) => {
              console.log('Geolocation error:', error);
              // Use default center if geolocation fails
              map.setCenter(GOOGLE_MAPS_CONFIG.defaultCenter);
            }
          );
        } else {
          map.setCenter(GOOGLE_MAPS_CONFIG.defaultCenter);
        }

        // Add markers for reports
        addMarkersToMap(map, reports);

        // Handle map type changes
        map.addListener('maptypeid_changed', () => {
          const newMapType = map.getMapTypeId();
          setMapType(newMapType);
        });

        setMapLoaded(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize map');
      } finally {
        setLoading(false);
      }
    };

    initializeMap();
  }, []);

  // Add markers to map
  const addMarkersToMap = (map: any, reportsToAdd: Report[]) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Create info window
    infoWindowRef.current = new window.google.maps.InfoWindow();

    // Add new markers
    reportsToAdd.forEach((report) => {
      const marker = new window.google.maps.Marker({
        position: { lat: report.lat, lng: report.lng },
        map: map,
        title: report.title,
        icon: getMarkerIcon(report.severity),
      });

      // Add click listener to marker
      marker.addListener('click', () => {
        showInfoWindow(marker, report);
        onReportSelect?.(report);
      });

      markersRef.current.push(marker);
    });
  };

  // Show info window for marker
  const showInfoWindow = (marker: any, report: Report) => {
    const content = `
      <div style="color: #000; font-family: Arial, sans-serif; max-width: 250px;">
        <h3 style="margin: 0 0 8px 0; color: #4ADE80;">${report.title}</h3>
        <p style="margin: 4px 0; font-size: 12px;">
          <strong>Tipo:</strong> ${report.type}
        </p>
        <p style="margin: 4px 0; font-size: 12px;">
          <strong>Gravedad:</strong> <span style="color: ${getSeverityColor(report.severity)}">${report.severity}</span>
        </p>
        <p style="margin: 4px 0; font-size: 12px;">
          <strong>Ubicación:</strong> ${report.location}
        </p>
        <p style="margin: 4px 0; font-size: 12px;">
          <strong>Fecha:</strong> ${report.date}
        </p>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #666;">
          ${report.description}
        </p>
      </div>
    `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(mapInstanceRef.current, marker);
  };

  // Get color based on severity
  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      baja: '#FFD700',
      media: '#FF8C00',
      alta: '#FF4500',
      critica: '#DC143C',
    };
    return colors[severity] || '#FFD700';
  };

  // Center map on report
  const centerMapOnReport = (report: Report) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: report.lat, lng: report.lng });
      mapInstanceRef.current.setZoom(16);

      // Find and click the marker
      const marker = markersRef.current[reports.findIndex((r) => r.id === report.id)];
      if (marker) {
        showInfoWindow(marker, report);
      }
    }
  };

  // Handle selected report
  useEffect(() => {
    if (selectedReportId && mapLoaded) {
      const selectedReport = reports.find((r) => r.id === selectedReportId);
      if (selectedReport) {
        centerMapOnReport(selectedReport);
      }
    }
  }, [selectedReportId, mapLoaded, reports]);

  if (error) {
    return (
      <div className="w-full h-full bg-[#1a1f2e] rounded-lg border border-[rgba(74,222,128,0.2)] flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Error al cargar el mapa</h3>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 bg-[#0B0F14]/50 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-[#4ADE80] animate-spin" />
            <p className="text-white text-sm">Cargando mapa...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" />
    </div>
  );
}

export default function GoogleMap(props: GoogleMapProps) {
  const { reports, onReportSelect, selectedReportId } = props;

  if (!GOOGLE_MAPS_CONFIG.isConfigured) {
    const activeIndex = reports.findIndex((r) => r.id === selectedReportId);
    return (
      <EmbeddedMap
        center={GOOGLE_MAPS_CONFIG.defaultCenter}
        zoom={13}
        markers={reports.map((r) => ({ lat: r.lat, lng: r.lng, label: r.title }))}
        activeIndex={reports.length > 0 ? (activeIndex >= 0 ? activeIndex : 0) : undefined}
        onActiveChange={(i) => {
          const r = reports[i];
          if (r) onReportSelect?.(r);
        }}
      />
    );
  }

  return <GoogleMapsJS {...props} />;
}
