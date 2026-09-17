import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Fix for default marker icons in Leaflet with bundlers like Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom markers based on classification
const pureIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const adulteratedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export interface MapDataPoint {
  testId: string;
  latitude: number;
  longitude: number;
  classification: string;
  adulterant: string | null;
  confidence: number;
  timestamp: string;
}

interface GeographicMapProps {
  data: MapDataPoint[];
  center?: [number, number];
  zoom?: number;
  onSelectTest: (test: MapDataPoint) => void;
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function GeographicMap({ data, center = [18.5204, 73.8567], zoom = 12, onSelectTest }: GeographicMapProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full rounded-md overflow-hidden border shadow-sm z-0 relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {data.map((point) => {
          if (!point.latitude || !point.longitude) return null;
          
          const isPure = point.classification === 'PURE';
          
          return (
            <Marker 
              key={point.testId} 
              position={[point.latitude, point.longitude]}
              icon={isPure ? pureIcon : adulteratedIcon}
              eventHandlers={{
                click: () => onSelectTest(point),
              }}
            >
              <Popup className="rounded-md">
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-sm border-b pb-1 mb-2">{point.testId}</h3>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sample:</span>
                      <span className="font-medium">Milk</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Classification:</span>
                      <Badge variant={isPure ? 'success' : 'warning'} className="text-[10px] px-1.5 h-4">
                        {isPure ? 'Pure' : 'Adulterated'}
                      </Badge>
                    </div>

                    {!isPure && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Adulterant:</span>
                        <span className="text-amber-600 font-semibold">{point.adulterant}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium">
                        {point.confidence ? `${(point.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium text-[10px]">
                        {new Date(point.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full mt-3 h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tests/${point.testId}`);
                    }}
                  >
                    View Test
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
