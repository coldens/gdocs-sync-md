import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

export default function Layout() {
  const { isLogged, data, loading, logout, login } = useAuth();

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <span className="navbar-brand">Navbar</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                  aria-current="page"
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                  aria-current="page"
                  to="/about"
                >
                  About
                </NavLink>
              </li>
            </ul>
            {isLogged && (
              <>
                <span className="navbar-text mx-1">{data?.user.email}</span>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            )}
            {!isLogged && (
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={login}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className="container py-4 px-3 mx-auto">
        <Outlet />
      </main>
    </>
  );
}
