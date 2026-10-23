# Cevin — AI Software Engineer for GitHub

Cevin is an autonomous GitHub bot powered by **Claude AI** and **E2B sandboxes**. It watches your repositories, triages newly opened issues, writes code fixes in isolated environments, and opens pull requests — all without manual intervention.

---

## How It Works

1. A new GitHub issue is opened in a connected repository.
2. The GitHub App receives the webhook event and publishes it to a **CloudAMQP** message queue.
3. A background **worker** picks up the message, spins up an isolated **E2B sandbox**, and clones the repository inside it.
4. The **Claude AI agent loop** runs — reading files, executing commands, and editing code — until the issue is resolved.
5. The agent pushes a fix branch and opens a **pull request** via the GitHub API, then leaves a comment on the original issue with the PR link.

---

## Architecture

```
GitHub Webhook
      │
      ▼
Express Server  ──►  CloudAMQP Queue
                            │
                            ▼
                       Worker Process
                            │
                            ▼
                      E2B Sandbox  ◄──  Claude Agent Loop
                            │                  │
                     (git clone)      read / edit / run_bash
                                               │
                                        GitHub API (Octokit)
                                               │
                                     create PR + comment
```

### Monorepo layout

```
.
├── client/          # React + Vite frontend (dashboard & landing page)
│   └── src/
│       ├── pages/   # LandingPage, DashboardPage, TasksPage, ReposPage, SettingsPage, …
│       └── components/
└── server/          # Node.js backend
    ├── server.js    # Express entry-point
    └── src/
        ├── agent/           # Claude agent loop (loop.js)
        ├── ai-tools/        # MCP tool definitions (read_file, edit_file, run_bash, …)
        ├── config/          # App config + AMQP connection
        ├── github/          # Octokit GitHub App client
        ├── message-queue/   # CloudAMQP publisher, consumer, worker
        └── routes/          # GitHub webhook route
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI reasoning | [Anthropic Claude](https://www.anthropic.com) via `@anthropic-ai/claude-agent-sdk` |
| Sandboxed execution | [E2B](https://e2b.dev) |
| Message queue | [CloudAMQP](https://www.cloudamqp.com) (AMQP) |
| GitHub integration | [Octokit GitHub App](https://github.com/octokit/app.js) |
| Backend | Node.js + Express v5 |
| Frontend | React 19 + Vite + Tailwind CSS v4 |

---

## Prerequisites

- Node.js ≥ 18
- A [GitHub App](https://docs.github.com/en/apps/creating-github-apps) with **Issues** (read) and **Contents** (write) permissions and webhook events enabled
- An [E2B](https://e2b.dev) account and API key
- A [CloudAMQP](https://www.cloudamqp.com) instance URL
- An [Anthropic](https://console.anthropic.com) API key

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-org>/cevin.git
cd cevin
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
```

Edit `.env` and fill in all required values:

```env
PORT=3000
GITHUB_APP_ID=
GITHUB_CLIENT_ID=
GITHUB_PRIVATE_KEY_PATH=./private-key.pem
GITHUB_WEBHOOK_SECRET=
GITHUB_INSTALLATION_ID=
CLOUDAMQP_URL=
E2B_API_KEY=
ANTHROPIC_API_KEY=
```

### 3. Install dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 4. Run the server

```bash
cd server
npm run dev          # Express server (webhook receiver)
npm run worker:dev   # Background worker (agent runner)
```

### 5. Run the frontend (optional)

```bash
cd client
npm run dev
```

The dashboard is available at `http://localhost:5173` by default.

---

## Usage

1. Install the GitHub App on your repository.
2. Open a new issue — Cevin will automatically pick it up, attempt a fix, and open a pull request within seconds.
3. Review the PR, request changes if needed, and merge when satisfied.

---

## Scripts

### Server

| Command | Description |
|---|---|
| `npm start` | Start the Express server |
| `npm run dev` | Start with hot-reload (nodemon) |
| `npm run worker:start` | Start the AMQP worker |
| `npm run worker:dev` | Start the worker with hot-reload |

### Client

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## License

ISC
