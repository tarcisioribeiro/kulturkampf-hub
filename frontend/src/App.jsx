import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Perfis from './pages/Perfis'
import Postagens from './pages/Postagens'
import Metricas from './pages/Metricas'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'

function Navigation() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Don't show navigation on auth pages
  if (location.pathname === '/login' || location.pathname === '/cadastro') {
    return null
  }

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: '600' }}>KulturKampf</h1>
        <p style={{ marginBottom: '0' }}>Hub de Valeteiros - Comunidade Valete e Substack</p>
      </div>

      <nav className="nav">
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Página Inicial
          </Link>
          <Link to="/perfis" className={location.pathname === '/perfis' ? 'active' : ''}>
            Perfis
          </Link>
          <Link to="/postagens" className={location.pathname === '/postagens' ? 'active' : ''}>
            Artigos
          </Link>
          <Link to="/metricas" className={location.pathname === '/metricas' ? 'active' : ''}>
            Métricas
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated && (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {user?.username}
            </span>
          )}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="secondary"
              style={{ padding: '0.5rem 1rem' }}
            >
              Sair
            </button>
          )}
        </div>
      </nav>
    </>
  )
}

function AppContent() {
  return (
    <div className="container">
      <Navigation />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfis"
          element={
            <ProtectedRoute>
              <Perfis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/postagens"
          element={
            <ProtectedRoute>
              <Postagens />
            </ProtectedRoute>
          }
        />
        <Route
          path="/metricas"
          element={
            <ProtectedRoute>
              <Metricas />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
