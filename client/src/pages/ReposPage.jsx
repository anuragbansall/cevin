import { useState } from 'react';
import { GitBranch, ExternalLink, Star, Lock, Globe, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import { GITHUB_INSTALL_URL } from '../lib/config.js';
import { cn } from '../lib/utils.js';

const MOCK_REPOS = [
  { id: 1, full_name: 'acme-corp/frontend', description: 'React + TypeScript customer-facing app', private: false, stars: 42, language: 'TypeScript', tasks_total: 8, tasks_open: 1 },
  { id: 2, full_name: 'acme-corp/api', description: 'Node.js REST API with PostgreSQL', private: true, stars: 0, language: 'JavaScript', tasks_total: 3, tasks_open: 0 },
  { id: 3, full_name: 'acme-corp/analytics', description: 'Internal analytics dashboard', private: true, stars: 0, language: 'Python', tasks_total: 2, tasks_open: 1 },
];

const LANG_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#cc342d',
};

function RepoCard({ repo }) {
  return (
    <div className="card card-hover p-5 flex flex-col gap-4 animate-fade-in-up">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            {repo.private
              ? <Lock size={12} className="text-[var(--color-text-tertiary)] flex-none" />
              : <Globe size={12} className="text-[var(--color-text-tertiary)] flex-none" />
            }
            <a
              href={`https://github.com/${repo.full_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm text-[var(--color-text-primary)] hover:text-[var(--color-brand-300)] transition-colors truncate"
            >
              {repo.full_name}
            </a>
          </div>
          {repo.description && (
            <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed line-clamp-2">{repo.description}</p>
          )}
        </div>
        <a
          href={`https://github.com/${repo.full_name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-4)] transition-colors flex-none"
        >
          <ExternalLink size={13} />
        </a>
      </div>

      <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LANG_COLORS[repo.language] ?? '#666' }} />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-1">
            <Star size={11} />
            {repo.stars}
          </span>
        )}
      </div>

      <div className="border-t border-[var(--color-border)] pt-3 flex items-center justify-between">
        <div className="text-xs text-[var(--color-text-tertiary)]">
          <span className="font-medium text-[var(--color-text-secondary)]">{repo.tasks_total}</span> tasks
          {repo.tasks_open > 0 && (
            <span className="ml-2 text-[var(--color-brand-400)]">
              {repo.tasks_open} running
            </span>
          )}
        </div>
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full border',
          'bg-green-950/40 text-green-400 border-green-900/40'
        )}>
          Connected
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card p-14 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-4)] flex items-center justify-center mb-5">
        <GitBranch size={24} className="text-[var(--color-text-tertiary)]" />
      </div>
      <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">No repositories connected</h3>
      <p className="text-sm text-[var(--color-text-tertiary)] max-w-xs leading-relaxed mb-6">
        Install Cevin as a GitHub App and select the repositories you want the agent to monitor.
      </p>
      <a
        href={GITHUB_INSTALL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary text-[13px]"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
        Connect GitHub
        <ArrowRight size={13} />
      </a>
    </div>
  );
}

export default function ReposPage() {
  const [repos] = useState(MOCK_REPOS);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">Repositories</h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-0.5">Repositories where Cevin is installed</p>
        </div>
        <a
          href={GITHUB_INSTALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-[13px]"
        >
          <Plus size={13} />
          Add repo
        </a>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-brand-950)]/50 border border-[var(--color-brand-900)]/40 mb-6">
        <AlertCircle size={14} className="text-[var(--color-brand-400)] flex-none mt-0.5" />
        <p className="text-xs text-[var(--color-brand-300)] leading-relaxed">
          Repository access is managed through the GitHub App installation. To add or remove repositories, visit the{' '}
          <a href={GITHUB_INSTALL_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--color-brand-200)]">
            GitHub App settings
          </a>.
        </p>
      </div>

      {repos.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo, i) => (
            <div key={repo.id} style={{ animationDelay: `${i * 50}ms` }}>
              <RepoCard repo={repo} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
