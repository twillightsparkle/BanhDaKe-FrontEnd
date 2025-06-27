import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { getTotalItems } = useCart();

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
        Home
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
        Cart 🛒
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
          Products
        </Link>
      </div>
      {/* Right: User Login Placeholder */}
      <div>
        {/* User Login Placeholder */}
        <span style={{ color: '#a0aec0' }}>Login / Register</span>
      </div>
      </div>
    </nav>
  );
}
