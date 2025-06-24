// w components/MapaTrasy.tsx
import { MapContainer, TileLayer, Polyline } from "react-leaflet";

type MapaTrasyProps = {
  punkty: [number, number][]; // lista punktów [lat, lng]
};

export default function MapaTrasy({ punkty }: MapaTrasyProps) {
  const center: [number, number] = punkty.length > 0 ? punkty[0] : [0, 0];

  return (
    <div style={{ height: 300, width: "100%" }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Polyline positions={punkty} color="blue" />
      </MapContainer>
    </div>
  );
}



