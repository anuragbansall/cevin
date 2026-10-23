import { Link } from 'react-router-dom';
import { ArrowRight, Zap, GitPullRequest, Terminal, Shield, GitBranch } from 'lucide-react';

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}
import { GITHUB_INSTALL_URL } from '../lib/config.js';

function FeatureCard({ icon: Icon, title, desc, delay }) {
  return (
    <div
      className="card card-hover p-6 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-950)] border border-[var(--color-brand-900)] flex items-center justify-center mb-4">
        <Icon size={18} className="text-[var(--color-brand-400)]" />
      </div>
      <h3 className="font-semibold text-[15px] text-[var(--color-text-primary)] mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">{desc}</p>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">{value}</div>
      <div className="text-sm text-[var(--color-text-tertiary)] mt-0.5">{label}</div>
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: 'Instant issue triage',
    desc: "Cevin watches your repositories and automatically picks up new issues the moment they're opened.",
  },
  {
    icon: Terminal,
    title: 'Isolated sandboxes',
    desc: 'Every fix runs in a secure, isolated E2B sandbox — no risk to your production environment.',
  },
  {
    icon: GitPullRequest,
    title: 'Automatic pull requests',
    desc: 'After fixing the issue, Cevin commits the changes, pushes a branch, and opens a pull request for your review.',
  },
  {
    icon: GitBranch,
    title: 'Native GitHub integration',
    desc: 'Works as a GitHub App with fine-grained permissions. Install once and connect as many repositories as you need.',
  },
  {
    icon: Shield,
    title: 'Claude-powered reasoning',
    desc: 'Built on Claude, with full access to read files, run commands, and understand your codebase.',
  },
  {
    icon: ArrowRight,
    title: 'Real-time progress',
    desc: 'Watch the agent work in real time — every tool call, every decision, every diff.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh mesh-bg">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-600)] opacity-[0.07] blur-[100px] rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-brand-900)] bg-[var(--color-brand-950)]/60 text-[var(--color-brand-300)] text-xs font-medium mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-400)] animate-pulse" />
            Powered by Claude AI + E2B Sandboxes
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-[var(--color-text-primary)] leading-[1.08] mb-6 animate-fade-in-up stagger-1">
            Your AI software<br />
            <span className="gradient-text">engineer</span> on GitHub
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed mb-10 animate-fade-in-up stagger-2">
            Cevin autonomously triages GitHub issues, writes code fixes in secure sandboxes, and opens pull requests — while you focus on what matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up stagger-3">
            <a
              href={GITHUB_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-5 py-2.5 glow-brand"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Install on GitHub
              <ArrowRight size={14} />
            </a>
            <Link to="/dashboard" className="btn-secondary text-sm px-5 py-2.5">
              View dashboard
            </Link>
          </div>
        </div>

        {/* Terminal preview */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24 animate-fade-in-up stagger-4">
          <div className="card overflow-hidden">
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-3)]">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-[var(--color-text-tertiary)] font-mono">cevin agent · issue #42</span>
            </div>
            <div className="p-5 font-mono text-xs space-y-1.5 text-[var(--color-text-secondary)]">
              <div className="log-line log-info">▸ Received GitHub issue: "Fix broken auth redirect after logout"</div>
              <div className="log-line">▸ Creating E2B sandbox...</div>
              <div className="log-line log-success">✓ Sandbox ready (1.2s)</div>
              <div className="log-line">▸ Cloning acme-corp/frontend...</div>
              <div className="log-line log-success">✓ Repository cloned</div>
              <div className="log-line log-tool">⚙ Calling tool: run_bash → ls -la</div>
              <div className="log-line log-tool">⚙ Calling tool: read_file → src/auth/logout.ts</div>
              <div className="log-line">▸ Identified issue in redirect logic on line 47</div>
              <div className="log-line log-tool">⚙ Calling tool: edit_file → src/auth/logout.ts</div>
              <div className="log-line log-tool">⚙ Calling tool: run_bash → git push origin fix/issue-42</div>
              <div className="log-line log-tool">⚙ Calling tool: create_pull_request</div>
              <div className="log-line log-success">✓ PR opened: https://github.com/acme-corp/frontend/pull/89</div>
              <div className="log-line log-success">✓ Issue #42 comment posted</div>
              <div className="flex gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-400)] animate-pulse mt-1" />
                <span className="text-[var(--color-brand-400)]">Agent completed · 42s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-[var(--color-border)] bg-[var(--color-surface-1)]/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-3 gap-8">
          <StatCard value="< 60s" label="Average issue response" />
          <StatCard value="E2B" label="Isolated sandboxes" />
          <StatCard value="Claude" label="AI reasoning engine" />
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight mb-3">
            Everything you need
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            Cevin handles the entire fix cycle from issue triage to pull request review.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 60} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24 text-center">
        <div className="card p-10 noise-bg">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
            Ready to automate your backlog?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-sm mx-auto">
            Install the GitHub App, connect your repositories, and let Cevin handle the fixes.
          </p>
          <a
            href={GITHUB_INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm px-6 py-3 glow-brand"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Install Cevin for free
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-text-tertiary)]">
          <span>© 2024 Cevin. Built with Claude + E2B.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[var(--color-text-secondary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--color-text-secondary)] transition-colors">Terms</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text-secondary)] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
