import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav
      style={{
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      }}
    >
      <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      >
      {/* Left: Logo and Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link
        to="/"
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#2d3748',
          textDecoration: 'none',
        }}
        >
        FashionShop
        </Link>
        <Link
        to="/"
        style={{
          color: '#4a5568',
          textDecoration: 'none',
        }}
        onMouseOver={e => (e.currentTarget.style.color = '#000')}
        onMouseOut={e => (e.currentTarget.style.color = '#4a5568')}
        >
        {t('navigation.home')}
        </Link>        <Link
        to="/cart"
        style={{
          color: '#4a5568',
          textDecoration: 'none',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
        onMouseOver={e => (e.currentTarget.style.color = '#000')}
        onMouseOut={e => (e.currentTarget.style.color = '#4a5568')}
        >
        {t('navigation.cart')} 🛒
        {getTotalItems() > 0 && (
          <span
            style={{
              background: '#e67e22',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: '-8px',
              right: '-8px',
            }}
          >
            {getTotalItems()}
          </span>
        )}
        </Link>
        <Link
          to="/products"
          style={{
            color: '#4a5568',
            textDecoration: 'none',
          }}
          onMouseOver={e => (e.currentTarget.style.color = '#000')}
          onMouseOut={e => (e.currentTarget.style.color = '#4a5568')}
        >
          {t('navigation.products')}
        </Link>
      </div>
      {/* Right: Language Switcher and User Authentication */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <LanguageSwitcher />
        
        {/* User Authentication */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#4a5568', fontSize: '14px' }}>
              Hello, {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '1px solid #e2e8f0',
                color: '#4a5568',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#f7fafc';
                e.currentTarget.style.borderColor = '#cbd5e0';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/login"
              style={{
                color: '#4a5568',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '6px 12px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#f7fafc';
                e.currentTarget.style.color = '#2d3748';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#4a5568';
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '6px 12px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#5a67d8';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#667eea';
              }}
            >
              Register
            </Link>
          </div>
        )}
      </div>
      </div>
    </nav>
  );
}
