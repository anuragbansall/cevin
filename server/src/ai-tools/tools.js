import { CommandExitError } from "e2b";
import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

export async function runBash(sandbox, command, REPO_PATH) {
  try {
    const result = await sandbox.commands.run(command, {
      cwd: REPO_PATH,
    });

    return {
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (err) {
    if (err instanceof CommandExitError) {
      return {
        exitCode: err.exitCode,
        stdout: err.stdout,
        stderr: err.stderr,
      };
    }

    throw err;
  }
}

export async function readFile(sandbox, path) {
  try {
    const content = await sandbox.files.read(path);

    return {
      exitCode: 0,
      stdout: content,
      stderr: "",
    };
  } catch (err) {
    return {
      exitCode: 1,
      stdout: "",
      stderr: String(err),
    };
  }
}

export async function editFile(sandbox, path, content) {
  try {
    await sandbox.files.write(path, content);

    return {
      exitCode: 0,
      stdout: `Successfully updated ${path}`,
      stderr: "",
    };
  } catch (err) {
    return {
      exitCode: 1,
      stdout: "",
      stderr: String(err),
    };
  }
}

export function makeReadFileTool(sandbox, REPO_PATH) {
  return tool(
    "read_file",
    "Read a file from the repository.",
    { path: z.string() },
    async ({ path }) => {
      const result = await readFile(sandbox, `${REPO_PATH}/${path}`);
      return {
        content: [{
          type: "text",
          text: result.exitCode === 0
            ? String(result.stdout)
            : `Error: ${result.stderr}`,
        }],
      };
    }
  );
}

export function makeEditFileTool(sandbox, REPO_PATH) {
  return tool(
    "edit_file",
    "Write complete updated contents to a repository file.",
    { path: z.string(), content: z.string() },
    async ({ path, content }) => {
      const result = await editFile(sandbox, `${REPO_PATH}/${path}`, content);
      return {
        content: [{
          type: "text",
          text: result.exitCode === 0
            ? result.stdout
            : `Error: ${result.stderr}`,
        }],
      };
    }
  );
}

export function makeRunBashTool(sandbox, REPO_PATH) {
  return tool(
    "run_bash",
    "Run repository inspection, build, or test commands.",
    { command: z.string() },
    async ({ command }) => {
      const result = await runBash(sandbox, command, REPO_PATH);
      return {
        content: [{
          type: "text",
          text: [
            `Exit code: ${result.exitCode}`,
            `stdout:\n${result.stdout ?? ""}`,
            `stderr:\n${result.stderr ?? ""}`,
          ].join("\n"),
        }],
      };
    }
  );
}

export function makeAddIssueCommentTool(octokit, owner, repo, issue) {
  return tool(
    "add_issue_comment",
    "Post a comment on the GitHub issue.",
    { body: z.string() },
    async ({ body }) => {
      try {
        await octokit.request(
          "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
          { owner, repo, issue_number: issue.number, body }
        );
        return { content: [{ type: "text", text: "Comment posted successfully." }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error posting comment: ${err.message}` }] };
      }
    }
  );
}

export function makeCreatePullRequestTool(octokit, owner, repo, defaultBranch) {
  return tool(
    "create_pull_request",
    "Open a pull request for the fix branch.",
    {
      title: z.string(),
      body: z.string(),
      head: z.string().describe("The branch name containing the fix (e.g. fix/issue-42)"),
      base: z.string().default(defaultBranch).describe("The base branch to merge into"),
    },
    async ({ title, body, head, base }) => {
      try {
        const { data } = await octokit.request(
          "POST /repos/{owner}/{repo}/pulls",
          { owner, repo, title, body, head, base }
        );
        return { content: [{ type: "text", text: `Pull request created: ${data.html_url}` }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error creating PR: ${err.message}` }] };
      }
    }
  );
}
