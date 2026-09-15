import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import Card from '../components/Card';
import Page from '../components/Page';
import { api } from '../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.submitContact(formData);
      setStatus({
        type: 'success',
        message: res.message || 'Your message has been sent successfully!',
      });
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to send message. Please check all fields.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      title="Contact Orbit Works"
      subtitle="Have questions about Orbit or need custom enterprise solutions? Reach out to us."
    >
      <div className="contact-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          <Card style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
            <div style={{ background: 'var(--soft)', color: 'var(--purple)', padding: '12px', borderRadius: '12px' }}>
              <Mail size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Email Support</div>
              <div style={{ color: 'var(--muted)', fontSize: '13px' }}>support@orbitworks.com</div>
            </div>
          </Card>

          <Card style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
            <div style={{ background: 'var(--soft)', color: 'var(--purple)', padding: '12px', borderRadius: '12px' }}>
              <Phone size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Call Us</div>
              <div style={{ color: 'var(--muted)', fontSize: '13px' }}>+1 (800) 555-ORBIT</div>
            </div>
          </Card>

          <Card style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
            <div style={{ background: 'var(--soft)', color: 'var(--purple)', padding: '12px', borderRadius: '12px' }}>
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Headquarters</div>
              <div style={{ color: 'var(--muted)', fontSize: '13px' }}>San Francisco, CA</div>
            </div>
          </Card>
        </div>

        <Card className="contact-card">
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px' }}>Send us a message</h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
              Fill in the details below and our team will get back to you promptly.
            </p>
          </div>

          {status.message && (
            <div className={`alert-banner alert-${status.type}`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Your Email *</label>
                <input
                  type="email"
                  placeholder="alex.morgan@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  placeholder="Inquiry or feedback subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                placeholder="How can our team help you?"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="primary"
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', padding: '12px 24px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  Send message <Send size={16} />
                </>
              )}
            </button>
          </form>
        </Card>
      </div>
    </Page>
  );
}
