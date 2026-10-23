// GitHub App config — from server .env
export const GITHUB_CLIENT_ID = 'Iv23lin0ox0BIPV5IHw3';
export const GITHUB_APP_ID = '5412445';
export const GITHUB_APP_NAME = 'cevin-app';

// In dev the Vite proxy forwards /api → http://localhost:3000
// In production set VITE_API_BASE to your deployed backend URL
export const API_BASE = import.meta.env.VITE_API_BASE ?? '';

// Private app — only the app owner sees the Install button here when logged in.
// If you make the app public this URL works for anyone.
export const GITHUB_INSTALL_URL =
  `https://github.com/apps/${GITHUB_APP_NAME}/installations/new`;
