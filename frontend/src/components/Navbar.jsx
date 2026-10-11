import { Link, NavLink } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <Link className="brand" to="/"><span className="brand-mark">C</span> CampusLoop</Link>
      <nav>
        <NavLink to="/">Explore</NavLink>
        {user && <NavLink to="/sell">+ Sell item</NavLink>}
        {user && <NavLink to="/my-listings">My listings</NavLink>}
      </nav>
      <div className="nav-account">
        {user ? (
          <>
            <span className="welcome">Hi, {user.name.split(" ")[0]}</span>
            <button className="button button-small button-outline" onClick={onLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link className="nav-login" to="/login">Log in</Link>
            <Link className="button button-small" to="/register">Join CampusLoop</Link>
          </>
        )}
      </div>
    </header>
  );
}
