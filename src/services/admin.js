const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${BASE}/api`;

export const getStoredApiKey = () => {
  // Use admin password from env, fallback to localStorage for backward compatibility
  return import.meta.env.VITE_ADMIN_PASSWORD || localStorage.getItem('admin_api_key') || '';
};

export const setStoredApiKey = (key) => {
  try { localStorage.setItem('admin_api_key', key || ''); } catch { /* ignore */ }
};

const authHeaders = () => {
  const key = getStoredApiKey();
  return key ? { 'x-api-key': key } : {};
};

export const adminCreateBlog = async ({ title, content, category, tags }) => {
  const res = await fetch(`${API}/blogs/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ title, content, category, tags }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

