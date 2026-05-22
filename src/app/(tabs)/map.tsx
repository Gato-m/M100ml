import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, {
  Marker,
  Polygon,
  PROVIDER_DEFAULT,
  UrlTile,
} from "react-native-maps";
import iconMap from "../../data/iconMap";
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

  // Icon transforms for walk mode entry and staff_entry icons (by entry id)
  const walkIconTransforms: Record<string, any[]> = {
    // Example: rotate and move down Blaumaņa iela
    "entry-4": [{ rotate: "-5deg" }, { translateY: 5 }],
    // Add more entries as needed
  };

  function getIconTransform(id: string) {
    return walkIconTransforms[id]
      ? [{ transform: walkIconTransforms[id] }]
      : [];
  }

  return (
    <View style={{ flex: 1 }}>
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
        {/* Car mode: show no_entry icons and street names */}
        {mode === "car" &&
          eventData.no_entry.map((entry) => (
            <Marker
              key={entry.id}
              coordinate={{
                latitude: entry.coordinates[0],
                longitude: entry.coordinates[1],
              }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={{ alignItems: "center" }}>
                <View style={{ marginBottom: 2 }}>
                  <Text style={styles.streetLabel}>{entry.name}</Text>
                </View>
                <View>
                  <Image
                    source={iconMap[entry.icon]}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </Marker>
          ))}
        {/* Walk mode: show entry icons and street names, and staff_entry icons */}
        {mode === "walk" &&
          eventData.entry.map((entry) => {
            const iconStyle = [styles.iconImage, ...getIconTransform(entry.id)];
            return (
              <Marker
                key={entry.id}
                coordinate={{
                  latitude: entry.coordinates[0],
                  longitude: entry.coordinates[1],
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={{ alignItems: "center" }}>
                  <View style={{ marginBottom: 2 }}>
                    <Text style={styles.streetLabel}>{entry.streetName}</Text>
                  </View>
                  <View>
                    <Image
                      source={iconMap[entry.icon]}
                      style={iconStyle}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </Marker>
            );
          })}
        {mode === "walk" &&
          eventData.staff_entry &&
          eventData.staff_entry.map((entry, idx) => (
            <Marker
              key={entry.id || `staff-${idx}`}
              coordinate={{
                latitude: entry.coordinates[0],
                longitude: entry.coordinates[1],
              }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={{ alignItems: "center" }}>
                <View style={{ marginBottom: 2 }}>
                  <Text style={styles.streetLabel}>Personāla ieeja</Text>
                </View>
                <View>
                  <Image
                    source={iconMap[entry.icon]}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </Marker>
          ))}
      </MapView>
      {/* New buttons above recenter */}
      <View
        style={{
          position: "absolute",
          right: 20,
          bottom: 80,
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "car" && { backgroundColor: "#e0e0e0" },
          ]}
          activeOpacity={0.7}
          onPress={() => setMode("car")}
        >
          <Ionicons name="car" size={24} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "walk" && { backgroundColor: "#e0e0e0" },
          ]}
          activeOpacity={0.7}
          onPress={() => setMode("walk")}
        >
          <Ionicons name="walk" size={24} color="#222" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={recenterMap}
        style={styles.recenterButton}
        activeOpacity={0.7}
      >
        <Ionicons name="locate" size={28} color="#222" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  recenterButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modeButton: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 0,
  },
  streetLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#222",
    backgroundColor: "rgba(255,255,255)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: -30,
    overflow: "hidden",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#b3b3b3",
  },
  iconImage: {
    width: 24,
    height: 24,
  },
});
