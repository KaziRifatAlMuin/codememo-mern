/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    darkTheme: "codememo",
    themes: [
      {
        codememo: {
          primary: "#7c5cff",
          secondary: "#22d3ee",
          accent: "#60a5fa",
          neutral: "#141a33",
          "base-100": "#070a17",
          "base-200": "#0d1224",
          "base-300": "#202844",
          "base-content": "#eef4ff",
          info: "#38bdf8",
          success: "#2dd4bf",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
    ],
  },
}
