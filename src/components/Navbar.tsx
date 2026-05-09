import { NavLink } from 'react-router-dom'
import { useFavoritesStore } from '../store/favoritesStore'

export default function Navbar() {
  const count = useFavoritesStore(s => s.favorites.length)

  return (
    <nav className="navbar">
      <h1>GitHub User Search</h1>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Search
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>
          Favorites
          {count > 0 && (
            <span className="badge">{count}</span>
          )}
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
          Settings
        </NavLink>
      </div>
    </nav>
  )
}
