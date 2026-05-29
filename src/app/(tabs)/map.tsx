import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, {
  Marker,
  Polygon,
  PROVIDER_DEFAULT,
  UrlTile,
} from "react-native-maps";
import iconMap from "../../data/iconMap";
import eventData from "../../data/satiksme.json";

export default function MapScreen() {
  // Example: specify transform for each entry icon by index (or id)
  // You should fill in the correct values for your use case
  const entryIconTransforms = eventData.entry
    ? eventData.entry.map((entry, idx) => {
        if (entry.id === "entry-1") {
          return { translateX: 20, translateY: -8, rotate: 45 };
        }
        if (entry.id === "entry-2") {
          return { translateX: 12, translateY: -5, rotate: 130 };
        }
        if (entry.id === "entry-3") {
          return { translateX: 23, translateY: -4, rotate: -140 };
        }
        if (entry.id === "entry-4") {
          return { translateX: 7, translateY: 0, rotate: -45 };
        }
        return { translateX: 0, translateY: 0, rotate: 0 };
      })
    : [];

  // Staff entry transforms (for staff_entry markers)
  const staffEntryIconTransforms = eventData.staff_entry
    ? eventData.staff_entry.map((entry, idx) => {
        // You can add more cases if you have multiple staff entries
        return {
          translateX: 9,
          translateY: -3,
          rotate: -155,
        };
      })
    : [];
  const mapRef = useRef(null);
  const [mode, setMode] = useState<"car" | "walk">("car");
  const initialRegion = {
    latitude: 56.85409484130903,
    longitude: 26.22099114195495,
    latitudeDelta: 0.006,
    longitudeDelta: 0.006,
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
        {/* Event area polygon: red for car, green for walk */}
        <Polygon
          coordinates={eventAreaCoords}
          strokeColor={mode === "car" ? "#d30505" : "#1c7d48"}
          fillColor={
            mode === "car" ? "rgba(255,0,0,0.3)" : "rgba(60,179,113,0.3)"
          }
          strokeWidth={1}
        />

        {/* Show traffic restrictions only in car mode */}
        {mode === "car" &&
          eventData.no_entry &&
          eventData.no_entry.map((entry) => {
            const StopIcon = iconMap["stop"];
            const pillHeight = 28;
            const gap = 6;
            const iconHeight = 24;
            const wrapperHeight = pillHeight + gap + iconHeight + gap;
            return (
              <Marker
                key={entry.id}
                coordinate={{
                  latitude: entry.coordinates[0],
                  longitude: entry.coordinates[1],
                }}
                anchor={{
                  x: 0.5,
                  y: (pillHeight + gap + iconHeight / 2) / wrapperHeight,
                }}
              >
                <View
                  style={{
                    height: wrapperHeight,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <View
                    style={[
                      styles.pill,
                      { height: pillHeight, marginBottom: gap },
                    ]}
                  >
                    <Text style={styles.pillText}>{entry.name}</Text>
                  </View>
                  <View
                    style={{
                      height: iconHeight,
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <StopIcon width={iconHeight} height={iconHeight} />
                  </View>
                </View>
              </Marker>
            );
          })}
        {mode === "walk" && (
          <>
            {/* entry */}
            {eventData.entry &&
              eventData.entry.map((entry, idx) => {
                const Icon = iconMap[entry.icon] || iconMap["entry"];
                const pillHeight = 28;
                const gap = 6;
                const iconHeight = 28;
                const wrapperHeight = pillHeight + gap + iconHeight + gap;
                // Get transform for this entry
                const transform = entryIconTransforms[idx] || {
                  translateX: 0,
                  rotate: 0,
                };
                return (
                  <Marker
                    key={entry.id}
                    coordinate={{
                      latitude: entry.coordinates[0],
                      longitude: entry.coordinates[1],
                    }}
                    anchor={{
                      x: 0.5,
                      y: (pillHeight + gap + iconHeight / 2) / wrapperHeight,
                    }}
                  >
                    <View
                      style={{
                        height: wrapperHeight,
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <View
                        style={[
                          styles.pill,
                          { height: pillHeight, marginBottom: gap },
                        ]}
                      >
                        <Text style={styles.pillText}>{entry.streetName}</Text>
                      </View>
                      <View
                        style={{
                          height: iconHeight,
                          justifyContent: "flex-end",
                          alignItems: "center",
                          transform: [
                            { translateX: transform.translateX },
                            { translateY: transform.translateY },
                            { rotate: `${transform.rotate}deg` },
                          ],
                        }}
                      >
                        <Icon width={iconHeight} height={iconHeight} />
                      </View>
                    </View>
                  </Marker>
                );
              })}
            {/* staff_entry */}
            {eventData.staff_entry &&
              eventData.staff_entry.map((entry, idx) => {
                const Icon = iconMap[entry.icon] || iconMap["staff_entry"];
                const pillHeight = 28;
                const gap = 6;
                const iconHeight = 28;
                const wrapperHeight = pillHeight + gap + iconHeight + gap;
                const transform = staffEntryIconTransforms[idx] || {
                  translateX: 0,
                  translateY: 0,
                  rotate: 0,
                };
                return (
                  <Marker
                    key={entry.id}
                    coordinate={{
                      latitude: entry.coordinates[0],
                      longitude: entry.coordinates[1],
                    }}
                    anchor={{
                      x: 0.5,
                      y: (pillHeight + gap + iconHeight / 2) / wrapperHeight,
                    }}
                  >
                    <View
                      style={{
                        height: wrapperHeight,
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <View
                        style={[
                          styles.pill,
                          { height: pillHeight, marginBottom: gap },
                        ]}
                      >
                        <Text style={styles.pillText}>Personāla ieeja</Text>
                      </View>
                      <View
                        style={{
                          height: iconHeight,
                          justifyContent: "flex-end",
                          alignItems: "center",
                          transform: [
                            { translateX: transform.translateX },
                            { translateY: transform.translateY },
                            { rotate: `${transform.rotate}deg` },
                          ],
                        }}
                      >
                        <Icon width={iconHeight} height={iconHeight} />
                      </View>
                    </View>
                  </Marker>
                );
              })}
            {/* wc (icon only, no pill) */}
            {eventData.wc &&
              (() => {
                const entry = eventData.wc;
                const Icon = iconMap[entry.icon] || iconMap["wc"];
                const iconHeight = 28;
                return (
                  <Marker
                    key={entry.id}
                    coordinate={{
                      latitude: entry.coordinates[0],
                      longitude: entry.coordinates[1],
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                  >
                    <View
                      style={{
                        height: iconHeight,
                        width: iconHeight,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon width={iconHeight} height={iconHeight} />
                    </View>
                  </Marker>
                );
              })()}
            {/* medicine (icon only, no pill) */}
            {eventData.medicine &&
              (() => {
                const entry = eventData.medicine;
                const Icon = iconMap[entry.icon] || iconMap["medicine"];
                const iconHeight = 28;
                return (
                  <Marker
                    key={entry.id}
                    coordinate={{
                      latitude: entry.coordinates[0],
                      longitude: entry.coordinates[1],
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                  >
                    <View
                      style={{
                        height: iconHeight,
                        width: iconHeight,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon width={iconHeight} height={iconHeight} />
                    </View>
                  </Marker>
                );
              })()}
          </>
        )}
      </MapView>
      {/* Pogas kartes labajā apakšējā stūrī */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={recenterMap}>
          <Ionicons name="locate" size={28} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            mode === "car" && { backgroundColor: "#FF0000" },
          ]}
          onPress={() => setMode("car")}
        >
          <Ionicons
            name="car"
            size={28}
            color={mode === "car" ? "#fff" : "#222"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            mode === "walk" && { backgroundColor: "#3CB371" },
          ]}
          onPress={() => setMode("walk")}
        >
          <Ionicons
            name="walk"
            size={28}
            color={mode === "walk" ? "#fff" : "#222"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

import { Text } from "react-native";

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    alignItems: "flex-end",
    gap: 1,
  },
  iconButton: {
    backgroundColor: "#fff",
    borderRadius: 28,
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pill: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: -28,
    borderWidth: 1,
    borderColor: "#b3b3b3",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    justifyContent: "center",
  },
  pillText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
});
