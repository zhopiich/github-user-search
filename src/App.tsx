import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { FavoritesProvider } from './context/FavoritesContext'
import FavoritesPage from './pages/FavoritesPage'
import SearchPage from './pages/SearchPage'
import UserDetailPage from './pages/UserDetailPage'
import './App.css'

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/user/:login" element={<UserDetailPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </BrowserRouter>
  )
}
