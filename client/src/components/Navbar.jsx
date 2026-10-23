import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, GitBranch, Zap, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils.js';
import { GITHUB_INSTALL_URL } from '../lib/config.js';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: Zap },
  { to: '/repos', label: 'Repositories', icon: GitBranch },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function CevinLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#4f46e5"/>
      <path d="M10 16C10 12.686 12.686 10 16 10C17.657 10 19.157 10.672 20.243 11.757" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 16C22 19.314 19.314 22 16 22C14.343 22 12.843 21.328 11.757 20.243" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="2.5" fill="white"/>
      <circle cx="20.5" cy="11.5" r="1.5" fill="#a5b8fc"/>
      <circle cx="11.5" cy="20.5" r="1.5" fill="#a5b8fc"/>
    </svg>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface-1)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <CevinLogo />
              <span className="font-semibold text-[15px] text-[var(--color-text-primary)] tracking-tight">Cevin</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-0.5">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                    pathname.startsWith(to)
                      ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]'
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden sm:flex items-center gap-2">
              <a
                href={GITHUB_INSTALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Must be logged in as the app owner to install a private GitHub App"
                className="btn-primary text-[13px] py-2 px-3.5"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                Install on GitHub
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 rounded-lg text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-3)] transition-colors"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-3 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(to)
                    ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)]'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[var(--color-border)]">
              <a
                href={GITHUB_INSTALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center text-[13px] mt-1"
              >
                Install on GitHub
              </a>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div className="h-14" />
    </>
  );
}
