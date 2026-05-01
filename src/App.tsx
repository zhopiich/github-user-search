import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import FavoritesPage from './pages/FavoritesPage'
import SearchPage from './pages/SearchPage'
import UserDetailPage from './pages/UserDetailPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/user/:login" element={<UserDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
