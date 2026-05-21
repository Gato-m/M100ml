// src/components/MapView.js
import { madonaBoundary } from "../src/data/MadonaBoundary.js";

export function getMapHtml() {
  return `
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

    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [26.225, 56.85],
      zoom: 12
    });

    map.on('load', () => {
      map.addSource('madona-boundary', {
        type: 'geojson',
        data: boundary
      });

      map.addLayer({
        id: 'madona-boundary-fill',
        type: 'fill',
        source: 'madona-boundary',
        paint: {
          'fill-color': '#ff8800',
          'fill-opacity': 0.25
        }
      });

      map.addLayer({
        id: 'madona-boundary-outline',
        type: 'line',
        source: 'madona-boundary',
        paint: {
          'line-color': '#ff5500',
          'line-width': 3
        }
      });

      const bounds = new maplibregl.LngLatBounds();
      boundary.geometry.coordinates[0].forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 20 });
    });
  </script>
</body>
</html>
`;
}
