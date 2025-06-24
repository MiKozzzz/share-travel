import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";

type Props = {
  punkty: LatLngExpression[];
};

export default function MapaTrasy({ punkty }: Props) {
  if (punkty.length === 0) return <p>Brak danych trasy.</p>;

  return (
    <MapContainer
      center={punkty[0]}
      zoom={7}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Polyline positions={punkty} color="blue" />
      <Marker position={punkty[0]} />
      <Marker position={punkty[punkty.length - 1]} />
    </MapContainer>
  );
}
