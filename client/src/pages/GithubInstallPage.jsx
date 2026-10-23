import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { GITHUB_INSTALL_URL } from '../lib/config.js';

export default function GithubInstallPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const installationId = params.get('installation_id');
  const setupAction = params.get('setup_action');
  const error = params.get('error');

  const [state, setState] = useState('loading'); // loading | success | error | landing

  useEffect(() => {
    if (error) {
      setState('error');
      return;
    }
    if (installationId) {
      // GitHub redirects here after install with installation_id and setup_action=install
      // The backend is webhook-driven so no additional API call needed from the frontend.
      setState('success');
      // Redirect to dashboard after 3 seconds
      const t = setTimeout(() => navigate('/dashboard'), 3000);
      return () => clearTimeout(t);
    }
    // No params — just show install prompt
    setState('landing');
  }, [installationId, error, navigate]);

  if (state === 'loading') {
    return (
      <div className="min-h-dvh mesh-bg flex items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Connecting to GitHub…</span>
        </div>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="min-h-dvh mesh-bg flex items-center justify-center px-4">
        <div className="card p-10 max-w-md w-full text-center animate-fade-in-up">
          <div className="w-14 h-14 rounded-full bg-green-950/50 border border-green-900/40 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Cevin is installed!</h2>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-2 leading-relaxed">
            Installation ID <code className="font-mono text-[var(--color-brand-300)] text-xs bg-[var(--color-surface-4)] px-1.5 py-0.5 rounded">{installationId}</code> is active.
          </p>
          <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed mb-6">
            Open a new issue on any connected repository and Cevin will automatically start working on a fix.
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)]">Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-dvh mesh-bg flex items-center justify-center px-4">
        <div className="card p-10 max-w-md w-full text-center animate-fade-in-up">
          <div className="w-14 h-14 rounded-full bg-red-950/50 border border-red-900/40 flex items-center justify-center mx-auto mb-5">
            <XCircle size={28} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Installation failed</h2>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-6 leading-relaxed">
            {error === 'access_denied'
              ? 'You cancelled the GitHub App installation.'
              : `GitHub returned an error: ${error}`
            }
          </p>
          <a href={GITHUB_INSTALL_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-[13px]">
            Try again
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    );
  }

  // Landing
  return (
    <div className="min-h-dvh mesh-bg flex items-center justify-center px-4">
      <div className="card p-10 max-w-md w-full text-center animate-fade-in-up">
        <div className="w-14 h-14 rounded-xl bg-[var(--color-surface-4)] flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-text-secondary)]">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Install Cevin on GitHub</h2>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-6 leading-relaxed">
          Connect your GitHub repositories to Cevin. You'll choose which repositories to give access to during the installation.
        </p>
        <div className="space-y-2">
          <a
            href={GITHUB_INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center text-[13px] glow-brand"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Install on GitHub
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
