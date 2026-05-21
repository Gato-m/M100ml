import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { getMapHtml } from "../../components/mapHtml";

export default function HomeScreen() {
  const webViewRef = useRef(null);
  const { isDark, toggleTheme } = useAppTheme();
  const [webViewKey, setWebViewKey] = useState(0);

  const centerMap = () => {
    webViewRef.current?.injectJavaScript(`
      map.setCenter([26.22105688513661, 56.854071221567]);
      map.setZoom(13);
      true;
    `);
  };

  const switchTheme = () => {
    toggleTheme();
    setTimeout(() => setWebViewKey((k) => k + 1), 100);
  };

  return (
    <View style={styles.container}>
      <WebView
        key={webViewKey}
        ref={webViewRef}
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        source={{ html: getMapHtml(isDark) }}
        style={{ flex: 1 }}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={centerMap}>
          <Text style={styles.buttonText}>Centrēt karti</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={switchTheme}>
          <Text style={styles.buttonText}>
            {isDark ? "Gaišā tēma" : "Tumšā tēma"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonsContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  button: {
    backgroundColor: "#222",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
