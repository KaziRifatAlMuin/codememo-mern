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
          primary: "#22c55e",
          secondary: "#38bdf8",
          accent: "#f59e0b",
          neutral: "#17211d",
          "base-100": "#0b1310",
          "base-200": "#111c17",
          "base-300": "#22332b",
          "base-content": "#e5eee9",
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#f87171",
        },
      },
    ],
  },
}
