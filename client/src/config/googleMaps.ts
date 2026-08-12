const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

export const GOOGLE_MAPS_CONFIG = {
  apiKey: GOOGLE_MAPS_API_KEY,
  isConfigured: !!GOOGLE_MAPS_API_KEY,
  defaultCenter: { lat: -12.2104, lng: -76.9244 },
  mapOptions: {
    zoom: 14,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
      },
    ],
  },
};

let scriptLoaded = false;

export function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scriptLoaded || window.google?.maps) {
      resolve();
      return;
    }

    if (!GOOGLE_MAPS_CONFIG.apiKey) {
      reject(new Error('Google Maps API Key not configured'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
}

export function getMarkerIcon(severity: string): string {
  const icons: Record<string, string> = {
    baja: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    media: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
    alta: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    critica: 'http://maps.google.com/mapfiles/ms/icons/darkred-dot.png',
  };
  return icons[severity] || icons.baja;
}
