import { useState, useEffect, useCallback } from 'react';
import { Zap, GitPullRequest, GitBranch, Clock, ArrowRight, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, StatusDot } from '../components/Badge.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { GITHUB_INSTALL_URL } from '../lib/config.js';
import { api } from '../lib/api.js';
import { timeAgo, truncate } from '../lib/utils.js';

// Mock data used when backend has no tasks endpoint yet
const MOCK_TASKS = [
  {
    id: 'task-1',
    issue_number: 42,
    issue_title: 'Fix broken auth redirect after logout',
    repo: 'acme-corp/frontend',
    status: 'done',
    pr_url: 'https://github.com/acme-corp/frontend/pull/89',
    started_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'task-2',
    issue_number: 51,
    issue_title: 'Dashboard chart crashes on empty dataset',
    repo: 'acme-corp/analytics',
    status: 'running',
    pr_url: null,
    started_at: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 'task-3',
    issue_number: 38,
    issue_title: 'API returns 500 when user has no avatar set',
    repo: 'acme-corp/api',
    status: 'queued',
    pr_url: null,
    started_at: new Date(Date.now() - 30000).toISOString(),
  },
];

function StatCard({ icon: Icon, value, label, sub, color = 'brand' }) {
  const colorMap = {
    brand: 'text-[var(--color-brand-400)]',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-[var(--color-surface-4)] ${colorMap[color]}`}>
          <Icon size={16} />
        </div>
        {sub && <span className="text-xs text-[var(--color-text-tertiary)]">{sub}</span>}
      </div>
      <div className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">{value}</div>
      <div className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{label}</div>
    </div>
  );
}

function TaskRow({ task }) {
  return (
    <div className="card card-hover px-4 py-3.5 flex items-center gap-4">
      <div className="flex-none">
        <StatusDot variant={task.status} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--color-text-tertiary)]">#{task.issue_number}</span>
          <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">{truncate(task.issue_title, 60)}</span>
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
            className="p-1.5 rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-4)] transition-colors"
            title="View pull request"
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function EmptyTasks() {
  return (
    <div className="card p-12 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-4)] flex items-center justify-center mb-4">
        <Zap size={20} className="text-[var(--color-text-tertiary)]" />
      </div>
      <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">No tasks yet</h3>
      <p className="text-sm text-[var(--color-text-tertiary)] max-w-xs leading-relaxed mb-6">
        Install Cevin on a GitHub repository and open an issue to see the agent in action.
      </p>
      <a
        href={GITHUB_INSTALL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary text-[13px]"
      >
        Install on GitHub
        <ArrowRight size={13} />
      </a>
    </div>
  );
}

function ServerNotice({ onDismiss }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-950/30 border border-yellow-900/40 text-sm mb-6">
      <AlertTriangle size={15} className="text-yellow-400 flex-none mt-0.5" />
      <div className="flex-1 min-w-0">
        <span className="text-yellow-300 font-medium">Demo mode</span>
        <span className="text-yellow-400/80 ml-2">Backend is not reachable. Showing example data.</span>
      </div>
      <button onClick={onDismiss} className="text-yellow-500 hover:text-yellow-300 text-xs flex-none">Dismiss</button>
    </div>
  );
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverDown, setServerDown] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      await api.get('/api');
      setServerDown(false);
      // If the backend adds a tasks endpoint, fetch it here:
      // const data = await api.get('/api/tasks');
      // setTasks(data);
      setTasks(MOCK_TASKS);
    } catch {
      setServerDown(true);
      setTasks(MOCK_TASKS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const runningCount = tasks.filter(t => t.status === 'running').length;
  const queuedCount = tasks.filter(t => t.status === 'queued').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight animate-fade-in">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-0.5 animate-fade-in stagger-1">Monitor your agent tasks and activity</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="btn-ghost text-xs"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {serverDown && showNotice && (
        <ServerNotice onDismiss={() => setShowNotice(false)} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard icon={Zap} value={runningCount} label="Running" color="green" sub="live" />
        <StatCard icon={Clock} value={queuedCount} label="Queued" color="yellow" />
        <StatCard icon={GitPullRequest} value={doneCount} label="Completed" color="brand" />
        <StatCard icon={GitBranch} value={tasks.length} label="Total tasks" color="brand" />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <a
          href={GITHUB_INSTALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="card card-hover p-4 flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-4)] flex items-center justify-center flex-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-text-secondary)]">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-[var(--color-text-primary)]">Install on GitHub</div>
            <div className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Connect repositories to Cevin</div>
          </div>
          <ArrowRight size={14} className="text-[var(--color-text-tertiary)] group-hover:translate-x-0.5 transition-transform flex-none" />
        </a>
        <Link to="/repos" className="card card-hover p-4 flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-4)] flex items-center justify-center flex-none">
            <GitBranch size={18} className="text-[var(--color-text-secondary)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-[var(--color-text-primary)]">Manage repositories</div>
            <div className="text-xs text-[var(--color-text-tertiary)] mt-0.5">View connected repos</div>
          </div>
          <ArrowRight size={14} className="text-[var(--color-text-tertiary)] group-hover:translate-x-0.5 transition-transform flex-none" />
        </Link>
      </div>

      {/* Recent tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Recent tasks</h2>
          <Link to="/tasks" className="text-xs text-[var(--color-brand-400)] hover:text-[var(--color-brand-300)] transition-colors">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="card px-4 py-3.5 flex items-center gap-4">
                <div className="skeleton w-2 h-2 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-3/4" />
                  <div className="skeleton h-2 w-1/3" />
                </div>
                <div className="skeleton h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyTasks />
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 10).map((task, i) => (
              <div key={task.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <TaskRow task={task} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
