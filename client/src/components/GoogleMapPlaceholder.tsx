import React, { useEffect, useState } from 'react';
import { MapPin, Zap, AlertCircle, Plus, Minus, Navigation2, Map as MapIcon, Eye, X } from 'lucide-react';

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

interface GoogleMapPlaceholderProps {
  reports: Report[];
  onReportSelect?: (report: Report) => void;
  selectedReportId?: string;
}

export default function GoogleMapPlaceholder({
  reports,
  onReportSelect,
  selectedReportId,
}: GoogleMapPlaceholderProps) {
  const [animatedMarkers, setAnimatedMarkers] = useState<string[]>([]);
  const [zoom, setZoom] = useState(14);
  const [mapType, setMapType] = useState<'normal' | 'satellite' | 'terrain'>('normal');
  const [hoveredReportId, setHoveredReportId] = useState<string | null>(null);
  const [selectedMarkerForInfo, setSelectedMarkerForInfo] = useState<Report | null>(null);
  const [centerLat, setCenterLat] = useState(13.6929);
  const [centerLng, setCenterLng] = useState(-89.2182);
  const [mapScale, setMapScale] = useState(1);

  // Animate markers on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedMarkers(reports.map((r) => r.id));
    }, 300);
    return () => clearTimeout(timer);
  }, [reports]);

  // Update map scale based on zoom
  useEffect(() => {
    setMapScale(1 + (zoom - 10) * 0.1);
  }, [zoom]);

  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      baja: 'from-yellow-400 to-yellow-600',
      media: 'from-orange-400 to-orange-600',
      alta: 'from-red-400 to-red-600',
      critica: 'from-red-600 to-red-800',
    };
    return colors[severity] || 'from-yellow-400 to-yellow-600';
  };

  const getSeverityBadgeColor = (severity: string): string => {
    const colors: Record<string, string> = {
      baja: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      media: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      alta: 'bg-red-500/20 text-red-300 border-red-500/30',
      critica: 'bg-red-700/20 text-red-200 border-red-700/30',
    };
    return colors[severity] || 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  };

  const getSeverityLabel = (severity: string): string => {
    const labels: Record<string, string> = {
      baja: 'Baja',
      media: 'Media',
      alta: 'Alta',
      critica: 'Crítica',
    };
    return labels[severity] || 'Desconocida';
  };

  const getMapBackground = (): string => {
    switch (mapType) {
      case 'satellite':
        return 'from-[#2a3a4a] via-[#1a2a3a] to-[#0a1a2a]';
      case 'terrain':
        return 'from-[#1a3a1a] via-[#0a2a0a] to-[#001a00]';
      default:
        return 'from-[#1a1f2e] to-[#0B0F14]';
    }
  };

  const handleReportSelect = (report: Report) => {
    onReportSelect?.(report);
    setSelectedMarkerForInfo(report);
    // Simulate centering on marker
    setCenterLat(report.lat);
    setCenterLng(report.lng);
  };

  const handleMarkerClick = (report: Report) => {
    handleReportSelect(report);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 20));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 5));
  };

  const handleMyLocation = () => {
    // Simulate getting user location
    setCenterLat(13.6929);
    setCenterLng(-89.2182);
    setZoom(14);
  };

  const calculateMarkerPosition = (report: Report) => {
    // Simulate map projection
    const latDiff = report.lat - centerLat;
    const lngDiff = report.lng - centerLng;
    
    const xOffset = lngDiff * 100 * mapScale;
    const yOffset = latDiff * 100 * mapScale;
    
    return { x: xOffset, y: yOffset };
  };

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${getMapBackground()} rounded-lg overflow-hidden z-10`}>
      {/* Simulated background grid */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(74,222,128,0.1) 25%, rgba(74,222,128,0.1) 26%, transparent 27%, transparent 74%, rgba(74,222,128,0.1) 75%, rgba(74,222,128,0.1) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(74,222,128,0.1) 25%, rgba(74,222,128,0.1) 26%, transparent 27%, transparent 74%, rgba(74,222,128,0.1) 75%, rgba(74,222,128,0.1) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Map preview with simulated markers */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-5">
        {/* Simulated map background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getMapBackground()} z-0`} />

        {/* Simulated markers with smooth transitions */}
        <div className="absolute inset-0 flex items-center justify-center z-5">
          {reports.map((report) => {
            const isAnimated = animatedMarkers.includes(report.id);
            const isSelected = selectedReportId === report.id;
            const isHovered = hoveredReportId === report.id;
            const position = calculateMarkerPosition(report);

            return (
              <div
                key={report.id}
                className={`absolute transition-all duration-500 cursor-pointer ${
                  isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                } ${isSelected ? 'z-20' : isHovered ? 'z-15' : 'z-10'}`}
                style={{
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                }}
                onMouseEnter={() => setHoveredReportId(report.id)}
                onMouseLeave={() => setHoveredReportId(null)}
                onClick={() => handleMarkerClick(report)}
              >
                {/* Marker glow effect */}
                <div
                  className={`absolute inset-0 rounded-full blur-lg opacity-60 animate-pulse bg-gradient-to-r ${getSeverityColor(
                    report.severity
                  )}`}
                  style={{
                    width: '48px',
                    height: '48px',
                    transform: 'translate(-24px, -24px)',
                  }}
                />

                {/* Marker */}
                <div
                  className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-[#4ADE80] shadow-lg shadow-[#4ADE80]/50 scale-125'
                      : isHovered
                      ? 'border-[#00D4FF] shadow-lg shadow-[#00D4FF]/30 scale-110'
                      : 'border-gray-600 hover:border-[#4ADE80]'
                  } bg-gradient-to-r ${getSeverityColor(report.severity)}`}
                  style={{
                    transform: 'translate(-24px, -24px)',
                  }}
                >
                  <MapPin size={20} className="text-white" />
                </div>

                {/* Marker label on hover or selection */}
                {(isSelected || isHovered) && (
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-[#1a1f2e] border border-[rgba(74,222,128,0.3)] rounded-lg p-3 whitespace-nowrap z-30 shadow-xl animate-in fade-in duration-200">
                    <p className="text-sm font-semibold text-[#4ADE80]">{report.title}</p>
                    <p className="text-xs text-gray-400">{report.location}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Center point indicator */}
        <div className="absolute w-8 h-8 border-2 border-[#4ADE80] rounded-full opacity-30 z-5" />
        <div className="absolute w-4 h-4 bg-[#4ADE80] rounded-full z-5" />
      </div>

      {/* Zoom Controls - Top Right */}
      <div className="absolute top-6 right-6 z-20 space-y-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-[#1a1f2e] border border-[rgba(74,222,128,0.3)] rounded-lg flex items-center justify-center hover:bg-[#2a2f3e] hover:border-[#4ADE80] transition-all text-[#4ADE80] hover:shadow-lg hover:shadow-[#4ADE80]/20"
          title="Zoom in"
        >
          <Plus size={18} />
        </button>
        <div className="bg-[#1a1f2e] border border-[rgba(74,222,128,0.2)] rounded-lg p-2 text-xs text-gray-400 text-center w-10">
          {zoom}x
        </div>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-[#1a1f2e] border border-[rgba(74,222,128,0.3)] rounded-lg flex items-center justify-center hover:bg-[#2a2f3e] hover:border-[#4ADE80] transition-all text-[#4ADE80] hover:shadow-lg hover:shadow-[#4ADE80]/20"
          title="Zoom out"
        >
          <Minus size={18} />
        </button>
      </div>

      {/* Location Button - Bottom Right */}
      <div className="absolute bottom-32 right-6 z-20">
        <button
          onClick={handleMyLocation}
          className="w-10 h-10 bg-[#1a1f2e] border border-[rgba(74,222,128,0.3)] rounded-lg flex items-center justify-center hover:bg-[#2a2f3e] hover:border-[#4ADE80] transition-all text-[#4ADE80] hover:shadow-lg hover:shadow-[#4ADE80]/20"
          title="Mi ubicación"
        >
          <Navigation2 size={18} />
        </button>
      </div>

      {/* Map Type Selector - Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <div className="bg-[#1a1f2e] border border-[rgba(74,222,128,0.2)] rounded-lg overflow-hidden flex">
          {(['normal', 'satellite', 'terrain'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-3 py-2 text-xs font-medium transition-all ${
                mapType === type
                  ? 'bg-[#4ADE80]/20 text-[#4ADE80] border-r border-[rgba(74,222,128,0.3)]'
                  : 'text-gray-400 hover:text-[#4ADE80]'
              }`}
              title={`Mapa tipo ${type}`}
            >
              {type === 'normal' ? 'Normal' : type === 'satellite' ? 'Satélite' : 'Relieve'}
            </button>
          ))}
        </div>
      </div>

      {/* Legend - Bottom Right (Inside Map) */}
      <div className="absolute bottom-6 right-6 z-30 bg-[#1a1f2e] border border-[rgba(74,222,128,0.2)] rounded-lg p-4 backdrop-blur-sm max-w-xs">
        <p className="text-xs font-semibold text-[#4ADE80] mb-3">Niveles de Gravedad</p>
        <div className="space-y-2">
          {(['baja', 'media', 'alta', 'critica'] as const).map((severity) => (
            <div key={severity} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getSeverityColor(severity)}`} />
              <span className="text-xs text-gray-400 capitalize">{getSeverityLabel(severity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Window - Popup with Report Details */}
      {selectedMarkerForInfo && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-80 bg-[#1a1f2e] border border-[rgba(74,222,128,0.3)] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Close button */}
          <button
            onClick={() => setSelectedMarkerForInfo(null)}
            className="absolute top-3 right-3 z-50 w-6 h-6 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded flex items-center justify-center text-red-400 transition-all"
          >
            <X size={14} />
          </button>

          {/* Report image placeholder */}
          <div className="w-full h-40 bg-gradient-to-br from-[#2a3a4a] to-[#1a2a3a] flex items-center justify-center border-b border-[rgba(74,222,128,0.2)]">
            <MapPin size={32} className="text-[#4ADE80]/50" />
          </div>

          {/* Report details */}
          <div className="p-4 space-y-3">
            {/* Title and severity */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">{selectedMarkerForInfo.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{selectedMarkerForInfo.type}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${getSeverityBadgeColor(selectedMarkerForInfo.severity)}`}>
                {getSeverityLabel(selectedMarkerForInfo.severity)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 text-xs">
              <MapPin size={14} className="text-[#00D4FF] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-400">Ubicación</p>
                <p className="text-white font-medium">{selectedMarkerForInfo.location}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-2 text-xs">
              <Zap size={14} className="text-[#4ADE80] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-400">Fecha</p>
                <p className="text-white font-medium">{selectedMarkerForInfo.date}</p>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs">
              <p className="text-gray-400 mb-1">Descripción</p>
              <p className="text-white bg-[#0B0F14] p-2 rounded border border-[rgba(74,222,128,0.1)]">
                {selectedMarkerForInfo.description}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-[#4ADE80] rounded-full" />
              <span className="text-gray-400">Estado: <span className="text-[#4ADE80] font-medium">Reportado</span></span>
            </div>

            {/* View Detail Button */}
            <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-[#4ADE80] to-[#00D4FF] text-[#0B0F14] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#4ADE80]/30 transition-all text-sm">
              Ver detalle completo
            </button>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B0F14] to-transparent p-6 z-10">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle size={20} className="text-[#00D4FF] flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Mapa en demostración</h3>
            <p className="text-xs text-gray-400">
              El mapa interactivo estará disponible cuando se configure la API Key de Google Maps.
            </p>
          </div>
        </div>

        {/* Report list preview */}
        <div className="space-y-2 max-h-32 overflow-y-auto pointer-events-auto">
          {reports.map((report) => (
            <div
              key={report.id}
              onMouseEnter={() => setHoveredReportId(report.id)}
              onMouseLeave={() => setHoveredReportId(null)}
              onClick={() => handleReportSelect(report)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedReportId === report.id
                  ? 'border-[#4ADE80] bg-[rgba(74,222,128,0.1)]'
                  : hoveredReportId === report.id
                  ? 'border-[#00D4FF] bg-[rgba(0,212,255,0.05)]'
                  : 'border-[rgba(74,222,128,0.2)] bg-[rgba(74,222,128,0.05)] hover:border-[#4ADE80]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{report.title}</p>
                  <p className="text-xs text-gray-400 truncate">{report.location}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${getSeverityBadgeColor(
                    report.severity
                  )}`}
                >
                  {report.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated pulse effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 border border-[#4ADE80]/20 rounded-full animate-pulse" />
          <div className="w-48 h-48 border border-[#4ADE80]/10 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
}
