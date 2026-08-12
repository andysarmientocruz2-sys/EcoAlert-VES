# Google Maps Integration - Setup Guide

## Overview

EcoAlert VES includes a complete Google Maps integration that is ready to use. Currently, it displays a professional placeholder while waiting for the API Key to be configured.

## Current Status

✅ **Fully Implemented:**
- GoogleMap component with all features
- GoogleMapPlaceholder for demo mode
- Configuration system
- Marker management
- Info windows
- Geolocation support
- Address search
- Map type switching
- Clustering preparation

⏳ **Waiting for:**
- Google Maps API Key

## Setup Instructions

### Step 1: Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Geometry Library
   - Drawing Library
   - Visualization Library

4. Create an API Key:
   - Go to "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API Key

### Step 2: Configure the API Key in Manus

1. Go to the Manus Management UI
2. Navigate to **Settings** → **Secrets**
3. Add a new secret:
   - **Key:** `VITE_GOOGLE_MAPS_API_KEY`
   - **Value:** Your Google Maps API Key from Step 1

### Step 3: Restart the Dev Server

After adding the secret, restart the dev server:
```bash
npm run dev
```

The map will automatically load and display real Google Maps.

## File Locations

### Configuration File
**Path:** `client/src/config/googleMaps.ts`

This file contains:
- API Key loading from environment variables
- Default map center and zoom
- Map styling (dark theme matching EcoAlert VES)
- Marker colors by severity
- Pollution type definitions

### Google Map Component
**Path:** `client/src/components/GoogleMap.tsx`

Features:
- Real-time marker rendering
- Info windows with report details
- User geolocation
- Address search
- Map type switching (roadmap, satellite, terrain, hybrid)
- Marker clustering preparation

### Placeholder Component
**Path:** `client/src/components/GoogleMapPlaceholder.tsx`

Professional demo display showing:
- Animated simulated markers
- Report list preview
- Map controls simulation
- Zoom indicator
- Report count

### Map Page
**Path:** `client/src/pages/MapPage.tsx`

Integrates both components and handles:
- Switching between real map and placeholder
- Report filtering
- Report selection
- Sidebar synchronization

## Features Implemented

### ✅ Markers
- Color-coded by severity (baja, media, alta, crítica)
- Custom SVG icons
- Click handlers for info windows
- Animated entrance

### ✅ Zoom
- Default zoom level: 14
- Zoom controls enabled
- Preset zoom levels for different scales
- Smooth zoom transitions

### ✅ Controls
- Zoom controls
- Map type selector
- Fullscreen button
- Street View
- All standard Google Maps controls

### ✅ Geolocation
- Automatic user location detection
- Blue marker for user position
- Map centers on user location
- Fallback to default center if denied

### ✅ Map Type Switching
- Roadmap (default)
- Satellite
- Terrain
- Hybrid

### ✅ Info Windows
- Report title, type, severity
- Location and date
- Description
- Color-coded severity badge

### ✅ Sidebar Sync
- Click marker → sidebar updates
- Click sidebar item → map centers
- Selected state highlighting
- Smooth transitions

### ✅ Address Search
- Geocoding integration
- Search any address
- Auto-center on result
- Fallback handling

### ✅ Clustering
- Infrastructure prepared
- Ready for MarkerClusterer library
- Optimized for 1000+ markers

## Environment Variables

### Required
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Optional (already configured)
```
VITE_FRONTEND_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...
```

## Estimated Costs

### Google Maps Pricing (as of 2024)

| Feature | Cost | Monthly Limit |
|---------|------|---------------|
| Maps JavaScript API | $7 per 1000 loads | 25,000 free |
| Markers | Included | Unlimited |
| Info Windows | Included | Unlimited |
| Geocoding | $5 per 1000 requests | 5,000 free |
| Places API | $7 per 1000 requests | 5,000 free |
| Directions | $5 per 1000 requests | 5,000 free |

**Estimated Monthly Cost for EcoAlert VES:**
- Small deployment (< 10,000 users): $0-50/month
- Medium deployment (10,000-100,000 users): $50-200/month
- Large deployment (> 100,000 users): $200-1000+/month

**Recommendation:** Set up billing alerts in Google Cloud Console to monitor costs.

## Testing the Integration

### Before API Key (Placeholder Mode)
1. Navigate to `/mapa` in the app
2. You should see:
   - Animated simulated markers
   - Report list preview
   - Professional placeholder design
   - No errors in console

### After API Key (Real Map Mode)
1. Add your API Key to Manus Secrets
2. Restart the dev server
3. Navigate to `/mapa`
4. You should see:
   - Real Google Map
   - Your location (blue marker)
   - All reports as colored markers
   - Clickable markers with info windows
   - Working search and controls

### Verification Checklist

- [ ] Map loads without errors
- [ ] Your location appears (blue marker)
- [ ] Report markers are visible and color-coded
- [ ] Clicking a marker shows info window
- [ ] Clicking sidebar item centers map
- [ ] Map type selector works
- [ ] Search functionality works
- [ ] Geolocation permission dialog appears
- [ ] No console errors

## Troubleshooting

### Map shows blank/gray area
- Check API Key is correct
- Verify Maps JavaScript API is enabled
- Check browser console for errors

### Markers not showing
- Verify report data is loading
- Check marker coordinates are valid
- Ensure marker colors are defined

### Search not working
- Verify Geocoding API is enabled
- Check address format
- Try a well-known location

### Info windows not appearing
- Check click event listeners are attached
- Verify report data has all required fields
- Check info window content HTML

### Geolocation not working
- Check browser permissions
- Verify HTTPS is used (required for geolocation)
- Check browser console for permission errors

## Support

For issues with:
- **Google Maps API:** [Google Maps Documentation](https://developers.google.com/maps/documentation)
- **EcoAlert VES Integration:** Check `client/src/config/googleMaps.ts` and `client/src/components/GoogleMap.tsx`
- **Manus Secrets:** Use Manus Management UI Settings → Secrets

## Next Steps

1. ✅ Get Google Maps API Key
2. ✅ Add to Manus Secrets as `VITE_GOOGLE_MAPS_API_KEY`
3. ✅ Restart dev server
4. ✅ Test map functionality
5. ✅ Monitor API usage in Google Cloud Console
6. ⏳ (Optional) Implement advanced features like clustering, heatmaps, etc.
