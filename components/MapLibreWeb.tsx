import { WebView } from "react-native-webview";

const madonaLight = {
  version: 8,
  name: "Madona Light",
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#f2f2f7",
      },
    },
    {
      id: "raster",
      type: "raster",
      source: "osm",
      paint: {
        "raster-opacity": 0.55,
      },
    },
  ],
};

const madonaDark = {
  version: 8,
  name: "Madona Dark",
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#4f4f51",
      },
    },
    {
      id: "raster",
      type: "raster",
      source: "osm",
      paint: {
        "raster-opacity": 0.5,
      },
    },
  ],
};

const lightJson = JSON.stringify(madonaLight);
const darkJson = JSON.stringify(madonaDark);

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <style>
    html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
  </style>
  <link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
  <script>
    const lightStyle = ${lightJson};
    const darkStyle = ${darkJson};

    let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let style = isDark ? darkStyle : lightStyle;

    const map = new maplibregl.Map({
      container: 'map',
      style,
      center: [26.22105688513661, 56.854071221567],
      zoom: 13
    });

    new maplibregl.Marker({ color: "#FF8A00" })
      .setLngLat([26.22105688513661, 56.854071221567])
      .addTo(map);

    window.setMapTheme = function() {
      isDark = !isDark;
      map.setStyle(isDark ? darkStyle : lightStyle);
    };
  </script>
</body>
</html>
`;

import { forwardRef } from "react";

const MapLibreWeb = forwardRef(function MapLibreWeb(props, ref) {
  return (
    <WebView
      ref={ref}
      originWhitelist={["*"]}
      source={{ html }}
      style={{ flex: 1 }}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      mixedContentMode="always"
    />
  );
});

export default MapLibreWeb;
