import festivalArea from "../data/area.json";
import { madonaBoundary } from "../data/MadonaBoundary";

export const getMapHtml = () => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
  </style>
  <link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
</head>
<body>
  <div id="map"></div>

  <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
  <script>
    const boundary = ${JSON.stringify(madonaBoundary)};
    const area = ${JSON.stringify(festivalArea)};

    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_D6rA4zTHduk6KOKTXzGB',
      center: [26.225, 56.85],
      zoom: 12
    });

    map.on('load', () => {

      // Boundary
      map.addSource('madona-boundary', {
        type: 'geojson',
        data: boundary
      });

      map.addLayer({
        id: 'madona-boundary-fill',
        type: 'fill',
        source: 'madona-boundary',
        paint: {
          'fill-color': '#ffff0047',
          'fill-opacity': 0.2
        }
      });

      map.addLayer({
        id: 'madona-boundary-outline',
        type: 'line',
        source: 'madona-boundary',
        paint: {
          'line-color': '#fffbe0',
          'line-width': 8
        }
      });

      // Festival area
      map.addSource("festival-area", {
        type: "geojson",
        data: area
      });

      map.addLayer({
        id: "festival-area-fill",
        type: "fill",
        source: "festival-area",
        paint: {
          "fill-color": "#ff8800",
          "fill-opacity": 0.3
        }
      });

      map.addLayer({
        id: "festival-area-outline",
        type: "line",
        source: "festival-area",
        paint: {
          "line-color": "#ff8800",
          "line-width": 2
        }
      });

      // Fit boundary
      const bounds = new maplibregl.LngLatBounds();
      boundary.geometry.coordinates[0].forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 20 });
    });
  </script>
</body>
</html>
`;
