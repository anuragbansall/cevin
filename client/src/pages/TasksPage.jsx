import { useState, useCallback, useEffect } from 'react';
import { RefreshCw, ExternalLink, Search, Filter, ChevronDown } from 'lucide-react';
import { Badge, StatusDot } from '../components/Badge.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { timeAgo, truncate } from '../lib/utils.js';
import { cn } from '../lib/utils.js';

const ALL_TASKS = [
  { id: 't1', issue_number: 42, issue_title: 'Fix broken auth redirect after logout', repo: 'acme-corp/frontend', status: 'done', pr_url: 'https://github.com', started_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 't2', issue_number: 51, issue_title: 'Dashboard chart crashes on empty dataset', repo: 'acme-corp/analytics', status: 'running', pr_url: null, started_at: new Date(Date.now() - 120000).toISOString() },
  { id: 't3', issue_number: 38, issue_title: 'API returns 500 when user has no avatar set', repo: 'acme-corp/api', status: 'queued', pr_url: null, started_at: new Date(Date.now() - 30000).toISOString() },
  { id: 't4', issue_number: 29, issue_title: 'Search results not paginating correctly', repo: 'acme-corp/frontend', status: 'done', pr_url: 'https://github.com', started_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 't5', issue_number: 17, issue_title: 'Email template missing unsubscribe link', repo: 'acme-corp/mailer', status: 'failed', pr_url: null, started_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 't6', issue_number: 63, issue_title: 'Mobile nav menu overlapping content on iOS', repo: 'acme-corp/frontend', status: 'done', pr_url: 'https://github.com', started_at: new Date(Date.now() - 259200000).toISOString() },
];

const STATUSES = ['all', 'running', 'queued', 'done', 'failed'];

function TaskDetailDrawer({ task, onClose }) {
  if (!task) return null;

  const logs = [
    { type: 'info', text: `Received issue #${task.issue_number}: "${task.issue_title}"` },
    { type: 'default', text: 'Creating E2B sandbox...' },
    { type: 'success', text: '✓ Sandbox ready' },
    { type: 'default', text: `Cloning ${task.repo}...` },
    { type: 'success', text: '✓ Repository cloned' },
    { type: 'tool', text: '⚙ Calling tool: run_bash → ls -la' },
    { type: 'tool', text: '⚙ Calling tool: read_file → relevant file' },
    task.status === 'done' && { type: 'tool', text: '⚙ Calling tool: edit_file → applying fix' },
    task.status === 'done' && { type: 'tool', text: '⚙ Calling tool: create_pull_request' },
    task.status === 'done' && { type: 'success', text: `✓ PR opened` },
    task.status === 'failed' && { type: 'error', text: '✗ git push failed: permission denied' },
    task.status === 'running' && { type: 'info', text: 'Analyzing codebase...' },
    task.status === 'queued' && { type: 'default', text: 'Waiting for sandbox capacity...' },
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-lg max-h-[80dvh] overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-[var(--color-border)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[var(--color-text-tertiary)]">#{task.issue_number}</span>
              <Badge variant={task.status}>{task.status}</Badge>
            </div>
            <h3 className="font-semibold text-[var(--color-text-primary)] text-sm leading-snug">{task.issue_title}</h3>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{task.repo} · {timeAgo(task.started_at)}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 ml-4">✕</button>
        </div>

        <div className="p-5 overflow-y-auto max-h-80">
          <div className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">Agent Log</div>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i} className={cn('log-line', `log-${log.type}`)}>
                {log.text}
              </div>
            ))}
            {task.status === 'running' && (
              <div className="flex items-center gap-2 pt-1">
                <Spinner size={12} className="text-[var(--color-brand-400)]" />
                <span className="text-xs text-[var(--color-brand-400)]">Agent is working…</span>
              </div>
            )}
          </div>
        </div>

        {task.pr_url && (
          <div className="px-5 pb-5 pt-0">
            <a
              href={task.pr_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center text-[13px]"
            >
              <ExternalLink size={13} />
              View Pull Request
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks] = useState(ALL_TASKS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const filtered = tasks.filter(t => {
    const matchStatus = filter === 'all' || t.status === filter;
    const matchSearch = !search || t.issue_title.toLowerCase().includes(search.toLowerCase()) || t.repo.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">Tasks</h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-0.5">All agent runs across your repositories</p>
        </div>
        <button onClick={handleRefresh} className="btn-ghost text-xs">
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-brand-600)] transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
                filter === s
                  ? 'bg-[var(--color-brand-600)] text-white'
                  : 'bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-4)]'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-[var(--color-text-tertiary)]">No tasks match your filters.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task, i) => (
            <button
              key={task.id}
              onClick={() => setSelected(task)}
              className="w-full text-left card card-hover px-4 py-3.5 flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <StatusDot variant={task.status} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--color-text-tertiary)]">#{task.issue_number}</span>
                  <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">{truncate(task.issue_title, 65)}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[var(--color-text-tertiary)]">{task.repo}</span>
                  <span className="text-xs text-[var(--color-text-tertiary)]">{timeAgo(task.started_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-none">
                <Badge variant={task.status}>{task.status}</Badge>
                {task.pr_url && (
                  <a
                    href={task.pr_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-4)] transition-colors"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <TaskDetailDrawer task={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
