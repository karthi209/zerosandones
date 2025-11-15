import { getStoredApiKey } from './admin';

const BASE = import.meta.env.VITE_API_URL || '/api';
const API = BASE;

const authHeaders = () => {
  const key = getStoredApiKey();
  return key ? { 'x-api-key': key } : {};
};

export const adminCreateLog = async ({ title, type, content, rating }) => {
  const res = await fetch(`${API}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ title, type, content, rating }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }
  return res.json();
};


