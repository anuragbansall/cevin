import {
  query,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";

import {
  makeReadFileTool,
  makeEditFileTool,
  makeRunBashTool,
  makeAddIssueCommentTool,
  makeCreatePullRequestTool,
} from "../ai-tools/tools.js";
import { config } from "../config/config.js";
import { getInstallationClient } from "../github/client.js";

if (!config.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is missing from configuration");
}

export async function agentLoop(sandbox, REPO_PATH, issue, repository, installationId) {
  const owner = repository.owner.login;
  const repo = repository.name;
  const defaultBranch = repository.default_branch ?? "main";

  const octokit = await getInstallationClient(installationId);

  const server = createSdkMcpServer({
    name: "repo",
    version: "1.0.0",
    tools: [
      makeReadFileTool(sandbox, REPO_PATH),
      makeEditFileTool(sandbox, REPO_PATH),
      makeRunBashTool(sandbox, REPO_PATH),
      makeAddIssueCommentTool(octokit, owner, repo, issue),
      makeCreatePullRequestTool(octokit, owner, repo, defaultBranch),
    ],
  });

  const prompt = `
Fix the following GitHub issue in the repository at ${REPO_PATH}.

Issue title: ${issue.title ?? "Unknown"}
Issue number: #${issue.number}

Issue description:
${issue.body ?? "No description provided"}

## Tools
- read_file / edit_file: read and write files (repository-relative paths only, e.g. "src/index.js")
- run_bash: runs commands in the repo directory
- create_pull_request: opens a PR via the GitHub API (do NOT use git or curl for this)
- add_issue_comment: posts a comment via the GitHub API (do NOT use git or curl for this)

## CRITICAL RULES — follow exactly, no exceptions
- The git remote is already authenticated. Do NOT try to set credentials, tokens, or remote URLs.
- Do NOT use curl, wget, or any HTTP calls in run_bash for GitHub API operations. Use create_pull_request and add_issue_comment tools instead.
- If git push fails for any reason: STOP immediately. Do not retry with different flags, tokens, or methods. Report the error.
- If create_pull_request or add_issue_comment returns an error: STOP. Do not retry.
- Do not attempt more than 2 run_bash calls in a row without making progress.

## Steps — execute in order
1. Inspect the repository: run_bash "ls -la" and "git log --oneline -5"
2. Understand the issue and find what needs to change.
3. Make the necessary code changes using edit_file.
4. Run tests if any exist.
5. Configure git identity:
   - run_bash: git config user.email "bot@cevin.ai"
   - run_bash: git config user.name "Cevin Bot"
6. Create the fix branch: run_bash: git checkout -b fix/issue-${issue.number}
7. Stage and commit: run_bash: git add -A && git commit -m "fix: <short description> (closes #${issue.number})"
8. Push the branch: run_bash: git push origin fix/issue-${issue.number}
   - If this fails: STOP and report the push error. Do not try anything else.
9. Open a pull request using the create_pull_request tool:
   - head: "fix/issue-${issue.number}"
   - base: "${defaultBranch}"
   - Title and body referencing issue #${issue.number}
10. Post a comment on the issue using add_issue_comment with the PR URL.
`;

  for await (const message of query({
    prompt,
    options: {
      mcpServers: { repo: server },
      allowedTools: [
        "mcp__repo__read_file",
        "mcp__repo__edit_file",
        "mcp__repo__run_bash",
        "mcp__repo__add_issue_comment",
        "mcp__repo__create_pull_request",
      ],
      permissionMode: "acceptEdits",
      maxTurns: 20,
    },
  })) {
    if (message.type === "assistant") {
      for (const block of message.message?.content ?? []) {
        if (block.type === "text") {
          console.log(block.text);
        } else if (block.type === "tool_use") {
          console.log(`Calling tool: ${block.name}`);
        }
      }
    }

    if (message.type === "result") {
      console.log("Agent result:", message.subtype);
    }
  }
}
