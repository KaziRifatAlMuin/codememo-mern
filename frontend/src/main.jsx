import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import "./index.css"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2800,
            style: {
              background: "#0d1224",
              border: "1px solid #202844",
              color: "#eef4ff",
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
