import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";

type Coordinate = [number, number]; // [lat, lng]

type MapaTrasyORSProps = {
  punkty: Coordinate[]; // wiele punktów trasy [lat, lng]
};

const API_KEY = "5b3ce3597851110001cf624844376cc89897404181958bd72c55e233";



export default function MapaTrasyORS({ punkty }: MapaTrasyORSProps) {
  const [trasa, setTrasa] = useState<Coordinate[]>([]);

  useEffect(() => {
    if (punkty.length < 2) return; // minimum 2 punkty
    // Konwersja na format [lng, lat] wymagany przez ORS
    const coordsForApi = punkty.map(([lat, lng]) => [lng, lat]);

    fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: coordsForApi,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const coords = data.features[0].geometry.coordinates; // [ [lng, lat], ... ]
        // Konwersja do [lat, lng] na potrzeby Leaflet
        const latLngCoords = coords.map((c: number[]) => [c[1], c[0]] as Coordinate);
        setTrasa(latLngCoords);
      })
      .catch((err) => console.error("Błąd pobierania trasy:", err));
  }, [punkty]);

  // Centrum mapy na środek pierwszego i ostatniego punktu albo [0,0]
  const center: [number, number] = trasa.length > 1
    ? [
        (trasa[0][0] + trasa[trasa.length - 1][0]) / 2,
        (trasa[0][1] + trasa[trasa.length - 1][1]) / 2,
      ]
    : trasa.length === 1
    ? [trasa[0][0], trasa[0][1]]
    : [0, 0];

  return (
    <MapContainer center={center} zoom={7} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {trasa.length > 0 && <Polyline positions={trasa} color="blue" />}
    </MapContainer>
  );
}

