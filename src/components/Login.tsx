import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error: any) {
      setError('Failed to log in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (error: any) {
      setError('Failed to log in with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Log In</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="divider">
          <span>Or</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="auth-button google"
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" className="google-icon">
            <path fill="#4285F4" d="m18 9.2c0-.6-.1-1.3-.2-1.9H9.2v3.6h4.9c-.2 1.1-.9 2-1.8 2.6v2.2h2.9c1.7-1.6 2.8-3.9 2.8-6.5z"/>
            <path fill="#34A853" d="M9.2 18c2.4 0 4.5-.8 6-2.1l-2.9-2.2c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.9H.9v2.3C2.4 15.8 5.6 18 9.2 18z"/>
            <path fill="#FBBC04" d="M4.1 10.7c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V4.6H.9C.3 5.8 0 7.4 0 9.2s.3 3.4.9 4.6l3.2-2.5z"/>
            <path fill="#EA4335" d="M9.2 3.6c1.3 0 2.5.4 3.4 1.3L15 2.6C13.5 1.1 11.4.2 9.2.2 5.6.2 2.4 2.4.9 5.2l3.2 2.5c.7-2.3 2.7-3.9 5.1-3.9z"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
