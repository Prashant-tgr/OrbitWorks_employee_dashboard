import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function QuoteModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceRequired: 'AI Integration',
    budget: '$5,000 - $15,000',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.submitQuote(formData);
      setStatus({
        type: 'success',
        message: res.message || 'Quote request submitted successfully!',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceRequired: 'AI Integration',
        budget: '$5,000 - $15,000',
        message: '',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to submit quote request.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Get a Free Quote</h2>
            <p>Tell us about your project requirements and get a detailed proposal.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {status.message && (
            <div className={`alert-banner alert-${status.type}`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="quote-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="sjenkins@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Service Required *</label>
                <select
                  value={formData.serviceRequired}
                  onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                  required
                >
                  <option value="AI Integration">AI Integration & Automation</option>
                  <option value="Custom Web Development">Custom Web Development</option>
                  <option value="Cloud Architecture">Cloud Architecture & DevOps</option>
                  <option value="UI/UX Design">UI/UX Design System</option>
                  <option value="Enterprise Consulting">Enterprise Consulting</option>
                </select>
              </div>

              <div className="form-group">
                <label>Project Budget *</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  required
                >
                  <option value="< $5,000">&lt; $5,000</option>
                  <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                  <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                  <option value="$50,000+">$50,000+</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Project Details / Message *</label>
                <textarea
                  placeholder="Describe your goals, timeline, and key requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  'Request Quote'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
