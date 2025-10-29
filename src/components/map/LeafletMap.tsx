import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WteSite } from '@/hooks/useWteSites';

// Fix for default markers not showing
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  sites: WteSite[];
  center?: [number, number];
  zoom?: number;
  onSiteClick?: (site: WteSite) => void;
}

// Component to fit bounds when sites change
function FitBounds({ sites }: { sites: WteSite[] }) {
  const map = useMap();

  useEffect(() => {
    if (sites && sites.length > 0) {
      const bounds = L.latLngBounds(
        sites.map(site => [site.latitude, site.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [sites, map]);

  return null;
}

// Custom marker icon based on site status
const getMarkerIcon = (status: string) => {
  const colors: Record<string, string> = {
    operational: '#22c55e',
    'under-construction': '#f59e0b',
    planned: '#3b82f6',
    'under-maintenance': '#ef4444',
  };

  const color = colors[status] || '#6b7280';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background-color: white;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

export const LeafletMap = ({ 
  sites, 
  center = [0, 0], 
  zoom = 2,
  onSiteClick 
}: LeafletMapProps) => {
  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {sites.map((site) => (
          <Marker
            key={site.id}
            position={[site.latitude, site.longitude]}
            icon={getMarkerIcon(site.status)}
            eventHandlers={{
              click: () => onSiteClick?.(site),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-1">{site.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{site.location_name}</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Technology:</span> {site.technology}</p>
                  <p><span className="font-semibold">Capacity:</span> {site.capacity} MW</p>
                  <p><span className="font-semibold">Status:</span> <span className="capitalize">{site.status.replace('-', ' ')}</span></p>
                  {site.environmental_score && (
                    <p><span className="font-semibold">Environmental Score:</span> {site.environmental_score}/100</p>
                  )}
                  {site.economic_score && (
                    <p><span className="font-semibold">Economic Score:</span> {site.economic_score}/100</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {sites.length > 0 && <FitBounds sites={sites} />}
      </MapContainer>
    </div>
  );
};
