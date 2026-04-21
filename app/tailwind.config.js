module.exports = {
  // If you use the "app" folder (Expo Router), make sure "./app/**/*.{js,jsx,ts,tsx}" is here!
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}" // Add this if you have a src folder
  ],
  presets: [require("nativewind/preset")],
  theme: { extend: {height: {'1px' : '1px'}} },
  plugins: [],
}