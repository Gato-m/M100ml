import { useColorScheme } from "react-native";

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return {
    isDark,
    toggleTheme: () => {
      // This is a placeholder. Real implementation would require a context/provider.
      // For demo, we can only simulate theme switching at the app level if context is set up.
    },
  };
}
