interface Window {
  Telegram?: {
    WebApp?: {
      ready: () => void
      expand: () => void
      initData: string
      // Add other Telegram WebApp methods and properties as needed
    }
  }
}
