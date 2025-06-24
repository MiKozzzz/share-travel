import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Coordinate = [number, number]; // [lat, lng]

type MapaTrasyORSProps = {
  punkty_trasy: [number, number][]; // [lng, lat] for API
  przystanki: { nazwa: string; lat: number; lng: number }[];
};

const API_KEY = "5b3ce3597851110001cf62481d3e0a9ee8d941fc838015801df2e5d0";

function FitBounds({ bounds }: { bounds: Coordinate[] }) {
  const map = useMap();

  useEffect(() => {
    if (bounds.length > 0) {
      const leafletBounds = L.latLngBounds(bounds);
      map.fitBounds(leafletBounds, { padding: [50, 50] });
    }
  }, [bounds]);

  return null;
}

export default function MapaTrasyORS({ punkty_trasy, przystanki }: MapaTrasyORSProps) {
  const [trasa, setTrasa] = useState<Coordinate[]>([]);

  useEffect(() => {
    if (punkty_trasy.length < 2) return;

    fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ coordinates: punkty_trasy }),
    })
      .then(res => res.json())
      .then(data => {
        const coords = data.features[0].geometry.coordinates;
        const latLngCoords = coords.map((c: number[]) => [c[1], c[0]] as Coordinate); // [lat, lng]
        setTrasa(latLngCoords);
      })
      .catch(err => console.error("Błąd pobierania trasy:", err));
  }, [punkty_trasy]);

  return (
    <MapContainer
      center={[52, 19]}
      zoom={7}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {trasa.length > 0 && (
        <>
          <Polyline positions={trasa} color="blue" />
          <FitBounds bounds={trasa} />
        </>
      )}

      {przystanki.map((p, idx) => (
        <Marker key={idx} position={[p.lat, p.lng]}>
          <Popup>{p.nazwa}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}


