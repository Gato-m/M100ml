import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
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
          strokeColor="#FF0000"
          fillColor="rgba(255,0,0,0.2)"
          strokeWidth={1}
        />
        {/* No entry icons */}
        {eventData.no_entry.map((entry) => (
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
                <Image source={iconMap[entry.icon]} style={styles.iconImage} />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
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
  streetLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#222",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: -26,
    overflow: "hidden",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#e02020",
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
