import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Polygon, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
import eventData from "../../data/satiksme.json";

export default function MapScreen() {
  const mapRef = useRef(null);
  const [mode, setMode] = useState<"car" | "walk">("car");
  const initialRegion = {
    latitude: 56.85409484130903,
    longitude: 26.22099114195495,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const recenterMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 500);
    }
  };

  // Convert [lng, lat] to {latitude, longitude}
  const eventAreaCoords = eventData.event_area.coordinates.map(
    ([lng, lat]) => ({ latitude: lat, longitude: lng }),
  );

  // ...existing code...

  return (
    <View style={{ flex: 1 }}>
      {/* ...existing code... */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        minZoomLevel={5}
        maxZoomLevel={19}
        mapType="none"
      >
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
          tileSize={256}
        />
        <Polygon
          coordinates={eventAreaCoords}
          strokeColor={mode === "car" ? "#FF0000" : "#3CB371"}
          fillColor={
            mode === "car" ? "rgba(255,0,0,0.2)" : "rgba(60,179,113,0.2)"
          }
          strokeWidth={1}
        />
        {/* ...existing code... */}
        {/* ...existing code... */}
      </MapView>
      {/* Pogas kartes labajā apakšējā stūrī */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={recenterMap}>
          <Ionicons name="locate" size={28} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="car" size={28} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="walk" size={28} color="#222" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    alignItems: "flex-end",
    gap: 10,
  },
  iconButton: {
    backgroundColor: "#fff",
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
