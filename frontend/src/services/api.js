const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

function getAuthHeader() {
  const token = localStorage.getItem('orbit_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // Authentication
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(res);
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Contact form
  async submitContact(formData) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return handleResponse(res);
  },

  // Newsletter subscription
  async subscribeNewsletter(email) {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  // Quote request
  async submitQuote(formData) {
    const res = await fetch(`${API_BASE}/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return handleResponse(res);
  },

  // Admin panel
  async getAdminContacts() {
    const res = await fetch(`${API_BASE}/admin/contacts`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async deleteAdminContact(id) {
    const res = await fetch(`${API_BASE}/admin/contacts/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getAdminQuotes() {
    const res = await fetch(`${API_BASE}/admin/quotes`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getAdminNewsletters() {
    const res = await fetch(`${API_BASE}/admin/newsletters`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },
};
