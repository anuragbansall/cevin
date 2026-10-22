import { connect } from "../config/amqp.js";
import { consume } from "./consumer.js";

const session = await connect();

try {
  await consume(session, "github-issues", async (message) => {
    const data = JSON.parse(message);

    console.log("🎉 Received GitHub issue!");
    console.log("Repository:", data.repository.full_name);
    console.log("Issue:", data.issue.title);
    console.log("URL:", data.issue.html_url);

    // TODO: Orchestrator creates the fresh sandox for every task and clones the repository
  });

  console.log("👂 Waiting for GitHub issues...");
} catch (error) {
  console.error("Worker error:", error);
  await session.stop();
  process.exitCode = 1;
}

process.on("SIGINT", async () => {
  await session.stop();
  process.exit(0);
});
