import {
  query,
  tool,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";

import { z } from "zod";
import {
  runBash,
  readFile,
  editFile,
} from "../ai-tools/tools.js";
import { config } from "../config/config.js";

if (!config.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is missing from configuration");
}

export async function agentLoop(sandbox, REPO_PATH, issue) {
  const server = createSdkMcpServer({
    name: "repo",
    version: "1.0.0",
    tools: [
      tool(
        "read_file",
        "Read a file from the repository.",
        { path: z.string() },
        async ({ path }) => {
          const result = await readFile(
            sandbox,
            `${REPO_PATH}/${path}`
          );

          return {
            content: [{
              type: "text",
              text: result.exitCode === 0
                ? String(result.stdout)
                : `Error: ${result.stderr}`,
            }],
          };
        }
      ),

      tool(
        "edit_file",
        "Write complete updated contents to a repository file.",
        {
          path: z.string(),
          content: z.string(),
        },
        async ({ path, content }) => {
          const result = await editFile(
            sandbox,
            `${REPO_PATH}/${path}`,
            content
          );

          return {
            content: [{
              type: "text",
              text: result.exitCode === 0
                ? result.stdout
                : `Error: ${result.stderr}`,
            }],
          };
        }
      ),

      tool(
        "run_bash",
        "Run repository inspection, build, or test commands.",
        { command: z.string() },
        async ({ command }) => {
          const result = await runBash(
            sandbox,
            command,
            REPO_PATH
          );

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
      ),
    ],
  });

  const prompt = `
Fix the following GitHub issue in the repository at ${REPO_PATH}.

Issue title: ${issue.title ?? "Unknown"}

Issue description:
${issue.body ?? "No description provided"}

Instructions:
1. Inspect the repository and understand the issue.
2. Find the root cause.
3. Make the necessary code changes.
4. Add or update tests when appropriate.
5. Run relevant tests using run_bash.
6. Review the changes and summarize the fix.
7. Do not commit or push changes.
8. Use repository-relative paths with read_file and edit_file.
`;

  for await (const message of query({
    prompt,
    options: {
      mcpServers: { repo: server },
      allowedTools: [
        "mcp__repo__read_file",
        "mcp__repo__edit_file",
        "mcp__repo__run_bash",
      ],
      permissionMode: "acceptEdits",
      maxTurns: 30,
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
