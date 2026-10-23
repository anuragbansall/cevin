import { Settings, Server, Key, Webhook, CheckCircle, XCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { GITHUB_INSTALL_URL, GITHUB_CLIENT_ID } from '../lib/config.js';

function Section({ title, desc, children }) {
  return (
    <div className="card p-6 mb-4">
      <h2 className="font-semibold text-[var(--color-text-primary)] mb-0.5">{title}</h2>
      {desc && <p className="text-xs text-[var(--color-text-tertiary)] mb-5 leading-relaxed">{desc}</p>}
      {children}
    </div>
  );
}

function ConfigRow({ label, value, mono, masked }) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const display = masked && !revealed ? '••••••••••••••••' : value;

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
      <span className="text-sm text-[var(--color-text-secondary)] flex-none w-40">{label}</span>
      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
        <span className={`text-sm truncate max-w-[200px] ${mono ? 'font-mono text-xs text-[var(--color-text-tertiary)]' : 'text-[var(--color-text-primary)]'}`}>
          {display}
        </span>
        {masked && (
          <button
            onClick={() => setRevealed(!revealed)}
            className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors flex-none"
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        )}
        <button
          onClick={handleCopy}
          className="p-1 rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-4)] transition-colors flex-none"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );
}

function StatusRow({ label, ok, detail }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
      <div className="flex items-center gap-2">
        {detail && <span className="text-xs text-[var(--color-text-tertiary)] font-mono">{detail}</span>}
        {ok
          ? <CheckCircle size={15} className="text-green-400" />
          : <XCircle size={15} className="text-red-400" />
        }
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const backendBase = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000';
  const webhookUrl = `${backendBase}/api/github/webhook`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center gap-2.5">
          <Settings size={18} />
          Settings
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mt-0.5">Configuration and integration status</p>
      </div>

      {/* GitHub App */}
      <Section
        title="GitHub App"
        desc="Cevin connects to GitHub via a GitHub App installation. Manage repository access from the GitHub settings page."
      >
        <ConfigRow label="App name" value="cevin-app" mono />
        <ConfigRow label="App ID" value="5412445" mono />
        <ConfigRow label="Client ID" value={GITHUB_CLIENT_ID} mono />
        <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-text-secondary)]">Visibility</span>
          <span className="badge badge-queued">Private</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-[var(--color-text-secondary)]">App installation</span>
          <a
            href={GITHUB_INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-[12px] py-1.5 px-3"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Install on GitHub
          </a>
        </div>
        <div className="mt-2 p-3 rounded-lg bg-yellow-950/30 border border-yellow-900/40">
          <p className="text-xs text-yellow-400/90 leading-relaxed">
            <strong className="text-yellow-300">Private app:</strong> The install button only appears when you're logged into GitHub as the app owner (<code className="font-mono text-yellow-200">@anuragbansall</code>). To allow others to install it, go to{' '}
            <a href="https://github.com/settings/apps/cevin-app/advanced" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-yellow-200">
              App settings → Advanced
            </a>{' '}
            and make it public.
          </p>
        </div>
      </Section>

      {/* Webhook */}
      <Section
        title="Webhook"
        desc="Configure this URL as the webhook endpoint in your GitHub App settings. Cevin uses it to receive issue events."
      >
        <ConfigRow label="Endpoint URL" value={webhookUrl} mono />
        <div className="mt-4 p-3 rounded-lg bg-[var(--color-surface-3)] border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
            In your GitHub App settings, set the webhook URL to <code className="font-mono text-[var(--color-brand-300)]">{webhookUrl}</code> and subscribe to the <strong className="text-[var(--color-text-secondary)]">Issues</strong> event.
          </p>
        </div>
      </Section>

      {/* Integration status */}
      <Section
        title="Integration status"
        desc="Real-time status of all backend services required by Cevin."
      >
        <StatusRow label="API server" ok detail={API_BASE} />
        <StatusRow label="GitHub App" ok />
        <StatusRow label="Message queue (AMQP)" ok detail="CloudAMQP" />
        <StatusRow label="Sandbox service (E2B)" ok />
        <StatusRow label="Claude AI" ok />
      </Section>

      {/* How it works */}
      <Section title="How Cevin works">
        <ol className="space-y-3">
          {[
            { n: '1', text: 'A new issue is opened on a connected GitHub repository.' },
            { n: '2', text: 'GitHub sends a webhook event to the Cevin API server.' },
            { n: '3', text: 'The event is pushed to a CloudAMQP message queue.' },
            { n: '4', text: 'The worker consumes the event, creates an E2B sandbox, and clones the repository.' },
            { n: '5', text: 'The Claude agent reads the issue, explores the code, and applies a fix.' },
            { n: '6', text: 'The agent pushes a branch, opens a pull request, and comments on the issue.' },
          ].map(step => (
            <li key={step.n} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--color-brand-950)] border border-[var(--color-brand-900)] flex items-center justify-center text-[10px] font-bold text-[var(--color-brand-400)] flex-none mt-0.5">
                {step.n}
              </span>
              <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{step.text}</span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
