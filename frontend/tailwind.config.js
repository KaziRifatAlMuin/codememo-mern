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
    themes: [
      {
        thinkboard: {
          primary: "#2563eb",
          secondary: "#0f766e",
          accent: "#d97706",
          neutral: "#182230",
          "base-100": "#f8fafc",
          "base-200": "#eef2f7",
          "base-300": "#d8e0ec",
          "base-content": "#111827",
          info: "#0284c7",
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626",
        },
      },
    ],
  },
}
