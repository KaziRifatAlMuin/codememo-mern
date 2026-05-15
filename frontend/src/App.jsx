import { Navigate, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import { useAuth } from "./context/AuthContext.jsx"
import Auth from "./pages/Auth.jsx"
import Home from "./pages/Home.jsx"
import NoteDetail from "./pages/NoteDetail.jsx"
import NoteEditor from "./pages/NoteEditor.jsx"
import NotFound from "./pages/NotFound.jsx"
import Profile from "./pages/Profile.jsx"
import UserDetail from "./pages/UserDetail.jsx"
import Users from "./pages/Users.jsx"

function Protected({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div className="skeleton h-52 rounded-lg" />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/notes/:id" element={<Protected><NoteDetail /></Protected>} />
        <Route path="/create" element={<Protected><NoteEditor /></Protected>} />
        <Route path="/create/:id" element={<Protected><NoteEditor /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/users" element={<Protected adminOnly><Users /></Protected>} />
        <Route path="/users/:id" element={<Protected adminOnly><UserDetail /></Protected>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
