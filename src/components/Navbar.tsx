import { NavLink } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'

export default function Navbar() {
  const { favorites } = useFavorites()

  return (
    <nav className="navbar">
      <h1>GitHub User Search</h1>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Search
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>
          Favorites
          {favorites.length > 0 && (
            <span className="badge">{favorites.length}</span>
          )}
        </NavLink>
      </div>
    </nav>
  )
}
