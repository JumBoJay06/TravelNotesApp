import { ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): { expo: any } => ({
  expo: {
    ...config, // 載入預設的 expo 設定
    name: "travelnotesapp",
    slug: "snack-37930d1c-1b4f-425d-b8db-49aa108cc6de",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      config: {
        // 從環境變數讀取 iOS API Key
        googleMapsApiKey: process.env.EXPO_PUBLIC_Maps_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      config: {
        googleMaps: {
          // 從環境變數讀取 Android API Key
          apiKey: process.env.EXPO_PUBLIC_Maps_API_KEY
        }
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
});