import { useState } from 'react';
import { Command, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ navigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Command size={24} />
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your Orbit Works workspace</p>
        </div>

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Work Email</label>
            <input
              type="email"
              placeholder="name@orbitworks.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Loader2 size={16} className="animate-spin" /> Signing in...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Sign in <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div style={{ margin: '18px 0 0 0', padding: '12px', background: 'var(--soft)', borderRadius: '10px', fontSize: '12px', color: 'var(--muted)' }}>
          <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Demo Admin Login:</div>
          <div>Email: <code>admin@orbitworks.com</code></div>
          <div>Password: <code>AdminPassword123!</code></div>
        </div>

        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <button onClick={() => navigate('/register')}>Create an account</button>
        </div>
      </div>
    </div>
  );
}
