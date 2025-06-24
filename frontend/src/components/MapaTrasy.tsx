import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  punkty: [number, number][]; // tablica par współrzędnych [lat, lng]
};

export default function MapaTrasy({ punkty }: Props) {
  if (!punkty || punkty.length < 2) {
    return <p className="text-gray-600">Brak danych trasy.</p>;
  }

  const center = punkty[0];

  return (
    <MapContainer center={center} zoom={6} style={{ height: "300px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      <Polyline positions={punkty} color="blue" />
    </MapContainer>
  );
}

