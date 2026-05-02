"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { hospitalData, universityData } from '@/public/staticData';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const hospitalIcon = new L.Icon({
  // Hospital Building Icon
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448513.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const universityIcon = new L.Icon({
  // University Location Icon
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/16344/16344440.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const residentialIcon = new L.Icon({
  // Residential Area Icon
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/17573/17573474.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component that geocodes area name and draws its border outline
const AreaHighlighter = ({
  areaName,
  zoomLevel,
  onComplete
}: {
  areaName: string;
  zoomLevel: number;
  onComplete?: () => void
}) => {
  const map = useMap();
  const [highlightLayer, setHighlightLayer] = useState<L.Layer | null>(null);

  useEffect(() => {
    if (!areaName) {
      onComplete?.(); // Notify immediately if there is nothing to highlight
      return;
    }

    const geocodeArea = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(areaName)}&format=json&limit=1&polygon_geojson=1`
        );
        const data = await response.json();

        if (data && data[0]) {
          const { lat, lon, boundingbox, geojson } = data[0];

          if (highlightLayer) map.removeLayer(highlightLayer);

          let boundaryLayer: L.Layer | null = null;

          // 1. Draw the layer
          if (geojson && (geojson.type === 'Polygon' || geojson.type === 'MultiPolygon')) {
            boundaryLayer = L.geoJSON(geojson, {
              style: { color: "#ff7800", weight: 3, fill: false, opacity: 0.8 }
            }).addTo(map);
          } else {
            const bounds = L.latLngBounds(
              [parseFloat(boundingbox[0]), parseFloat(boundingbox[2])],
              [parseFloat(boundingbox[1]), parseFloat(boundingbox[3])]
            );
            boundaryLayer = L.rectangle(bounds, { color: "#ff7800", weight: 3, fill: false }).addTo(map);
          }

          setHighlightLayer(boundaryLayer);

          // 2. Setup "Move End" listener
          // This ensures we notify only AFTER the zoom animation finishes
          map.once('moveend', () => {
            onComplete?.();
          });

          // 3. Trigger the move/zoom
          if (zoomLevel) {
            map.setView([parseFloat(lat), parseFloat(lon)], zoomLevel, { animate: true });
          } else {
            const bounds = L.latLngBounds(
              [parseFloat(boundingbox[0]), parseFloat(boundingbox[2])],
              [parseFloat(boundingbox[1]), parseFloat(boundingbox[3])]
            );
            map.fitBounds(bounds, { animate: true });
          }
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        onComplete?.(); // Notify even on error so loader stops
      }
    };

    geocodeArea();

    return () => {
      if (highlightLayer) {
        map.removeLayer(highlightLayer);
      }
    };
  }, [areaName, zoomLevel, map]);

  return null;
};

// Main Map Component accepting props
interface LeafLetMapProps {
  areaName?: string;
  zoomLevel?: number;
  onFinishZoom?: () => void;
  data: any;
}

const USAMapWithPointers = ({ areaName, zoomLevel, onFinishZoom, data }: LeafLetMapProps) => {

  console.log("Map received data:", data?.universities); // Debug log to verify data structure

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={zoomLevel || 4}
      minZoom={3}
      maxZoom={10}
      style={{ height: "50vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <AreaHighlighter areaName={areaName || ""} zoomLevel={zoomLevel || 4} onComplete={onFinishZoom} />

      <MarkerClusterGroup>
        {data?.facilities?.map((hospital) => (
          <Marker key={`hospital-${hospital.id}`} position={[Number(hospital.latitude), Number(hospital.longitude)]} icon={hospitalIcon}>
              <Popup autoPan={false} closeButton={false}>
              <div className="text-xs p-1">
                <strong className="text-red-600 block mb-1">{hospital.name}</strong>
                <p className="flex items-center gap-1">
                  📍 <span>{hospital.location}</span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        {data?.universities?.map((university) => {
          console.log("Rendering university marker:", university); // Debug log for each university
          return (
            <Marker key={`university-${university.id}`} position={[Number(university.latitude), Number(university.longitude)]} icon={universityIcon}>
              <Popup autoPan={false} closeButton={false}>
                <div className="text-xs p-1">
                  {/* University Name */}
                  <strong className="text-indigo-700 block mb-1">
                    {university.name}
                  </strong>

                  {/* Psychology Degrees */}
                  {university.psychology_degrees?.length > 0 && (
                    <p className="mb-1">
                      🧠 <strong>Psychology:</strong> {university.psychology_degrees.join(", ")}
                    </p>
                  )}

                  {/* Neuroscience Degrees */}
                  {university.neuroscience_degrees?.length > 0 && (
                    <p className="mb-1">
                      🔬 <strong>Neuroscience:</strong> {university.neuroscience_degrees.join(", ")}
                    </p>
                  )}

                  {/* Fallback if no degrees are listed yet */}
                  {university.psychology_degrees?.length === 0 && university.neuroscience_degrees?.length === 0 && (
                    <p className="text-gray-500 italic">No specific degrees listed</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
        {data?.residencies?.map((residency) => (
          <Marker key={`residency-${residency.id}`} position={[Number(residency.latitude), Number(residency.longitude)]} icon={residentialIcon}>
              <Popup autoPan={false} closeButton={false}>
              <div className="text-xs p-1">
                {/* Mapping program_name based on your JSON snippet */}
                <strong className="text-green-700 block mb-1">
                  {residency.program_name}
                </strong>

                {/* Handling degree_types array */}
                {residency.degree_types?.length > 0 && (
                  <p className="mb-1">
                    🎓 <strong>Degrees:</strong> {residency.degree_types.join(", ")}
                  </p>
                )}

                <p className="flex items-center gap-1">
                  📍 <span>{residency.location}</span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default USAMapWithPointers;