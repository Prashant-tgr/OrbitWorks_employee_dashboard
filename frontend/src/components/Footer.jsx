import { useState } from 'react';
import { Command, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function Footer({ navigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.subscribeNewsletter(email.trim());
      setStatus({
        type: 'success',
        message: res.message || 'Subscribed successfully!',
      });
      setEmail('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Subscription failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="orbit-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand-logo">
            <Command size={22} />
            <b>orbit<span>works</span></b>
          </div>
          <p>
            The intelligent workspace combining team directory, smart analytics, and an AI assistant into one calm environment.
          </p>
        </div>

        <div className="footer-nav">
          <h4>Platform</h4>
          <ul className="footer-links">
            <li><button onClick={() => navigate('/dashboard')}>Overview</button></li>
            <li><button onClick={() => navigate('/assistant')}>AI Assistant</button></li>
            <li><button onClick={() => navigate('/directory')}>Employee Directory</button></li>
            <li><button onClick={() => navigate('/contact')}>Contact Us</button></li>
            <li><button onClick={() => navigate('/admin')}>Admin Portal</button></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Stay in the loop</h4>
          <p>Get the latest product updates, AI insights, and workspace productivity tips.</p>

          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="primary" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Subscribe <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {status.message && (
            <div
              className={`newsletter-status alert-${status.type}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '10px',
              }}
            >
              {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{status.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Orbit Works Inc. All rights reserved.</span>
        <span>Empowering modern intelligent teams.</span>
      </div>
    </footer>
  );
}
