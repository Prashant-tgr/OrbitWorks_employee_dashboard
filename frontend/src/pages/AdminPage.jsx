import { useEffect, useState, useCallback } from 'react';
import {
  Users,
  MessageSquare,
  FileText,
  Mail,
  Trash2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import Card from '../components/Card';
import Page from '../components/Page';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage({ navigate }) {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('contacts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [newsletters, setNewsletters] = useState([]);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [contactsRes, quotesRes, usersRes, newsRes] = await Promise.all([
        api.getAdminContacts(),
        api.getAdminQuotes(),
        api.getAdminUsers(),
        api.getAdminNewsletters(),
      ]);

      setContacts(contactsRes.contacts || []);
      setQuotes(quotesRes.quotes || []);
      setUsersList(usersRes.users || []);
      setNewsletters(newsRes.newsletters || []);
    } catch (err) {
      setError(err.message || 'Failed to load admin data. Please ensure you are logged in as an Admin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [isAdmin, loadAdminData]);

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) return;
    setDeletingId(id);
    try {
      await api.deleteAdminContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete contact submission.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!user || !isAdmin) {
    return (
      <Page title="Admin Portal" subtitle="System administration and data management.">
        <Card style={{ padding: '40px', textAlign: 'center', maxWidth: '520px', margin: '40px auto' }}>
          <div style={{ color: '#d32f2f', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <AlertCircle size={48} />
          </div>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Admin Access Required</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
            You need to be signed in with an administrator account to view the data tables and manage submissions.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="primary" onClick={() => navigate('/login')}>
              Sign in as Admin
            </button>
            <button className="secondary" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </button>
          </div>
        </Card>
      </Page>
    );
  }

  return (
    <Page
      title="Admin Portal"
      subtitle="Overview and management of all Orbit Works collections and submissions."
    >
      <div className="admin-page-container">
        {/* Metric Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <MessageSquare size={22} />
            </div>
            <div className="admin-stat-info">
              <h3>{contacts.length}</h3>
              <p>Contact Submissions</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <FileText size={22} />
            </div>
            <div className="admin-stat-info">
              <h3>{quotes.length}</h3>
              <p>Quote Requests</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Users size={22} />
            </div>
            <div className="admin-stat-info">
              <h3>{usersList.length}</h3>
              <p>Registered Users</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Mail size={22} />
            </div>
            <div className="admin-stat-info">
              <h3>{newsletters.length}</h3>
              <p>Subscribers</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-banner alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="admin-nav-tabs" style={{ marginBottom: 0 }}>
            <button
              className={`admin-nav-tab ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contacts')}
            >
              <MessageSquare size={16} /> Contacts ({contacts.length})
            </button>
            <button
              className={`admin-nav-tab ${activeTab === 'quotes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quotes')}
            >
              <FileText size={16} /> Quotes ({quotes.length})
            </button>
            <button
              className={`admin-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={16} /> Users ({usersList.length})
            </button>
            <button
              className={`admin-nav-tab ${activeTab === 'newsletters' ? 'active' : ''}`}
              onClick={() => setActiveTab('newsletters')}
            >
              <Mail size={16} /> Newsletter ({newsletters.length})
            </button>
          </div>

          <button
            className="secondary"
            onClick={loadAdminData}
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <Card style={{ padding: '60px', textAlign: 'center' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--purple)' }} />
            <p style={{ color: 'var(--muted)', margin: 0 }}>Loading collection data...</p>
          </Card>
        ) : (
          <div className="admin-table-container">
            {/* Contacts Table */}
            {activeTab === 'contacts' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Submitted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                        No contact submissions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td><a href={`mailto:${c.email}`} style={{ color: 'var(--purple)' }}>{c.email}</a></td>
                        <td>{c.phone}</td>
                        <td>{c.subject}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{c.message}</td>
                        <td style={{ color: 'var(--muted)', fontSize: '12px' }}>
                          {new Date(c.createdAt).toLocaleString()}
                        </td>
                        <td>
                          <button
                            className="btn-delete-item"
                            onClick={() => handleDeleteContact(c.id)}
                            disabled={deletingId === c.id}
                          >
                            <Trash2 size={13} />
                            {deletingId === c.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Quotes Table */}
            {activeTab === 'quotes' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Service Required</th>
                    <th>Budget</th>
                    <th>Message</th>
                    <th>Requested At</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                        No quote requests submitted yet.
                      </td>
                    </tr>
                  ) : (
                    quotes.map((q) => (
                      <tr key={q.id}>
                        <td style={{ fontWeight: 600 }}>{q.name}</td>
                        <td><a href={`mailto:${q.email}`} style={{ color: 'var(--purple)' }}>{q.email}</a></td>
                        <td>{q.phone}</td>
                        <td>
                          <span style={{ padding: '3px 8px', background: 'var(--soft)', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                            {q.serviceRequired}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--purple)' }}>{q.budget}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{q.message}</td>
                        <td style={{ color: 'var(--muted)', fontSize: '12px' }}>
                          {new Date(q.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Users Table */}
            {activeTab === 'users' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                        No registered users found.
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role === 'admin' ? <ShieldCheck size={11} style={{ display: 'inline', marginRight: '3px' }} /> : null}
                            {u.role}
                          </span>
                        </td>
                        <td style={{ color: 'var(--muted)', fontSize: '12px' }}>
                          {new Date(u.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Newsletter Table */}
            {activeTab === 'newsletters' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subscriber Email</th>
                    <th>Subscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletters.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                        No newsletter subscribers yet.
                      </td>
                    </tr>
                  ) : (
                    newsletters.map((n) => (
                      <tr key={n.id}>
                        <td style={{ fontWeight: 500 }}>{n.email}</td>
                        <td style={{ color: 'var(--muted)', fontSize: '12px' }}>
                          {new Date(n.subscribedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Page>
  );
}
