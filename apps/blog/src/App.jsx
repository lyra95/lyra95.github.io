import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import PostPage from './pages/PostPage'
import TagPage from './pages/TagPage'

export default function App() {
  return (
    <div className="site-wrapper">
      <Header />
      <div className="body-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/*" element={<PostPage />} />
            <Route path="/tag/:tag" element={<TagPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
