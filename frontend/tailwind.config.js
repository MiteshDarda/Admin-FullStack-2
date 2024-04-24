/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,jsx}"],
  theme: {
    extend: {
      colors: {
        "super-admin": "#A3D6E8",
        "admin": "#FFC0CB",
        "manager": "#90EE90",
        "leader": "#9370DB",
        "qa": "#FFFF00",
        "seo": "#00FF00",
        "thumbnail-designer": "#FFA500",
        "video-editor": "#BA55D3",
        "script-writer": "#DDA0DD",
        "voice-over-assist": "#FFFFE0",
        "member": "#808080",
      },
    },
  },
  plugins: [],
};
