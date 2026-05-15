import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import Home from "./pages/Home.jsx"
import NoteDetail from "./pages/NoteDetail.jsx"
import NoteEditor from "./pages/NoteEditor.jsx"
import NotFound from "./pages/NotFound.jsx"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/create" element={<NoteEditor />} />
        <Route path="/create/:id" element={<NoteEditor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
