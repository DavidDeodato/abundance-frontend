import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
// @ts-ignore
import 'leaflet/dist/leaflet.css';
// @ts-ignore
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import { FeatureCollection } from 'geojson';

interface InteractiveMapProps {
  onAreaDefined: (geojson: FeatureCollection) => void;
  center?: [number, number];
  zoom?: number;
  initialGeoJSON?: FeatureCollection | null;
  readOnly?: boolean;
}

const GeomanControls: React.FC<{ onAreaDefined: (geojson: FeatureCollection) => void; readOnly?: boolean, initialGeoJSON?: FeatureCollection | null }> = ({ onAreaDefined, readOnly, initialGeoJSON }) => {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  useEffect(() => {
    // A correção chave: força o mapa a recalcular o seu tamanho após um curto atraso.
    // Isto garante que o mapa se renderize corretamente mesmo que o seu contentor mude de tamanho.
    const timer = setTimeout(() => {
        map.invalidateSize();
    }, 100);

    drawnItemsRef.current.addTo(map);

    // Adiciona o GeoJSON inicial se existir
    if (initialGeoJSON) {
        const initialLayer = L.geoJSON(initialGeoJSON);
        drawnItemsRef.current.addLayer(initialLayer);
        if (initialLayer.getBounds().isValid()) {
            map.fitBounds(initialLayer.getBounds().pad(0.1));
        }
    }

    if (!readOnly) {
        map.pm.addControls({
            position: 'topleft',
            drawCircle: false,
            drawMarker: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawText: false,
            cutPolygon: false,
            rotateMode: false,
        });

        map.on('pm:create', (e) => {
            drawnItemsRef.current.clearLayers();
            const layer = e.layer;
            drawnItemsRef.current.addLayer(layer);
            const geojson = drawnItemsRef.current.toGeoJSON() as FeatureCollection;
            onAreaDefined(geojson);
        });
        
        map.on('pm:remove', () => {
            drawnItemsRef.current.clearLayers();
            const geojson = drawnItemsRef.current.toGeoJSON() as FeatureCollection;
            onAreaDefined(geojson);
        });
    }

    return () => {
      clearTimeout(timer); // Limpa o temporizador ao desmontar o componente
      if (map.pm) {
        map.pm.removeControls();
        map.off('pm:create');
        map.off('pm:remove');
      }
    };
  }, [map, onAreaDefined, readOnly, initialGeoJSON]);

  return null;
};

const MapController: React.FC<{ center?: [number, number], zoom?: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center && zoom) {
            map.flyTo(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onAreaDefined, center, zoom, initialGeoJSON, readOnly = false }) => {
  return (
    <MapContainer
      center={center || [-14.235, -51.925]}
      zoom={zoom || 4}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg shadow-inner"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
      <GeomanControls onAreaDefined={onAreaDefined} readOnly={readOnly} initialGeoJSON={initialGeoJSON} />
      <MapController center={center} zoom={zoom} />
    </MapContainer>
  );
};

export default InteractiveMap;